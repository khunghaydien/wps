import React, { useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { get, isNil } from 'lodash';

import styled from 'styled-components';

import { Text } from '../../../../../../../core';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import Warning from '@commons/components/exp/Warning';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import usePrevious from '@commons/hooks/usePrevious';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import CheckActive from '@commons/images/icons/check-active.svg';
import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';

import {
  isAmountMatch,
  isCCRecord,
  isIcRecord,
  isItemizedRecord,
  Record as TypeRecord,
} from '../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  ExpTaxTypeList,
} from '../../../../../../../domain/models/exp/TaxType';
import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import AmountField from '../../../../../fields/AmountField';
import MultiColumnsGrid from '../../../../../MultiColumnsGrid';
import Tooltip from '../../../../../Tooltip';
import { RecordErrors, Touched } from '../..';
import MultipleTaxEntriesForm from '../MultipleTaxEntries/MultipleTaxEntriesForm';
import Tax from './Tax';
import AmountWithoutTaxArea from './Tax/AmountWithoutTaxArea';
import WithholdingTaxArea from './WithholdingTax';

export type ContainerProps = {
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint?: CustomHint;
  errors: RecordErrors;
  expPreRecord: TypeRecord;
  expRecord: TypeRecord;
  fixedAmountMessage?: string;
  isChildItem?: boolean;
  isExpenseRequest: boolean;
  isFinanceApproval: boolean;
  isFixedAllowance?: boolean;
  isHideTaxType?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isItemized: boolean;
  isMileageRecord?: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  targetRecord: string;
  touched: Touched;
  onChangeEditingExpReport: (
    key: string,
    value: string | number | boolean | TypeRecord,
    recalc?: boolean,
    isTouched?: boolean
  ) => void;
  updateRecord?: (
    updateObj: {
      [key: string]: string | number | boolean;
    },
    recalc?: boolean
  ) => void;
};

type Props = {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint?: CustomHint;
  errors: { items?: Array<Record<string, any>> };
  expPreRecord?: TypeRecord;
  expRecord: TypeRecord;
  fixedAmountMessage?: string;
  isExpenseRequest: boolean;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isHideTaxType?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isItemized: boolean;
  isLoading: boolean;
  isMileageRecord?: boolean;
  loadingAreas: string[];
  readOnly: boolean;
  recordItemIdx: number;
  // Container own props
  targetRecord: string;
  tax: {
    [key: string]: {
      [key: string]: ExpTaxTypeList;
    };
  };
  taxRoundingSetting: RoundingType;
  touched: any;
  calcTaxFromGstVat: (arg0: number) => void;
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId?: string,
    taxName?: string
  ) => void;
  onChangeEditingExpReport: (
    key: string,
    value: any,
    recalc?: boolean,
    isTouched?: boolean
  ) => void;
  onChangeTaxWithholdingAmount: (amount: number) => void;
  onClickEditButton: () => void;
  searchTaxTypeList: (loadInBackground) => void;
  toggleInputMode: () => void;
  updateRecord: (
    updateObj: {
      [key: string]: any;
    },
    recalc?: boolean
  ) => void;
};

const ROOT = 'ts-expenses-requests__contents__amount';

