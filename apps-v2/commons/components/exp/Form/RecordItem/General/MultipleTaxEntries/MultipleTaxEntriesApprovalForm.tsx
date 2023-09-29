import React, { FC } from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import Tabs from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs';
import Tab from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs/AccordionTab/index';
import Grid from '@commons/components/exp/Form/RecordItem/General/Layout/Grid';
import HighlightValueDifference from '@commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/HighlightValueDifference';
import TaxFormField from '@commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/TaxFormField';
import ImgEditOn from '@commons/images/btnEditOn.svg';

import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

interface IMultipleTaxEntriesApprovalFormProps {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRecord: ExpRequestRecord;
  isHighlightDifference?: boolean;
  isShowIcon?: boolean;
  preExpRecord?: ExpRequestRecord;
}

const MultipleTaxEntriesApprovalForm: FC<
  IMultipleTaxEntriesApprovalFormProps
> = (props) => {
  const {
    expRecord,
    preExpRecord,
    baseCurrencyDecimal,
    baseCurrencySymbol = '',
    isHighlightDifference = false,
    isShowIcon = false,
  } = props;

  // Multi tax for will only display for parent record, meaning recordItemIdx will be 0 always
  const recordItemIdx = 0;
  const recordItem = expRecord.items[recordItemIdx];
  const preRecordItem = preExpRecord?.items?.[recordItemIdx];
  const { taxItems = [] } = recordItem || {};

  const $totalTaxesAmount = (() => {
    return (
      <Grid noOfColumns={3} columnGap={20}>
        {/* Total Amount (Incl. Tax) */}
        <TotalAmountField
          readOnly
          label={msg().Exp_Lbl_TotalAmountInclTax}
          value={
            <HighlightValueDifference
              showHighlight={
                isHighlightDifference && preRecordItem?.amount !== undefined
              }
              currentValue={`${baseCurrencySymbol} ${
                FormatUtil.formatNumber(
                  recordItem.amount,
                  baseCurrencyDecimal
                ) || 0
              }`}
              previousValue={`${baseCurrencySymbol} ${
                FormatUtil.formatNumber(
                  preRecordItem?.amount,
                  baseCurrencyDecimal
                ) || 0
              }`}
            />
          }
        />
        {/* Total Amount (Excl. Tax) */}
        <TotalAmountField
          readOnly
          label={msg().Exp_Lbl_TotalAmountExclTax}
          value={
            <HighlightValueDifference
              showHighlight={
                isHighlightDifference && preRecordItem?.withoutTax !== undefined
              }
              currentValue={`${baseCurrencySymbol} ${
                FormatUtil.formatNumber(
                  recordItem.withoutTax,
                  baseCurrencyDecimal
                ) || 0
              }`}
              previousValue={`${baseCurrencySymbol} ${
                FormatUtil.formatNumber(
                  preRecordItem?.withoutTax,
                  baseCurrencyDecimal
                ) || 0
              }`}
            />
          }
        />
      </Grid>
    );
  })();

  const $multipleTaxEntries = taxItems.map(
    (
      { taxTypeName, taxRate, amount, withoutTax, gstVat, taxManual },

      taxItemIdx
    ) => {
      const {
        amount: previousAmount,
        withoutTax: previousWithoutTax,
        gstVat: previousGstVat,
      } = preRecordItem?.taxItems?.[taxItemIdx] || {};

      const $amountInclTax = (
        <>
          <TaxFormField
            readOnly
            label={msg().Exp_Clbl_IncludeTax}
            value={
              <HighlightValueDifference
                showHighlight={
                  isHighlightDifference && previousAmount !== undefined
                }
                currentValue={`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                  amount,
                  baseCurrencyDecimal
                )}`}
                previousValue={`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                  previousAmount,
                  baseCurrencyDecimal
                )}`}
              />
            }
          />
        </>
      );

      const $amountExclTax = (
        <TaxFormField
          readOnly
          label={msg().Exp_Clbl_WithoutTax}
          value={
            <HighlightValueDifference
              showHighlight={
                isHighlightDifference && previousWithoutTax !== undefined
              }
              currentValue={`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                withoutTax,
                baseCurrencyDecimal
              )}`}
              previousValue={`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                previousWithoutTax,
                baseCurrencyDecimal
              )}`}
            />
          }
        />
      );

      const $gstVat = (() => {
        const pencilIcon = taxManual && (
          <ImgEditOn className="rate-edited-pencil-icon" aria-hidden="true" />
        );

        return (
          <TaxFormField
            readOnly
            label={msg().Exp_Clbl_GstAmount}
            value={
              <GstAmountWrapper>
                <HighlightValueDifference
                  showHighlight={
                    isHighlightDifference && previousGstVat !== undefined
                  }
                  currentValue={`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                    gstVat,
                    baseCurrencyDecimal
                  )}`}
                  previousValue={`${baseCurrencySymbol} ${
                    FormatUtil.formatNumber(
                      previousGstVat,
                      baseCurrencyDecimal
                    ) || 0
                  }`}
                />
                {pencilIcon}
              </GstAmountWrapper>
            }
          />
        );
      })();

      return (
        <div key={taxItemIdx.toString()}>
          <TaxRateAndName>{`${taxTypeName} - ${FormatUtil.convertToDisplayingPercent(
            taxRate
          )}`}</TaxRateAndName>
          <Grid noOfColumns={3} columnGap={20}>
            {$amountInclTax}
            {$amountExclTax}
            {$gstVat}
          </Grid>
        </div>
      );
    }
  );

  return (
    <Tabs>
      <Tab
        id={msg().Exp_Lbl_TotalAmountAndTaxes}
        label={msg().Exp_Lbl_TotalAmountAndTaxes}
        isShowIcon={isShowIcon}
      >
        {$totalTaxesAmount}
        {$multipleTaxEntries}
      </Tab>
    </Tabs>
  );
};

export default MultipleTaxEntriesApprovalForm;

const TotalAmountField = styled(TaxFormField)`
  font-weight: bold;
`;

const TaxRateAndName = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  border-bottom: 1px solid #ddd;
  margin: -1px 0px 10px 0px;
  min-height: 30px;
  font-size: 12px;
  line-height: 15px;
`;

const GstAmountWrapper = styled.div`
  display: flex;

  .rate-edited-pencil-icon {
    margin: 0px 8px;
  }
`;
