import React from 'react';

import get from 'lodash/get';

import styled from 'styled-components';

import MultipleTaxEntriesApprovalForm from '@commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/MultipleTaxEntriesApprovalForm';
import msg from '@commons/languages';
import WspStyle from '@commons/styles/wsp.scss';
import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import TextUtil from '@commons/utils/TextUtil';

import { isAmountMatch } from '@apps/domain/models/exp/Record';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import ChildItem, { ParentCCJob } from './ChildItem';
import Field from './Field';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  isHighlightDiff?: boolean;
  parentCCJob: ParentCCJob;
  preRecord?: ExpRequestRecord;
  record: ExpRequestRecord;
};

const Body = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  isHighlightDiff = false,
  parentCCJob,
  preRecord = null,
  record,
}: Props) => {
  const { items } = record;
  const [_, ...childItemList] = items;
  const parentItem = items[0];
  const preParentItem = get(preRecord, 'items.0');
  const {
    amount,
    costCenterCode,
    currencyInfo,
    jobCode,
    localAmount,
    useForeignCurrency,
    withoutTax,
    jobName,
    costCenterName,
  } = parentItem;

  const isHighlight = (idx: number, path: string) => {
    const preItem = get(preRecord, `items.${idx}`);
    const isNewItem = !preItem;
    if (isNewItem) return false;

    const preValue = get(preItem, path);
    const value = get(record, `items.${idx}.${path}`);
    return isHighlightDiff && preValue !== value;
  };

  const finalAmount = useForeignCurrency ? localAmount : amount;
  const key = useForeignCurrency ? '' : 'amount';
  const decimalPlaces = useForeignCurrency
    ? currencyInfo?.decimalPlaces || 0
    : baseCurrencyDecimal;
  const childItemTotalAmount = calculateTotalAmountForItems(
    decimalPlaces,
    record,
    useForeignCurrency,
    key
  );
  const isTotalAmountMatch = isAmountMatch(
    finalAmount || 0,
    childItemTotalAmount
  );

  const isMultipleTax = record.items[0]?.taxItems?.length > 0;
  const isNewHighlight = isHighlightDiff && !get(preRecord, 'items.0');
  const parentItemCCJob = {
    costCenterCode: costCenterCode || parentCCJob.costCenterCode,
    jobCode: jobCode || parentCCJob.jobCode,
    preCostCenterCode:
      preParentItem?.costCenterCode || parentCCJob?.preCostCenterCode,
    preJobCode: preParentItem?.jobCode || parentCCJob?.preJobCode,
    costCenterName: costCenterName || parentCCJob.costCenterName,
    jobName: jobName || parentCCJob.jobName,
    preCostCenterName:
      preParentItem?.costCenterName || parentCCJob?.preCostCenterName,
    preJobName: preParentItem?.jobName || parentCCJob?.preJobName,
  };

  return (
    <Content isNewHighlight={isNewHighlight}>
      {isMultipleTax ? (
        <MultiTaxForm>
          <MultipleTaxEntriesApprovalForm
            expRecord={record}
            preExpRecord={preRecord}
            baseCurrencySymbol={baseCurrencySymbol}
            baseCurrencyDecimal={baseCurrencyDecimal}
            isHighlightDifference={isHighlightDiff}
          />
        </MultiTaxForm>
      ) : (
        <SingleTaxContent>
          {useForeignCurrency ? (
            <>
              <Field
                currencySymbol={currencyInfo?.symbol}
                currencyDecimalPlaces={currencyInfo?.decimalPlaces}
                isHighlight={isHighlight(0, 'localAmount')}
                label={msg().Exp_Lbl_TotalLocalAmount}
                preValue={preParentItem?.localAmount}
                warningMsg={
                  !isTotalAmountMatch &&
                  TextUtil.template(
                    msg().Exp_Msg_LocalAmountOfItemizationDoNotAddUpToTotal,
                    `${currencyInfo?.symbol || ''}${FormatUtil.formatNumber(
                      childItemTotalAmount,
                      decimalPlaces
                    )}`
                  )
                }
                value={localAmount}
              />
              <Field
                currencySymbol={baseCurrencySymbol}
                currencyDecimalPlaces={baseCurrencyDecimal}
                isHighlight={isHighlight(0, 'amount')}
                label={msg().Exp_Lbl_TotalAmount}
                preValue={preParentItem?.amount}
                value={amount}
              />
            </>
          ) : (
            <>
              <Field
                currencySymbol={baseCurrencySymbol}
                currencyDecimalPlaces={baseCurrencyDecimal}
                isHighlight={isHighlight(0, 'amount')}
                label={msg().Exp_Lbl_TotalAmountInclTax}
                preValue={preParentItem?.amount}
                warningMsg={
                  !isTotalAmountMatch &&
                  TextUtil.template(
                    msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
                    `${baseCurrencySymbol}${FormatUtil.formatNumber(
                      childItemTotalAmount,
                      decimalPlaces
                    )}`
                  )
                }
                value={amount}
              />
              <Field
                currencySymbol={baseCurrencySymbol}
                currencyDecimalPlaces={baseCurrencyDecimal}
                isHighlight={isHighlight(0, 'withoutTax')}
                label={msg().Exp_Lbl_TotalAmountExclTax}
                preValue={preParentItem?.withoutTax}
                value={withoutTax}
              />
            </>
          )}
        </SingleTaxContent>
      )}
      {childItemList.map((item, idx) => (
        <ChildItem
          key={item.itemId}
          baseCurrencyDecimal={baseCurrencyDecimal}
          baseCurrencySymbol={baseCurrencySymbol}
          idx={idx + 1}
          isHighlightDiff={isHighlightDiff}
          item={item}
          preItem={get(preRecord, `items.${idx + 1}`)}
          parentCCJob={parentItemCCJob}
          useForeignCurrency={useForeignCurrency}
          isHighlight={isHighlight}
        />
      ))}
    </Content>
  );
};

export default Body;

const Content = styled.div<{ isNewHighlight: boolean }>`
  background: ${({ isNewHighlight }) =>
    isNewHighlight
      ? WspStyle['color-highlight']
      : WspStyle['color-background-2']};
  overflow-y: hidden;
`;

const SingleTaxContent = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .ts-horizontal-layout__label {
    width: auto;
  }
`;

const MultiTaxForm = styled.div`
  .accordion-tab-content {
    border-bottom: none;
  }
`;
