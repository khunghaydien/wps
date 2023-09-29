import React, { ChangeEvent, useEffect, useRef } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import Button from '@commons/components/buttons/Button';
import AccordionTabs from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs';
import AccordionTab from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs/AccordionTab';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import SelectField from '@commons/components/fields/SelectField';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';
import WspStyle from '@commons/styles/wsp.scss';

import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import { FOREIGN_CURRENCY_USAGE } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isRequiredOrItemizedRecord,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import {
  ExpTaxTypeList,
  getTaxTypeList,
} from '@apps/domain/models/exp/TaxType';

import TaxRateArea from '../General/BaseCurrency/Tax/TaxRateArea';
import LocalAmount from '../General/ForeignCurrency/LocalAmount';
import RecordDate from '../RecordDate';
import { ItemizationProps } from '../Tabs/ItemizationTab';

type Props = ItemizationProps & {
  idx: number;
  isDisableRemoveBtn: boolean;
  item: RecordItem;
  useForeignCurrency: boolean;
};

const Itemization = ({
  childExpTypeList = [],
  currencyCode,
  currencyDecimalPlaces,
  currencySymbol,
  customHint,
  errors,
  expPreRecord,
  expPreRequest,
  expRecord,
  expReport,
  expTypeOptionList,
  fixedAmountMessage,
  idx,
  isDisableRemoveBtn,
  isExpenseRequest,
  isFinanceApproval,
  isHighlightDiff,
  isLoading,
  isTaxIncluded,
  item,
  loadingAreas,
  readOnly,
  recordIdx,
  taxTypeObj,
  touched,
  useForeignCurrency,
  calculateAndUpdateAmount,
  onChangeEditingExpReport,
  onChangeLocalAmount,
  searchTaxTypeAndCalculate,
  updateRecord,
  // component
  baseCurrencyContainer: BaseCurrencyContainer,
  foreignCurrencyContainer: ForeignCurrencyContainer,
  jobCCEISumContainer: JobCCEISumContainer,
}: Props) => {
  const isFirstLoadRef = useRef(true);

  const { items, recordDate: parentRecordDate, recordType } = expRecord;
  const {
    currencyInfo: parentCurrencyInfo,
    taxTypeBaseId: parentTaxTypeBaseId,
    taxItems,
  } = items[0];

  const {
    allowNegativeAmount,
    amount,
    expTypeId,
    gstVat,
    itemId,
    localAmount,
    recordDate,
    taxTypeBaseId,
    tempUUID,
    withoutTax,
  } = item;
  const preItem = get(expPreRecord, `items.${idx}`, {});
  const recordPath = `records.${recordIdx}`;
  const formikPath = `report.${recordPath}`;
  const itemPath = `${recordPath}.items.${idx}`;

  const isHighlightNewItem = isHighlightDiff && isEmpty(preItem);

  const selectedExpType = childExpTypeList.find(
    (expType) => expType.id === expTypeId
  );
  const itemizationSetting = get(selectedExpType, 'itemizationSetting');

  const childTaxTypeList = get(
    taxTypeObj,
    `${expTypeId}.${parentRecordDate}`,
    []
  ) as ExpTaxTypeList;

  useEffect(() => {
    const isFirstLoad = isFirstLoadRef.current;
    if (isFirstLoad) {
      isFirstLoadRef.current = false;
      return;
    }

    if (!useForeignCurrency) {
      const hasNoChildTaxType = childTaxTypeList.length === 0;

      if (hasNoChildTaxType && expTypeId && parentRecordDate) {
        searchTaxTypeAndCalculate(expTypeId, idx);
      } else {
        const filteredChildTaxTypeList = getTaxTypeList(
          childTaxTypeList,
          parentTaxTypeBaseId,
          taxItems
        );
        const selectedTaxType =
          filteredChildTaxTypeList.find(
            (childTaxType) => childTaxType.baseId === taxTypeBaseId
          ) || get(filteredChildTaxTypeList, '0');

        calculateAndUpdateAmount(isTaxIncluded, idx, selectedTaxType);
      }
    }
  }, [expTypeId]);

  const onClickRemoveBtn = () => {
    const itemList = items.filter((item) => {
      const newItemId = itemId || tempUUID;
      return item.itemId !== newItemId && item.tempUUID !== newItemId;
    });
    updateRecord({
      items: itemList,
    });
  };

  const onChangeDate = (date: string) => {
    updateRecord({
      [`items.${idx}.recordDate`]: date,
    });
  };

  const onChangeExpType = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: expTypeId } = e.target;

    const expType = childExpTypeList.find(
      (expType) => expType.id === expTypeId
    );
    const {
      allowNegativeAmount: newAllowNegativeAmount = false,
      foreignCurrencyUsage,
      name: expTypeName = '',
    } = expType || {};

    const ei = getEIsOnly(expType);
    const eiList = Object.keys(ei).map((key) => ({
      [`items.${idx}.${key}`]: ei[key],
    }));
    const eiObj = eiList.reduce((obj, ei) => {
      return { ...obj, ...ei };
    }, {});

    const updateObj = {};
    if (allowNegativeAmount && !newAllowNegativeAmount) {
      Object.assign(updateObj, {
        [`items.${idx}.amount`]: Math.abs(amount),
        [`items.${idx}.gstVat`]: Math.abs(gstVat),
        [`items.${idx}.withoutTax`]: Math.abs(withoutTax),
        [`items.${idx}.localAmount`]: Math.abs(localAmount),
      });
    }
    Object.assign(updateObj, {
      [`items.${idx}.expTypeId`]: expTypeId,
      [`items.${idx}.expTypeName`]: expTypeName,
      [`items.${idx}.allowNegativeAmount`]: newAllowNegativeAmount,
      [`items.${idx}.useFixedForeignCurrency`]:
        foreignCurrencyUsage === FOREIGN_CURRENCY_USAGE.Fixed,
      ...eiObj,
    });
    updateRecord(updateObj);
  };

  const onChangeTaxTypeField = (
    _: number,
    isTaxIncluded: boolean,
    baseId?: string
  ) => {
    const isTaxSame = !baseId || baseId === taxTypeBaseId;
    if (isTaxSame) return;

    const selectedTaxType = childTaxTypeList.find(
      (childTaxType) => childTaxType.baseId === baseId
    );
    calculateAndUpdateAmount(isTaxIncluded, idx, selectedTaxType);
  };

  const onChangeLocalAmountField = (amount: number) => {
    onChangeLocalAmount(amount, idx);
  };

  const getHighlightClass = (key: string) => {
    const isHighlightField = isHighlightDiff && item[key] !== preItem[key];
    const isHighlight = isHighlightNewItem || isHighlightField;

    return {
      'highlight-bg': isHighlight,
    };
  };

  const itemError = get(errors, recordPath) || {};
  const expTypeError = get(errors, `${itemPath}.expTypeId`);

  const isRequiredOrItemized = isRequiredOrItemizedRecord(
    itemizationSetting,
    items.length
  );
  const isFixedAllowance =
    isFixedAllowanceSingle(recordType) || isFixedAllowanceMulti(recordType);

  const amountContent = (
    <Content useForeignCurrency={useForeignCurrency}>
      <FirstRowGrid sizeList={[4, 4, 4]}>
        <RecordDate
          className={classNames(getHighlightClass('recordDate'))}
          recordDate={recordDate}
          targetRecord={itemPath}
          hintMsg={customHint.recordDate}
          onChangeRecordDate={(date) => onChangeDate(date)}
          popperModifiers={{
            preventOverflow: {
              enabled: false,
            },
            flip: {
              enabled: false,
            },
          }}
          readOnly={readOnly}
          errors={errors}
        />
        <ExpenseType>
          <LabelWithHint
            text={msg().Exp_Clbl_ExpenseType}
            hintMsg={customHint.recordExpenseType}
            isRequired
          />
          <div className="ts-text-field-container">
            <SelectField
              className={classNames(getHighlightClass('expTypeName'))}
              disabled={readOnly}
              onChange={onChangeExpType}
              options={expTypeOptionList}
              value={expTypeId || ''}
            />
            {expTypeError && (
              <div className="input-feedback">{msg()[expTypeError]}</div>
            )}
          </div>
        </ExpenseType>
        {useForeignCurrency ? (
          <LocalAmount
            currencySymbol={parentCurrencyInfo.symbol || ''}
            customHintStr={customHint.recordLocalAmount}
            errors={itemError}
            fixedAmountMessage={fixedAmountMessage}
            isFixedAllowance={isFixedAllowance}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewItem}
            item={item}
            itemIdx={idx}
            preItem={preItem}
            readOnly={readOnly}
            onChangeAmountField={onChangeLocalAmountField}
          />
        ) : (
          <TaxRateType
            className={classNames(getHighlightClass('taxTypeName'))}
            errors={itemError}
            expenseTaxTypeList={getTaxTypeList(
              childTaxTypeList,
              parentTaxTypeBaseId,
              taxItems
            )}
            expRecordItem={item}
            isDotLoader
            isLoaderOverride
            isLoading={isLoading}
            isTaxIncluded={isTaxIncluded}
            loadingAreas={loadingAreas}
            readOnly={readOnly}
            recordItemIdx={idx}
            onChangeAmountOrTaxType={onChangeTaxTypeField}
          />
        )}
      </FirstRowGrid>
      {useForeignCurrency ? (
        <ForeignCurrencyStyle>
          <ForeignCurrencyContainer
            baseCurrencyCode={currencyCode}
            baseCurrencyDecimal={currencyDecimalPlaces}
            baseCurrencySymbol={currencySymbol}
            customHint={customHint}
            expPreRecord={expPreRecord}
            expRecord={expRecord}
            fixedAmountMessage={fixedAmountMessage}
            formikErrors={errors}
            isChildItem
            isFixedAllowance={isFixedAllowance}
            isHideLocalAmount
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewItem}
            readOnly={readOnly}
            recordItemIdx={idx}
            targetRecord={formikPath}
            touched={touched}
            onChangeEditingExpReport={onChangeEditingExpReport}
          />
        </ForeignCurrencyStyle>
      ) : (
        <BaseCurrencyContainer
          baseCurrencyCode={currencyCode}
          baseCurrencyDecimal={currencyDecimalPlaces}
          baseCurrencySymbol={currencySymbol}
          customHint={customHint}
          errors={errors}
          expPreRecord={expPreRecord}
          expRecord={expRecord}
          fixedAmountMessage={fixedAmountMessage}
          isChildItem
          isExpenseRequest={isExpenseRequest}
          isFinanceApproval={isFinanceApproval}
          isFixedAllowance={isFixedAllowance}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewItem}
          isHideTaxType
          isItemized={isRequiredOrItemized}
          readOnly={readOnly}
          recordItemIdx={idx}
          targetRecord={formikPath}
          touched={touched}
          onChangeEditingExpReport={onChangeEditingExpReport}
        />
      )}
    </Content>
  );

  return (
    <Tabs>
      <AccordionTab
        id={`${msg().Exp_Lbl_Itemization} ${idx}`}
        label={`${msg().Exp_Lbl_Itemization} ${idx}`}
        actionButtons={
          <RemoveButton
            disabled={isDisableRemoveBtn}
            type="destructive"
            onClick={onClickRemoveBtn}
          >
            {msg().Com_Lbl_Remove}
          </RemoveButton>
        }
        content={amountContent}
        isExpand={false}
        isShowIcon
      >
        <JobCCEISumContainer
          customHint={customHint}
          errors={itemError}
          expPreRequest={expPreRequest}
          expRecord={expRecord}
          expReport={expReport}
          isFinanceApproval={isFinanceApproval}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewItem}
          preRecordItem={preItem}
          readOnly={readOnly}
          recordIdx={recordIdx}
          recordItemIdx={idx}
          targetRecord={recordPath}
          touched={touched}
          onChangeEditingExpReport={onChangeEditingExpReport}
        />
      </AccordionTab>
    </Tabs>
  );
};
export default Itemization;

