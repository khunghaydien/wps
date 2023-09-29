import React from 'react';

import get from 'lodash/get';

import styled from 'styled-components';

import msg from '@commons/languages/';
import DateUtil from '@commons/utils/DateUtil';
import FormatUtil from '@commons/utils/FormatUtil';

import { RecordItem } from '@apps/domain/models/exp/Record';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  items: RecordItem[];
};

const ROOT = 'ts-expenses__form-records__list-items-detail';

const Itemization = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  items,
}: Props) => {
  const [_, ...childItemList] = items;
  const parentItem = items[0];
  const { useForeignCurrency } = parentItem;
  const taxItems = parentItem.taxItems || [];

  const renderLocalAmount = (item: RecordItem) => {
    const foreignSymbol = get(item, 'currencyInfo.symbol', '');
    const foreignDecimal = get(item, 'currencyInfo.decimalPlaces', 0);
    const foreignAmount = FormatUtil.formatNumber(
      item.localAmount,
      foreignDecimal
    );
    return (
      <ForeignLocalAmount>
        {foreignSymbol} {foreignAmount}
      </ForeignLocalAmount>
    );
  };

  return (
    <div className={ROOT}>
      <MultiTaxBreakdownHeader useForeignCurrency={useForeignCurrency}>
        <tbody>
          <tr>
            <td className="nowrap order-number">#</td>
            <td className="nowrap date">{msg().Exp_Clbl_Date}</td>
            <td className="nowrap expense-type">
              {msg().Exp_Clbl_ExpenseType}
            </td>
            {useForeignCurrency ? (
              <td className="right nowrap amount">{msg().Exp_Clbl_Amount}</td>
            ) : (
              <>
                <td className="right nowrap gst-amount">
                  {msg().Exp_Clbl_GstAmount}
                </td>
                <td className="right without-tax">
                  {msg().Exp_Clbl_WithoutTax}
                </td>
                <td className="right include-tax">
                  {msg().Exp_Clbl_IncludeTax}
                </td>
              </>
            )}
            <td className="space"></td>
          </tr>
        </tbody>
      </MultiTaxBreakdownHeader>

      <MultiTaxBreakdownBody useForeignCurrency={useForeignCurrency}>
        <table>
          <tbody>
            {childItemList.map((item, idx) => (
              <tr key={item.itemId}>
                <td className="order-number">{`${idx + 1}.`}</td>
                <td className="nowrap date">
                  {DateUtil.formatYMD(item.recordDate)}
                </td>
                <td className="expense-type">{item.expTypeName}</td>
                {useForeignCurrency ? (
                  <td className="right amount">
                    <>
                      {baseCurrencySymbol}&nbsp;
                      {FormatUtil.formatNumber(
                        item.amount,
                        baseCurrencyDecimal
                      )}
                      {renderLocalAmount(item)}
                    </>
                  </td>
                ) : (
                  <>
                    <td className="right gst-amount ellipsis-cell">
                      {baseCurrencySymbol}&nbsp;
                      {FormatUtil.formatNumber(
                        item.gstVat,
                        baseCurrencyDecimal
                      )}
                    </td>

                    <td className="right without-tax ellipsis-cell">
                      {baseCurrencySymbol}&nbsp;
                      {FormatUtil.formatNumber(
                        item.withoutTax,
                        baseCurrencyDecimal
                      )}
                    </td>
                    <td className="right include-tax ellipsis-cell">
                      {baseCurrencySymbol}&nbsp;
                      {FormatUtil.formatNumber(
                        item.amount,
                        baseCurrencyDecimal
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </MultiTaxBreakdownBody>

      <MultiTaxBreakdownFooter>
        <tbody>
          <tr className="total breakdown">
            <td className="borderless order-number"></td>
            <td className="borderless date"></td>
            <td
              className={`right borderless ${
                !useForeignCurrency ? 'total-amount' : ''
              }`}
            >
              {msg().Exp_Lbl_TotalAmount}
            </td>
            {!useForeignCurrency && (
              <>
                <td className="right gst-amount ellipsis-cell">
                  {baseCurrencySymbol}&nbsp;
                  {FormatUtil.formatNumber(
                    parentItem.gstVat,
                    baseCurrencyDecimal
                  )}
                </td>

                <td className="right without-tax ellipsis-cell">
                  {baseCurrencySymbol}&nbsp;
                  {FormatUtil.formatNumber(
                    parentItem.withoutTax,
                    baseCurrencyDecimal
                  )}
                </td>
              </>
            )}
            <TotalAmountTd
              className={`right ellipsis-cell ${
                !useForeignCurrency ? ' include-tax' : ''
              }`}
              useForeignCurrency={useForeignCurrency}
            >
              {baseCurrencySymbol}&nbsp;
              {FormatUtil.formatNumber(parentItem.amount, baseCurrencyDecimal)}
              {useForeignCurrency && renderLocalAmount(parentItem)}
            </TotalAmountTd>
            <td className="space"></td>
          </tr>

          {taxItems.map(({ amount, gstVat, taxRate, withoutTax }, index) => (
            <tr key={index.toString()} className="breakdown details">
              <td className="borderless order-number"></td>
              <td className="borderless date">{}</td>
              <td className="borderless expense-type">{}</td>
              <td className="right gst-amount ellipsis-cell">
                {`(${taxRate}%)`} {baseCurrencySymbol}&nbsp;
                {FormatUtil.formatNumber(gstVat, baseCurrencyDecimal)}
              </td>
              <td className="right without-tax ellipsis-cell">
                {baseCurrencySymbol}&nbsp;
                {FormatUtil.formatNumber(withoutTax, baseCurrencyDecimal)}
              </td>
              <td className="right include-tax ellipsis-cell">
                {baseCurrencySymbol}&nbsp;
                {FormatUtil.formatNumber(amount, baseCurrencyDecimal)}
              </td>
              <td className="space"></td>
            </tr>
          ))}
        </tbody>
      </MultiTaxBreakdownFooter>
    </div>
  );
};

export default Itemization;
const td = `td {
  text-align: left;
  border-bottom: 1px solid #dddddd;
  font-size: 11px;
  padding-left: 10px;

  &.order-number {
    width: 20px;
  }

  &.date{
    width: 80px;
  }

  &.expense-type, 
  &.total-amount{
    width: 100px;
  }

  &.amount {
    width: 295px;
  }

  &.gst-amount {
    width: 99px;
    max-width: 99px;
    word-break: break-word;
  }

  &.without-tax {
    width: 96px;
    max-width: 96px;
    word-break: break-word;
  }

  &.include-tax {
    width: 100px;
    max-width: 100px;
    word-break: break-word;
  }

  &.nowrap {
    white-space: nowrap;
  }

  &.borderless {
    border: none;
  }

  &.right {
    text-align: right;
  }

  &:last-child {
    padding-right: 5px;
  }

  &.ellipsis-cell{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}`;

const MultiTaxBreakdownHeader = styled.table<{ useForeignCurrency: boolean }>`
  tr {
    height: 40px;
    background-color: #f8f8f8;
    color: #666;
    font-weight: 600;
    & td.expense-type {
      width: ${({ useForeignCurrency }) => (useForeignCurrency ? '270px' : '')};
    }
    & td.amount {
      width: ${({ useForeignCurrency }) => (useForeignCurrency ? '130px' : '')};
    }
    & td.include-tax,
    td.amount {
      padding-right: 5px;
    }
    & td.space {
      padding-right: 8px;
    }
  }

  ${td}
`;

const MultiTaxBreakdownFooter = styled.table`
  tr {
    height: 40px;
    &.total {
      color: #53698c;
      font-weight: 600;
    }

    & td.space {
      width: 16px;
    }

    & td.include-tax {
      padding-right: 7px;
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

  ${td}
`;

const MultiTaxBreakdownBody = styled.div<{ useForeignCurrency: boolean }>`
   {
    max-height: 81px;
    overflow-y: scroll;
    tr {
      height: 40px;
      & td.expense-type {
        width: ${({ useForeignCurrency }) =>
          useForeignCurrency ? '270px' : ''};
      }
      & td.amount {
        width: ${({ useForeignCurrency }) =>
          useForeignCurrency ? '130px' : ''};
      }
      & td.include-tax {
        max-width: 96px;
      }
    }
    ${td}
  }
`;

const ForeignLocalAmount = styled.div`
  color: #666;
  font-size: 10px;
`;

const TotalAmountTd = styled.td<{ useForeignCurrency: boolean }>`
  padding: ${({ useForeignCurrency }) =>
    useForeignCurrency ? '10px 7px 10px 10px' : '0 7px 0 10px'};
  width: 95px;
`;