const BaseCurrency = (props: Props) => {
  const thisExpRecord: TypeRecord = usePrevious(props.expRecord);

  useEffect(() => {
    props.searchTaxTypeList(true);
  }, []);

  useEffect(() => {
    if (!props.readOnly) {
      if (!thisExpRecord) {
        return;
      }
      const { recordId, amount } = thisExpRecord;
      const { recordId: nextId, amount: nextAmount } = props.expRecord;
      const isSameRecord = recordId === nextId;
      const isAmountChange = amount !== nextAmount;

      if (
        (props.isFixedAllowance || props.isMileageRecord) &&
        isSameRecord &&
        isAmountChange &&
        !isNil(nextAmount)
      ) {
        props.onChangeAmountOrTaxType(nextAmount, true);
      }

      const isChild = props.recordItemIdx > 0;
      const isCreateNew = !props.expRecord.recordId;
      if (isChild || isCreateNew) {
        return;
      }
      const thisItem = thisExpRecord.items[0];
      const nextItem = props.expRecord.items[0];

      const isExpTypeChanged = thisItem.expTypeId !== nextItem.expTypeId;
      const hasNoTaxWithDate = !get(
        props,
        `tax[${nextItem.expTypeId}][${props.expRecord.recordDate}]`
      );

      if (isExpTypeChanged || hasNoTaxWithDate) {
        props.searchTaxTypeList(!isSameRecord);
      }
    }
  }, [props]);

  const getDiffValues = (): DifferenceValues => {
    const {
      expRecord,
      expPreRecord,
      isHighlightDiff,
      isHighlightNewRecord,
      recordItemIdx = 0,
    } = props;
    let diffValues = {};
    if (!isHighlightNewRecord && isHighlightDiff && expPreRecord) {
      const diffMapping = {
        amount: 'amount',
        amountPayable: 'amountPayable',
        taxTypeName: 'taxTypeName',
        withoutTax: 'withoutTax',
        gstVat: 'gstVat',
        withholdingTaxAmount: 'withholdingTaxAmount',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expRecord.items[recordItemIdx],
        expPreRecord.items[recordItemIdx]
      );
    }
    return diffValues;
  };

  const {
    customHint,
    readOnly,
    baseCurrencyDecimal,
    baseCurrencySymbol,
    tax,
    expRecord,
    errors,
    recordItemIdx = 0,
    isFixedAllowance,
    isFinanceApproval,
    isHideTaxType = false,
    isHighlightNewRecord,
    isLoading,
    fixedAmountMessage,
    isExpenseRequest,
    allowTaxExcludedAmount,
    allowTaxAmountChange,
    loadingAreas,
    toggleInputMode,
    onChangeTaxWithholdingAmount,
    isMileageRecord,
  } = props;

  const { expTypeId } = expRecord.items[recordItemIdx];
  const isParentRecord = recordItemIdx === 0;
  const recordDate = isParentRecord
    ? expRecord.items[recordItemIdx].recordDate || expRecord.recordDate
    : expRecord.recordDate;

  const expenseTaxTypeList =
    tax[expTypeId] && tax[expTypeId][recordDate]
      ? tax[expTypeId][recordDate]
      : [];

  const isRecordTypeIc = isIcRecord(expRecord.recordType);
  const isExpenseIcRecord = !isExpenseRequest && isRecordTypeIc;
  const isRecordCC = isCCRecord(expRecord);
  const isTaxExcludedMode =
    expRecord.amountInputMode === AmountInputMode.TaxExcluded;
  const val = expRecord.items[recordItemIdx].amount;
  const ocrAmount = expRecord.ocrAmount;
  const { status, message } = generateOCRAmountMsg(
    ocrAmount,
    val,
    baseCurrencyDecimal,
    'Exp_Clbl_IncludeTax'
  );
  const diffValues = getDiffValues();
  const amountReadOnlyClassName =
    'input_right-aligned input_disabled_no-border input_disabled_no-background';
  const amountClassName = readOnly
    ? amountReadOnlyClassName
    : 'input_right-aligned';
  const isNegative = !isNil(val) && val < 0;
  const allowNegativeAmount = get(
    expRecord,
    `items.${recordItemIdx}.allowNegativeAmount`,
    false
  );
  const errorNegativeAmount = get(errors, `items.${recordItemIdx}.amount`);

  const disabledAmountField =
    readOnly ||
    isFixedAllowance ||
    isExpenseIcRecord ||
    isTaxExcludedMode ||
    (isRecordCC && isParentRecord) ||
    isMileageRecord;

  const isParentChildItems =
    isParentRecord && isItemizedRecord(expRecord.items.length);
  const childItemTotalAmount = calculateTotalAmountForItems(
    baseCurrencyDecimal,
    expRecord,
    false,
    'amount'
  );
  const childItemTotalWithoutTaxAmount = calculateTotalAmountForItems(
    baseCurrencyDecimal,
    expRecord,
    false,
    'withoutTax'
  );
  const isTotalAmountMatch = isAmountMatch(val || 0, childItemTotalAmount);

  const amountField = useMemo(
    () => (
      <>
        <AmountField
          allowNegative={allowNegativeAmount}
          className={classNames(amountClassName, {
            'highlight-bg':
              isHighlightNewRecord || isDifferent('amount', diffValues),
          })}
          disabled={disabledAmountField}
          fractionDigits={baseCurrencyDecimal}
          value={val}
          onBlur={(value: number | null) =>
            props.onChangeAmountOrTaxType(value, true)
          }
          data-testid={ROOT}
        />
        {!isNil(ocrAmount) && isParentRecord && (
          <div className={`input-feedback ${status.toLowerCase()}`}>
            {status === AMOUNT_MATCH_STATUS.OK && (
              <CheckActive className="input-feedback-icon-ok" />
            )}
            {message}
          </div>
        )}
        {isNegative &&
          !allowNegativeAmount &&
          errorNegativeAmount &&
          isParentRecord && (
            <div className="input-feedback">{msg()[errorNegativeAmount]}</div>
          )}
        {isNegative &&
          allowNegativeAmount &&
          isParentRecord &&
          !isTaxExcludedMode && (
            <div className={`${ROOT}__negative-warning`}>
              <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
              <span className={`${ROOT}__negative-warning-msg`}>
                {TextUtil.template(
                  msg().Exp_Lbl_NegativeAmount,
                  msg().Exp_Clbl_IncludeTax
                )}
              </span>
            </div>
          )}
        {(!disabledAmountField || readOnly) &&
          isParentChildItems &&
          !isTotalAmountMatch && (
            <Warning
              message={TextUtil.template(
                msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
                `${baseCurrencySymbol}${FormatUtil.formatNumber(
                  childItemTotalAmount,
                  baseCurrencyDecimal
                )}`
              )}
            />
          )}
      </>
    ),
    [
      allowNegativeAmount,
      amountClassName,
      isHighlightNewRecord,
      diffValues,
      disabledAmountField,
      baseCurrencyDecimal,
      val,
      status,
      message,
      isNegative,
      errorNegativeAmount,
    ]
  );
  const isEditButtonShown =
    allowTaxExcludedAmount || (!allowTaxExcludedAmount && isTaxExcludedMode);
  const containerClass = classNames({
    [ROOT]: true,
    'is-ic-record': isRecordTypeIc,
  });

  const isMultipleTax = expRecord.items[recordItemIdx]?.taxItems?.length > 0;

  if (isMultipleTax) {
    return (
      <MultipleTaxEntriesWrapper>
        <MultipleTaxEntriesForm {...props} />
      </MultipleTaxEntriesWrapper>
    );
  }

  return (
    <div className={containerClass}>
      <MultiColumnsGrid sizeList={[6, 6]}>
        <div className={`${ROOT}__amount`}>
          <div className="ts-text-field-container">
            <div className="title">
              <LabelWithHint
                text={msg().Exp_Clbl_IncludeTax}
                hintMsg={props.customHint.recordIncludeTax}
              />
              {recordItemIdx === 0 &&
              !isFixedAllowance &&
              !isRecordTypeIc &&
              !isRecordCC &&
              !isMileageRecord &&
              isEditButtonShown ? (
                <Button
                  type="text"
                  className={`${ROOT}__edit-button`}
                  data-testid={`${ROOT}__edit-button`}
                  disabled={readOnly || !isTaxExcludedMode}
                  onClick={toggleInputMode}
                >
                  <Text
                    size="large"
                    color={
                      isTaxExcludedMode && !readOnly ? 'action' : 'disable'
                    }
                  >
                    {msg().Com_Btn_Edit}
                  </Text>
                </Button>
              ) : null}
            </div>
            {(isFixedAllowance && !readOnly && (
              <Tooltip id={ROOT} align="top" content={fixedAmountMessage}>
                <div>{amountField}</div>
              </Tooltip>
            )) ||
              amountField}
          </div>
        </div>

        <AmountWithoutTaxArea
          readOnly={readOnly || isMileageRecord}
          isFinanceApproval={isFinanceApproval}
          isFixedAllowance={isFixedAllowance}
          expRecordItem={expRecord.items[recordItemIdx]}
          className={classNames({
            'highlight-bg':
              isHighlightNewRecord || isDifferent('withoutTax', diffValues),
          })}
          isRecordCC={isCCRecord(expRecord)}
          recordItemIdx={recordItemIdx}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          allowTaxExcludedAmount={allowTaxExcludedAmount}
          inputMode={expRecord.amountInputMode}
          hintMsg={props.customHint.recordWithoutTax}
          isParentChildItems={isParentChildItems}
          childItemTotalAmount={childItemTotalWithoutTaxAmount}
          toggleInputMode={props.toggleInputMode}
          onChangeAmountOrTaxType={props.onChangeAmountOrTaxType}
        />
      </MultiColumnsGrid>

      {!isRecordTypeIc && (
        <Tax
          baseCurrencySymbol={props.baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          expRecord={expRecord}
          errors={errors}
          classNameGstVat={classNames({
            'highlight-bg':
              isHighlightNewRecord || isDifferent('gstVat', diffValues),
          })}
          classNameTaxRate={classNames({
            'highlight-bg':
              isHighlightNewRecord || isDifferent('taxTypeName', diffValues),
          })}
          readOnly={readOnly || isMileageRecord}
          isParentChildItems={isParentChildItems}
          isFixedAllowance={isFixedAllowance}
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          isHideTaxType={isHideTaxType}
          isTaxExcludedMode={isTaxExcludedMode}
          expenseTaxTypeList={expenseTaxTypeList}
          onClickEditButton={props.onClickEditButton}
          calcTaxFromGstVat={props.calcTaxFromGstVat}
          recordItemIdx={recordItemIdx}
          allowTaxAmountChange={allowTaxAmountChange}
          allowTaxExcludedAmount={allowTaxExcludedAmount}
          toggleInputMode={props.toggleInputMode}
          onChangeAmountOrTaxType={props.onChangeAmountOrTaxType}
          customHint={customHint}
          allowNegativeAmount={allowNegativeAmount}
        />
      )}

      <WithholdingTaxArea
        amountClassName={amountClassName}
        amountReadOnlyClassName={amountReadOnlyClassName}
        baseCurrencyDecimal={baseCurrencyDecimal}
        customHint={customHint}
        errors={errors}
        expRecordItem={expRecord.items[recordItemIdx]}
        isHighlightAmountPayable={
          isHighlightNewRecord || isDifferent('amountPayable', diffValues)
        }
        isHighlightWithholdingTaxAmount={
          isHighlightNewRecord ||
          isDifferent('withholdingTaxAmount', diffValues)
        }
        readOnly={readOnly || isMileageRecord}
        recordItemIdx={recordItemIdx}
        withholdingTaxUsage={expRecord.withholdingTaxUsage}
        onChangeTaxWithholdingAmount={onChangeTaxWithholdingAmount}
      />
    </div>
  );
};

export default BaseCurrency;

const MultipleTaxEntriesWrapper = styled.div`
  margin: -1px -20px 0;
`;