const Tabs = styled(AccordionTabs)`
  position: relative;

  .accordion-tab {
    position: unset;
  }

  .accordion-tab-label {
    padding-left: 20px;
  }

  .accordion-tab-content {
    padding-bottom: 0;
  }

  input:checked ~ .accordion-tab-content {
    border-top: 1px solid #ddd;
    border-bottom: none;
  }

  input:not(:checked) ~ .accordion-tab-content {
    height: 0;
    border-bottom: none;
  }
`;
const ForeignCurrencyStyle = styled.div`
  .slds-grid:last-child {
    flex-direction: row-reverse;
    & .ts-expenses-requests__contents__amount__amount {
      margin-left: 10px;
    }
    & .ts-expenses-requests__contents__amount__exchange-rate {
      margin-right: 10px;
      margin-left: unset;
    }
  }
`;
const Content = styled.div<{ useForeignCurrency: boolean }>`
  .ts-expenses-requests__contents__amount {
    display: grid;
    grid-template-columns: ${({ useForeignCurrency }) =>
      useForeignCurrency ? '34% 66%' : ' 66% 34%'};
    padding: 0;
    margin-bottom: 0;
    border-bottom: none;

    .ts-expenses-requests__contents__amount__currency-selector {
      margin-left: 0;
      margin-right: 20px;
    }

    .ts-expenses-gst-vat-area {
      margin-left: 20px;
    }
  }

  .ts-select-input:disabled {
    background: ${WspStyle['color-disabled-1']};
  }
`;

const FirstRowGrid = styled(MultiColumnsGrid)`
  gap: 20px;
  width: calc(100% - 40px);

  .react-datepicker__input-container {
    width: 100%;
  }

  .ts-expenses-taxRateArea {
    padding-right: 0;
  }
`;

const ExpenseType = styled.div`
  display: flex;
  flex-direction: column;

  .ts-select {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    padding-right: 30px !important;
  }
`;

const TaxRateType = styled(TaxRateArea)`
  .ts-select {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    padding-right: 30px !important;
  }
`;

const RemoveButton = styled(Button)`
  height: 30px;

  > .ts-button__contents {
    height: 100%;
  }
`;
