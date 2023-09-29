import React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import AccordionTabs from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs';
import AccordionTab from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs/AccordionTab';
import msg from '@commons/languages';
import ExpColor from '@commons/styles/exp/variables/_colors.scss';
import DateUtil from '@commons/utils/DateUtil';

import { getLabelValueFromEIs } from '@apps/domain/models/exp/ExtendedItem';
import { RecordItem } from '@apps/domain/models/exp/Record';

import Field from './Field';

export type ParentCCJob = {
  costCenterCode: string;
  jobCode: string;
  preCostCenterCode?: string;
  preJobCode?: string;
  costCenterName: string;
  jobName: string;
  preCostCenterName?: string;
  preJobName?: string;
};

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  idx: number;
  isHighlightDiff: boolean;
  item: RecordItem;
  parentCCJob: ParentCCJob;
  preItem?: RecordItem;
  useForeignCurrency: boolean;
  isHighlight: (idx: number, path: string) => boolean;
};

type ExtendedItemValueObj = {
  id?: string;
  code?: string;
  label: string;
  value: string;
};

const ChildItem = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  idx,
  isHighlightDiff,
  item,
  parentCCJob,
  preItem,
  useForeignCurrency,
  isHighlight,
}: Props) => {
  const {
    amount,
    costCenterCode,
    costCenterName,
    jobName,
    currencyInfo,
    exchangeRate,
    expTypeName,
    gstVat,
    itemId,
    jobCode,
    localAmount,
    recordDate,
    remarks,
    taxManual,
    taxTypeName,
    withoutTax,
  } = item;

  const isNewItem = !preItem;
  const preItemCostCenterCode =
    preItem?.costCenterCode || parentCCJob.preCostCenterCode || '';
  const preItemJobCode = preItem?.jobCode || parentCCJob.preJobCode || '';
  const preItemCostCenterName =
    preItem?.costCenterName || parentCCJob.preCostCenterName || '';
  const preItemJobName = preItem?.jobName || parentCCJob.preJobName || '';
  const itemCostCenterCode = costCenterCode || parentCCJob.costCenterCode;
  const itemJobCode = jobCode || parentCCJob.jobCode;
  const itemCostCenterName = costCenterName || parentCCJob.costCenterName;
  const itemJobName = jobName || parentCCJob.jobName;
  const isNewHighlight = isHighlightDiff && isNewItem;
  const isExistHighlight = isHighlightDiff && !isNewItem;
  const isHighlightCC =
    isExistHighlight && preItemCostCenterCode !== itemCostCenterCode;
  const isHighlightJob = isExistHighlight && preItemJobCode !== itemJobCode;

  const amountContent = useForeignCurrency ? (
    <>
      <Field
        currencyDecimalPlaces={currencyInfo?.decimalPlaces}
        currencySymbol={currencyInfo?.symbol}
        isHighlight={isHighlight(idx, 'localAmount')}
        label={msg().Exp_Clbl_LocalAmount}
        preValue={preItem?.localAmount}
        value={localAmount}
        width="33%"
      />
      <Field
        isHighlight={isHighlight(idx, 'currencyInfo.code')}
        label={msg().Exp_Clbl_Currency}
        preValue={preItem?.currencyInfo?.code}
        value={currencyInfo.code}
        width="33%"
      />
      <Field
        isHighlight={isHighlight(idx, 'exchangeRate')}
        label={msg().Exp_Clbl_ExchangeRate}
        preValue={preItem?.exchangeRate}
        value={exchangeRate}
        width="33%"
      />
      <Field
        currencyDecimalPlaces={baseCurrencyDecimal}
        currencySymbol={baseCurrencySymbol}
        isHighlight={isHighlight(idx, 'amount')}
        label={msg().Exp_Clbl_Amount}
        preValue={preItem?.amount}
        value={amount}
        width="33%"
      />
    </>
  ) : (
    <>
      <Field
        isHighlight={isHighlight(idx, 'taxTypeName')}
        label={msg().Exp_Clbl_Gst}
        preValue={preItem?.taxTypeName}
        value={taxTypeName}
        width="33%"
      />
      <Field
        currencyDecimalPlaces={baseCurrencyDecimal}
        currencySymbol={baseCurrencySymbol}
        isHighlight={isHighlight(idx, 'amount')}
        label={msg().Exp_Clbl_IncludeTax}
        preValue={preItem?.amount}
        value={amount}
        width="33%"
      />
      <Field
        currencyDecimalPlaces={baseCurrencyDecimal}
        currencySymbol={baseCurrencySymbol}
        isHighlight={isHighlight(idx, 'withoutTax')}
        label={msg().Exp_Clbl_WithoutTax}
        preValue={preItem?.withoutTax}
        value={withoutTax}
        width="33%"
      />
      <Field
        currencyDecimalPlaces={baseCurrencyDecimal}
        currencySymbol={baseCurrencySymbol}
        isHighlight={isHighlight(idx, 'gstVat')}
        isManual={taxManual}
        label={msg().Exp_Clbl_GstAmount}
        preValue={preItem?.gstVat}
        value={gstVat}
        width="33%"
      />
    </>
  );

  const visibleContent = (
    <VisibleContent>
      <Field
        isHighlight={isHighlight(idx, 'recordDate')}
        label={msg().Exp_Clbl_Date}
        preValue={DateUtil.formatYMD(preItem?.recordDate)}
        value={DateUtil.formatYMD(recordDate)}
        width="33%"
      />
      <Field
        isHighlight={isHighlight(idx, 'expTypeName')}
        label={msg().Exp_Clbl_ExpenseType}
        preValue={preItem?.expTypeName}
        value={expTypeName}
        width="33%"
      />
      {amountContent}
    </VisibleContent>
  );

  const renderExtendedItemContent = () => {
    const extendedItemList = getLabelValueFromEIs(item, true);
    const preExtendedItemList = preItem
      ? getLabelValueFromEIs(preItem, true)
      : [];

    return extendedItemList.map((extendedItem: ExtendedItemValueObj) => {
      const { id, label, value } = extendedItem;
      const preEI = preExtendedItemList.find((preEI) => preEI.id === id);

      const isPreValueNil = isNil(preEI?.value);
      const isValueInvalidOrEmpty = isNil(value) || value === '';
      const isStopDiff = isPreValueNil && isValueInvalidOrEmpty;

      const isHighlight =
        !isStopDiff && isExistHighlight && preEI?.value !== value;

      return (
        <Field
          key={id}
          isHighlight={isHighlight}
          label={label}
          preValue={preEI?.value}
          value={value}
          width="100%"
        />
      );
    });
  };

  const isShowJob = itemJobCode || preItemJobCode;
  const isShowCostCenter = itemCostCenterCode || preItemCostCenterCode;
  return (
    <Content isNewHighlight={isNewHighlight}>
      <Tabs>
        <AccordionTab
          id={itemId || `${msg().Exp_Lbl_Itemization} ${idx}`}
          label={`${msg().Exp_Lbl_Itemization} ${idx}`}
          content={visibleContent}
          isExpand={false}
          isShowIcon
        >
          <ExpandedContent>
            {isShowJob && (
              <Field
                isHighlight={isHighlightJob}
                label={msg().Exp_Lbl_Job}
                preValue={
                  preItemJobCode ? `${preItemJobCode} - ${preItemJobName}` : ''
                }
                value={itemJobCode ? `${itemJobCode} - ${itemJobName}` : null}
                width="100%"
              />
            )}
            {isShowCostCenter && (
              <Field
                isHighlight={isHighlightCC}
                label={msg().Exp_Clbl_CostCenter}
                preValue={
                  preItemCostCenterCode
                    ? `${preItemCostCenterCode} - ${preItemCostCenterName}`
                    : ''
                }
                value={
                  itemCostCenterCode
                    ? `${itemCostCenterCode} - ${itemCostCenterName}`
                    : null
                }
                width="100%"
              />
            )}

            {renderExtendedItemContent()}

            <Field
              isHighlight={isHighlight(idx, 'remarks')}
              label={msg().Exp_Clbl_Summary}
              preValue={preItem?.remarks}
              value={remarks}
              width="100%"
            />
          </ExpandedContent>
        </AccordionTab>
      </Tabs>
    </Content>
  );
};

export default ChildItem;

const Content = styled.div<{ isNewHighlight: boolean }>`
  ${({ isNewHighlight }) =>
    isNewHighlight &&
    `background-color: ${ExpColor.highlight}; .highlight-container { width: 100%; }`};

  .accordion-tab-visible-content {
    padding: 15px;
  }
`;

const Tabs = styled(AccordionTabs)`
  .accordion-tab-label {
    ::after {
      content: '\\2303';
      transform: scaleY(-1);
      filter: FlipV;
      text-align: center;
      transition: all 0.35s;
    }
  }

  input:checked ~ .accordion-tab-content {
    border-top: 1px solid #ddd;
    border-bottom: none;
  }

  input:not(:checked) ~ .accordion-tab-content {
    border-bottom: none;
  }
`;

const VisibleContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
`;

const ExpandedContent = styled.div`
  display: flex;
  row-gap: 20px;
  flex-direction: column;
`;
