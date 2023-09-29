import React, { FC } from 'react';

import styled, { css } from 'styled-components';

import HighlightValueDifference from '@apps/commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/HighlightValueDifference';
import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import ApprovalFormField from './ApprovalFormField';

interface IMultipleTaxEntriesApprovalFormProps {
  baseCurrencyDecimal: number;
  currencySymbol: string;
  record: ExpRequestRecord;
  preRecord: ExpRequestRecord;
  isHighlightDifference: boolean;
}

const MultipleTaxEntriesApprovalForm: FC<
  IMultipleTaxEntriesApprovalFormProps
> = (props) => {
  const {
    record,
    preRecord,
    baseCurrencyDecimal,
    currencySymbol,
    isHighlightDifference,
  } = props;

  // Multi tax for will only display for parent record, meaning recordItemIdx will be 0 always
  const itemIdx = 0;

  const recordItem = record.items[itemIdx];
  const preRecordItem = preRecord?.items?.[itemIdx];
  const { taxItems = [] } = recordItem || {};

  const $totalTaxesAmount = (() => {
    if (taxItems.length <= 0) {
      return null;
    }

    return (
      <>
        <BlueHeader>{msg().Exp_Lbl_TotalAmountAndTaxes}</BlueHeader>
        <ApprovalFormField
          label={msg().Exp_Lbl_TotalAmountInclTax}
          value={
            <HighlightValueDifference
              showHighlight={
                isHighlightDifference && preRecordItem?.amount !== undefined
              }
              currentValue={`${currencySymbol} ${FormatUtil.formatNumber(
                recordItem.amount,
                baseCurrencyDecimal
              )}`}
              previousValue={`${currencySymbol} ${FormatUtil.formatNumber(
                preRecordItem?.amount,
                baseCurrencyDecimal
              )}`}
            />
          }
        />

        <ApprovalFormField
          label={msg().Exp_Lbl_TotalAmountExclTax}
          value={
            <HighlightValueDifference
              showHighlight={
                isHighlightDifference && preRecordItem?.withoutTax !== undefined
              }
              currentValue={`${currencySymbol} ${FormatUtil.formatNumber(
                recordItem.withoutTax,
                baseCurrencyDecimal
              )}`}
              previousValue={`${currencySymbol} ${FormatUtil.formatNumber(
                preRecordItem?.withoutTax,
                baseCurrencyDecimal
              )}`}
            />
          }
        />
      </>
    );
  })();

  const $multipleTaxEntries = taxItems.map(
    (
      {
        amount: amtInclTax,
        withoutTax: amtExclTax,
        gstVat,
        taxRate,
        taxTypeName,
        taxManual,
      },
      taxItemIdx
    ) => {
      const {
        amount: previousAmtInclTax,
        withoutTax: previousAmtExclTax,
        gstVat: previousGstVat,
      } = preRecordItem?.taxItems?.[taxItemIdx] || {};

      return (
        <>
          <BlueHeader>{`${taxTypeName} ${taxRate}%`}</BlueHeader>
          {/* Amount Incl Tax */}
          <ApprovalFormField
            label={msg().Exp_Clbl_IncludeTax}
            value={
              <HighlightValueDifference
                showHighlight={
                  isHighlightDifference && previousAmtInclTax !== undefined
                }
                currentValue={`${currencySymbol} ${FormatUtil.formatNumber(
                  amtInclTax,
                  baseCurrencyDecimal
                )}`}
                previousValue={`${currencySymbol} ${FormatUtil.formatNumber(
                  previousAmtInclTax,
                  baseCurrencyDecimal
                )}`}
              />
            }
          />
          {/* Amount Excl Tax */}
          <ApprovalFormField
            label={msg().Exp_Clbl_WithoutTax}
            value={
              <HighlightValueDifference
                showHighlight={
                  isHighlightDifference && previousAmtExclTax !== undefined
                }
                currentValue={`${currencySymbol} ${FormatUtil.formatNumber(
                  amtExclTax,
                  baseCurrencyDecimal
                )}`}
                previousValue={`${currencySymbol} ${FormatUtil.formatNumber(
                  previousAmtExclTax,
                  baseCurrencyDecimal
                )}`}
              />
            }
          />
          {/* GST Amount */}
          <ApprovalFormField
            label={msg().Exp_Clbl_GstAmount}
            value={
              <GstAmountWrapper>
                <HighlightValueDifference
                  showHighlight={
                    isHighlightDifference && previousGstVat !== undefined
                  }
                  currentValue={`${currencySymbol} ${FormatUtil.formatNumber(
                    gstVat,
                    baseCurrencyDecimal
                  )}`}
                  previousValue={`${currencySymbol} ${FormatUtil.formatNumber(
                    previousGstVat,
                    baseCurrencyDecimal
                  )}`}
                />
                {taxManual && (
                  <span className="rate-edited">{` (${
                    msg().Exp_Clbl_Edited
                  })`}</span>
                )}
              </GstAmountWrapper>
            }
          />
        </>
      );
    }
  );

  return (
    <MultipletaxEntriesWrapper>
      {$totalTaxesAmount}
      {$multipleTaxEntries}
    </MultipletaxEntriesWrapper>
  );
};

export default MultipleTaxEntriesApprovalForm;

const sharedFontStyle = css`
  color: #333;
  font-size: 13px;
`;

const BlueHeader = styled.div`
  ${sharedFontStyle}

  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  padding: 0 12px;
  background-color: #ebf3f7;
  margin: 10px -12px;

  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
`;

const MultipletaxEntriesWrapper = styled.div`
  .mobile-app-atoms-label__text {
    margin: 0;
    ${sharedFontStyle}
    font-weight: bold;
  }

  .ts-icon-button {
    padding-top: 18px;
    padding-left: 12px;
  }

  .highlight-value-difference-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: right;

    > div {
      // highlight container
      width: 100%;
    }
  }
`;

const GstAmountWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
`;
