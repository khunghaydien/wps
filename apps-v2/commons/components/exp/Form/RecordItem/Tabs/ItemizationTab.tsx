import React, { ComponentType, ReactElement, useMemo, useRef } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import { Text } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import { ContainerProps as BaseCurrencyContainerProps } from '@commons/components/exp/Form/RecordItem/General/BaseCurrency';
import { ContainerProps as ForeignCurrencyContainerProps } from '@commons/components/exp/Form/RecordItem/General/ForeignCurrency';
import { ContainerProps as JobCCEISumContainerProps } from '@commons/components/exp/Form/RecordItem/JobCCEISum';
import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import AddIcon from '@commons/images/icons/add.svg';
import CheckActive from '@commons/images/icons/check-active.svg';
import msg from '@commons/languages';
import WspStyle from '@commons/styles/wsp.scss';
import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import TextUtil from '@commons/utils/TextUtil';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';
import {
  isAmountMatch,
  isCCRecord,
  isItemizedRecord,
  Record as RecordType,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import {
  AmountInputMode,
  ExpTaxByExpType,
  ExpTaxType,
  RoundingModeType,
} from '@apps/domain/models/exp/TaxType';

import Warning from '../../../Warning';
import { Errors } from '../..';
import { Touched } from '..';
import MultipleTaxEntriesForm from '../General/MultipleTaxEntries/MultipleTaxEntriesForm';
import Itemization from '../Itemization';
import ItemizationSkeleton from '../Itemization/Skeleton';

export type ExpTypeOptionList = {
  text: string;
  value: string;
}[];

type ContainerComponentCommonProps = {
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  errors: Errors;
  expPreRecord?: RecordType;
  expPreRequest: Report;
  expRecord: RecordType;
  expReport: Report;
  fixedAmountMessage: string;
  isExpenseRequest: boolean;
  isFinanceApproval: boolean;
  isHighlightDiff: boolean;
  isHighlightNewRecord: boolean;
  readOnly: boolean;
  recordIdx: number;
  touched: Touched;
  onChangeEditingExpReport: (
    key: string,
    value: boolean | number | string | RecordType | RecordItem,
    touched?: Touched | boolean,
    shouldValidate?: boolean
  ) => void;
  updateRecord: (
    updateObj: {
      [key: string]: string | number | RecordItem[];
    },
    recalc?: boolean
  ) => void;
};

export type ContainerProps = ContainerComponentCommonProps & {
  isFixedAllowance: boolean;
};

export type ItemizationProps = ContainerComponentCommonProps & {
  baseCurrencyContainer: ComponentType<BaseCurrencyContainerProps>;
  childExpTypeList: ExpenseType[];
  currencyCode: string;
  currencyDecimalPlaces: number;
  currencySymbol: string;
  expTypeOptionList: ExpTypeOptionList;
  foreignCurrencyContainer: ComponentType<ForeignCurrencyContainerProps>;
  isLoading: boolean;
  isTaxIncluded: boolean;
  loadingAreas: string[];
  taxTypeObj: ExpTaxByExpType;
  useForeignCurrency: boolean;
  calculateAndUpdateAmount: (
    isTaxIncluded: boolean,
    itemIdx: number,
    selectedTaxType?: ExpTaxType,
    amountInput?: number
  ) => void;
  jobCCEISumContainer: (props: JobCCEISumContainerProps) => ReactElement;
  onChangeLocalAmount: (localAmount: number, idx: number) => void;
  searchTaxTypeAndCalculate: (expTypeId: string, idx: number) => void;
};

type Props = ItemizationProps & {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  expTaxRoundingSetting: RoundingModeType;
  isFixedAllowance: boolean;
  isItemizationLoading: boolean;
  isMultipleTax: boolean;
  onClickAddBtn: () => void;
};

const ItemizationTab = (props: Props) => {
  const scrollRef = useRef(null);
  const {
    allowTaxAmountChange,
    allowTaxExcludedAmount,
    currencyDecimalPlaces,
    currencySymbol,
    customHint,
    errors,
    expPreRecord,
    expRecord,
    expTaxRoundingSetting,
    fixedAmountMessage,
    isExpenseRequest,
    isFinanceApproval,
    isFixedAllowance,
    isHighlightDiff,
    isHighlightNewRecord,
    isItemizationLoading,
    isMultipleTax,
    isTaxIncluded,
    readOnly,
    recordIdx,
    useForeignCurrency,
    calculateAndUpdateAmount,
    onChangeLocalAmount,
    onClickAddBtn,
    updateRecord,
  } = props;
  const { amountInputMode, items } = expRecord;
  const {
    allowNegativeAmount = false,
    amount,
    currencyInfo,
    localAmount,
    withoutTax,
  } = items[0];

  const parentItemFinalAmount = useForeignCurrency
    ? localAmount
    : isTaxIncluded
    ? amount
    : withoutTax;
  const decimalPlaces = useForeignCurrency
    ? get(expRecord, 'items.0.currencyInfo.decimalPlaces', 0)
    : currencyDecimalPlaces;
  const isAllowTaxIncludedMode = allowTaxExcludedAmount && isTaxIncluded;
  const isTaxExcludedMode = amountInputMode === AmountInputMode.TaxExcluded;
  const recordError = get(errors, `records.${recordIdx}`, {});
  const itemizeRequiredError = get(
    recordError,
    `items.0.expTypeItemizationSetting`,
    ''
  );

  const onChangeAmountField = (value: number | null) => {
    if (useForeignCurrency) {
      onChangeLocalAmount(value, 0);
      return;
    }
    calculateAndUpdateAmount(true, 0, undefined, value);
  };

  const onChangeAmountExclField = (value: number | null) => {
    calculateAndUpdateAmount(false, 0, undefined, value);
  };

  const onClickAddItemizationBtn = () => {
    onClickAddBtn();
    setTimeout(() => {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 1);
  };

  const toggleInputMode = () => {
    const nextMode = isTaxIncluded
      ? AmountInputMode.TaxExcluded
      : AmountInputMode.TaxIncluded;
    updateRecord({
      amountInputMode: nextMode,
    });
  };

  const getHighlightClass = (key: string) => {
    const preRecord = expPreRecord || {};
    const isDifferent = expRecord[key] !== preRecord[key];
    const isHighlight =
      isHighlightNewRecord || (isHighlightDiff && isDifferent);

    return {
      'highlight-bg': isHighlight,
    };
  };

  const getAmountFlag = () => {
    const isRecordCC = isCCRecord(expRecord);
    const isAllowOrTaxExclMode =
      allowTaxExcludedAmount || (!allowTaxExcludedAmount && isTaxExcludedMode);

    const isDisableAmountInclEditBtn = readOnly || !isTaxExcludedMode;
    const isShowAmountInclEditBtn =
      isAllowOrTaxExclMode && !useForeignCurrency && !isRecordCC;
    const isDisabledAmountIncl = readOnly || isTaxExcludedMode || isRecordCC;

    const isDisableAmountExclEditBtn = readOnly || !isAllowTaxIncludedMode;
    const isShowAmountExclEditBtn =
      allowTaxExcludedAmount &&
      !useForeignCurrency &&
      !isFinanceApproval &&
      !isRecordCC &&
      !isDisableAmountExclEditBtn;
    const isDisabledAmountExcl =
      readOnly || isAllowTaxIncludedMode || !allowTaxExcludedAmount;

    return {
      isShowAmountInclEditBtn,
      isDisableAmountInclEditBtn,
      isDisabledAmountIncl,
      isShowAmountExclEditBtn,
      isDisableAmountExclEditBtn,
      isDisabledAmountExcl,
    };
  };

  const amountInclEditBtnColor =
    isTaxExcludedMode && !readOnly ? 'action' : 'disable';
  const amountExclEditBtnColor =
    isAllowTaxIncludedMode && !readOnly ? 'action' : 'disable';
  const {
    isShowAmountInclEditBtn,
    isDisableAmountInclEditBtn,
    isDisabledAmountIncl,
    isShowAmountExclEditBtn,
    isDisableAmountExclEditBtn,
    isDisabledAmountExcl,
  } = useMemo(getAmountFlag, [amountInputMode, readOnly]);

  const childItemTotalAmount = calculateTotalAmountForItems(
    decimalPlaces,
    expRecord,
    useForeignCurrency
  );
  const isTotalAmountMatch = isAmountMatch(
    parentItemFinalAmount || 0,
    childItemTotalAmount
  );
  const warningLabel = useForeignCurrency
    ? msg().Exp_Msg_LocalAmountOfItemizationDoNotAddUpToTotal
    : msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal;
  const formattedChildItemTotalAmount = FormatUtil.formatNumber(
    childItemTotalAmount,
    useForeignCurrency
      ? currencyInfo?.decimalPlaces || 0
      : currencyDecimalPlaces
  );
  const foreignCurrencySymbol = currencyInfo?.symbol || '';
  const totalLocalAmountCurrencySymbol = useForeignCurrency
    ? foreignCurrencySymbol
    : currencySymbol;
  const warningAmount = `${
    useForeignCurrency ? foreignCurrencySymbol : currencySymbol
  }${formattedChildItemTotalAmount || 0}`;
  const warningMsg = TextUtil.template(warningLabel, warningAmount);

  const isDisableActionBtn = readOnly || isFinanceApproval;

  const totalLocalAmountLabel = `${msg().Exp_Lbl_TotalLocalAmount} ${
    foreignCurrencySymbol ? `(${foreignCurrencySymbol})` : ''
  }`;
  const { status, message } = generateOCRAmountMsg(
    expRecord.ocrAmount,
    parentItemFinalAmount,
    currencyDecimalPlaces,
    'Exp_Clbl_IncludeTax'
  );

  return (
    <>
      {isItemizationLoading && <ItemizationSkeleton />}
      <ContentWrapper ref={scrollRef}>
        {isMultipleTax ? (
          <MultipleTaxEntriesForm
            allowTaxAmountChange={allowTaxAmountChange}
            allowTaxExcludedAmount={allowTaxExcludedAmount}
            baseCurrencyDecimal={currencyDecimalPlaces}
            baseCurrencySymbol={currencySymbol}
            customHint={customHint}
            errors={recordError}
            expPreRecord={expPreRecord}
            expRecord={expRecord}
            fixedAmountMessage={fixedAmountMessage}
            isExpenseRequest={isExpenseRequest}
            isFinanceApproval={isFinanceApproval}
            isFixedAllowance={isFixedAllowance}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewRecord}
            isItemized={isItemizedRecord(expRecord.items.length)}
            isShowIcon
            isMileageRecord={false}
            readOnly={readOnly}
            taxRoundingSetting={expTaxRoundingSetting}
            toggleInputMode={toggleInputMode}
            updateRecord={updateRecord}
          />
        ) : (
          <AmountGroup>
            <MultiColumnsGrid sizeList={[6, 6]}>
              <div className="ts-text-field-container">
                <TotalLabelGroup>
                  <LabelWithHint
                    text={
                      useForeignCurrency
                        ? totalLocalAmountLabel
                        : msg().Exp_Lbl_TotalAmountInclTax
                    }
                  />
                  {isShowAmountInclEditBtn && (
                    <Button
                      type="text"
                      disabled={isDisableAmountInclEditBtn}
                      onClick={toggleInputMode}
                    >
                      <Text size="large" color={amountInclEditBtnColor}>
                        {msg().Com_Btn_Edit}
                      </Text>
                    </Button>
                  )}
                </TotalLabelGroup>
                <TotalAmountField
                  allowNegative={allowNegativeAmount}
                  className={classNames(
                    getHighlightClass(
                      useForeignCurrency ? 'localAmount' : 'amount'
                    )
                  )}
                  currencySymbol={
                    isDisabledAmountIncl ? totalLocalAmountCurrencySymbol : ''
                  }
                  disabled={isDisabledAmountIncl}
                  fractionDigits={decimalPlaces}
                  value={(useForeignCurrency ? localAmount : amount) || 0}
                  onBlur={onChangeAmountField}
                />
                {!isNil(expRecord.ocrAmount) && (
                  <div className={`input-feedback ${status.toLowerCase()}`}>
                    {status === AMOUNT_MATCH_STATUS.OK && (
                      <CheckActive className="input-feedback-icon-ok" />
                    )}
                    {message}
                  </div>
                )}
                {allowNegativeAmount &&
                  !isNil(parentItemFinalAmount) &&
                  parentItemFinalAmount < 0 &&
                  isTaxIncluded && (
                    <Warning
                      message={TextUtil.template(
                        msg().Exp_Lbl_NegativeAmount,
                        useForeignCurrency
                          ? msg().Exp_Clbl_LocalAmount
                          : msg().Exp_Clbl_IncludeTax
                      )}
                    />
                  )}
                {(!isDisabledAmountIncl || readOnly) && !isTotalAmountMatch && (
                  <Warning message={warningMsg} />
                )}
              </div>
              <div className="ts-text-field-container">
                <TotalLabelGroup>
                  <LabelWithHint
                    text={
                      useForeignCurrency
                        ? msg().Exp_Lbl_TotalAmount
                        : msg().Exp_Lbl_TotalAmountExclTax
                    }
                  />
                  {isShowAmountExclEditBtn && (
                    <Button
                      type="text"
                      disabled={isDisableAmountExclEditBtn}
                      onClick={toggleInputMode}
                    >
                      <Text size="large" color={amountExclEditBtnColor}>
                        {msg().Com_Btn_Edit}
                      </Text>
                    </Button>
                  )}
                </TotalLabelGroup>
                <TotalAmountField
                  allowNegative={allowNegativeAmount}
                  className={classNames(
                    getHighlightClass(
                      useForeignCurrency ? 'amount' : 'withoutTax'
                    )
                  )}
                  currencySymbol={isDisabledAmountExcl ? currencySymbol : ''}
                  disabled={isDisabledAmountExcl}
                  fractionDigits={currencyDecimalPlaces}
                  value={(useForeignCurrency ? amount : withoutTax) || 0}
                  onBlur={onChangeAmountExclField}
                />
                {allowNegativeAmount &&
                  !isNil(parentItemFinalAmount) &&
                  isTaxExcludedMode &&
                  parentItemFinalAmount < 0 && (
                    <Warning
                      message={TextUtil.template(
                        msg().Exp_Lbl_NegativeAmount,
                        useForeignCurrency
                          ? msg().Exp_Clbl_LocalAmount
                          : msg().Exp_Clbl_WithoutTax
                      )}
                    />
                  )}
                {!isDisabledAmountExcl &&
                  !isTotalAmountMatch &&
                  !useForeignCurrency && <Warning message={warningMsg} />}
              </div>
            </MultiColumnsGrid>
          </AmountGroup>
        )}
        {itemizeRequiredError && (
          <Error className="input-feedback">
            {msg()[itemizeRequiredError]}
          </Error>
        )}
        {items.map(
          (item: RecordItem, idx: number) =>
            idx > 0 && (
              <Itemization
                key={item.itemId || item.tempUUID}
                idx={idx}
                isDisableRemoveBtn={isDisableActionBtn}
                item={item}
                {...props}
              />
            )
        )}
      </ContentWrapper>
      <FooterWrapper>
        <AddButton
          disabled={isDisableActionBtn}
          iconSrc={AddIcon}
          iconSrcType="svg"
          type="default"
          onClick={onClickAddItemizationBtn}
        >
          {msg().Exp_Btn_AddItemization}
        </AddButton>
      </FooterWrapper>
    </>
  );
};

export default ItemizationTab;

const AmountGroup = styled.div`
  padding: 15px 20px 25px 20px;

  > .slds-grid {
    gap: 20px;
    width: calc(100% - 20px);
  }
`;

const ContentWrapper = styled.div`
  overflow: auto;
  height: calc(100% - 51px - 65px); // 100% - header - footer
  background-color: ${WspStyle['color-background-1']};

  .key {
    margin-bottom: 4px;
  }
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px;
  background-color: ${WspStyle['color-background-2']};
  border-top: solid 1px ${WspStyle['color-border-2']};
  border-bottom: solid 1px ${WspStyle['color-border-2']};
`;

const AddButton = styled(Button)<{ disabled: boolean }>`
  height: 32px;
  width: 199px;

  .ts-button__contents {
    height: 100%;

    svg {
      transform: translate(-10px, 0) scale(0.3);

      > path {
        fill ${({ disabled }) =>
          disabled ? WspStyle['color-border-1'] : WspStyle['color-exp-primary']}
      }
    }

    .ts-button__text {
      margin-left: -20px;
    }
  }
`;

const TotalLabelGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

const TotalAmountField = styled(AmountField)`
  text-align: right;
`;

const Error = styled.div`
  padding-left: 20px;
`;
