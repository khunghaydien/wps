import React from 'react';

import styled from 'styled-components';

import FormatUtil from '@apps/commons/utils/FormatUtil';
import msg from '@commons/languages/';
import DateUtil from '@commons/utils/DateUtil';

import { calculateTotalTaxes, TaxItems } from '@apps/domain/models/exp/Record';

type MultiTaxItemsPopoverProps = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expTypeName: string;
  recordDate: string;
  taxItems: TaxItems;
};

const ROOT = 'ts-expenses__form-records__list-items-detail';

const MultiTaxItemsPopover = ({
  expTypeName,
  recordDate,
  taxItems,
  baseCurrencyDecimal,
  baseCurrencySymbol,
}: MultiTaxItemsPopoverProps) => {
  if (!taxItems || taxItems?.length <= 0) {
    return null;
  }

  const { totalAmountInclTax, totalGstVat } = calculateTotalTaxes(
    taxItems,
    baseCurrencyDecimal
  );

  return (
    <div className={ROOT}>
      <MultiTaxBreakdown>
        <tr>
          <td className="nowrap">#</td>
          <td className="nowrap">{msg().Exp_Clbl_Date}</td>
          <td className="nowrap">{msg().Exp_Clbl_ExpenseType}</td>
          <td className="right nowrap">{msg().Exp_Clbl_GstAmount}</td>
          <td className="right nowrap">{msg().Exp_Clbl_IncludeTax}</td>
        </tr>

        <tr>
          <td>1.</td>
          <td className="nowrap">{DateUtil.formatYMD(recordDate)}</td>
          <td>{expTypeName}</td>
          <td className="right nowrap">{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            totalGstVat,
            baseCurrencyDecimal
          )}`}</td>
          <td className="right nowrap">{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            totalAmountInclTax,
            baseCurrencyDecimal
          )}`}</td>
        </tr>

        <tr className="total breakdown">
          <td className="borderless"></td>
          <td className="borderless"></td>
          <td className="right borderless">{msg().Exp_Lbl_TotalAmount}</td>
          <td className="right nowrap">{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            totalGstVat,
            baseCurrencyDecimal
          )}`}</td>
          <td className="right nowrap">{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            totalAmountInclTax,
            baseCurrencyDecimal
          )}`}</td>
        </tr>

        {taxItems.map(({ amount, gstVat, taxRate }, index) => (
          <tr key={index.toString()} className="breakdown details">
            <td className="borderless"></td>
            <td className="borderless">{}</td>
            <td className="borderless">{}</td>
            <td className="right nowrap">{`(${taxRate}%) ${baseCurrencySymbol} ${FormatUtil.formatNumber(
              gstVat,
              baseCurrencyDecimal
            )}`}</td>
            <td className="right nowrap">{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
              amount,
              baseCurrencyDecimal
            )}`}</td>
          </tr>
        ))}
      </MultiTaxBreakdown>
    </div>
  );
};

export default MultiTaxItemsPopover;

const MultiTaxBreakdown = styled.table`
  tr {
    height: 40px;

    &.total {
      color: #53698c;
      font-weight: 600;
    }

    &:first-child {
      background-color: #f8f8f8;
      color: #666;
      font-weight: 600;
    }

    &:last-child td {
      border-bottom: none;
    }

    &.breakdown {
      background-color: #f4f6f9;
      height: 30px;

      &.details {
        font-size: 10px;
      }
    }
  }

  td {
    text-align: left;
    border-bottom: 1px solid #dddddd;
    font-size: 11px;
    padding: 0px 3px;

    &.nowrap {
      white-space: nowrap;
    }

    &.borderless {
      border: none;
    }

    &.right {
      text-align: right;
    }

    &:first-child {
      padding: 0px 10px;
    }

    &:last-child {
      padding-right: 10px;
    }

    &:nth-child(4),
    &:nth-child(5) {
      min-width: 125px;
    }
  }
`;
