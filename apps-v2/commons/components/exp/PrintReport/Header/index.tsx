import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import {
  calculateSubtotalAmount,
  Report,
} from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import './index.scss';

const ROOT = 'expenses-pc-print-print-report-header';

export type Props = {
  report: Report;
  userSetting: UserSetting;
};

const renderSubtotalAmount = (
  baseCurrencySymbol,
  baseCurrencyDecimal,
  records
) => {
  const { foreignCurrency, baseCurrencyAmount } =
    calculateSubtotalAmount(records);

  const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
    const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
    return (
      <div key={fc}>
        {symbol}&nbsp;
        {FormatUtil.formatNumber(amount, decimalPlaces)}
      </div>
    );
  });

  return (
    <>
      {!!foreignCurrencyAmount && (
        <div>
          {!!baseCurrencyAmount && (
            <div
              className={`${ROOT}__total-base-amount`}
            >{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
              baseCurrencyAmount,
              baseCurrencyDecimal
            )}`}</div>
          )}
          <div className={`${ROOT}__total-foreign-amount`}>
            {foreignCurrencyAmount}
          </div>
        </div>
      )}
    </>
  );
};

const Header = ({ report, userSetting }: Props) => {
  const {
    purpose,
    totalAmount,
    subject,
    records,
    customRequestId,
    customRequestName,
  } = report;
  const {
    currencyDecimalPlaces: baseCurrencyDecimal,
    currencySymbol: baseCurrencySymbol,
  } = userSetting;

  const reportTotalAmount =
    FormatUtil.formatNumber(totalAmount, baseCurrencyDecimal) || 0;

  return (
    <div className={ROOT}>
      <MultiColumnsGrid sizeList={[8, 4]}>
        <div>
          <div className={`${ROOT}__subject`}>{`${
            msg().Exp_Clbl_ReportTitle
          } : ${subject}`}</div>
          <div className={`${ROOT}__purpose`}>{`${msg().Exp_Clbl_Purpose} : ${
            purpose || ''
          }`}</div>
          {customRequestId && (
            <div className={`${ROOT}__custom-request`}>{`${
              msg().Exp_Lbl_CustomRequest
            } : ${customRequestName || ''}`}</div>
          )}
        </div>
        <div>
          <div className={`${ROOT}__total-amount`}>{`${
            msg().Exp_Clbl_Amount
          } : ${baseCurrencySymbol}${reportTotalAmount}`}</div>
          {renderSubtotalAmount(
            baseCurrencySymbol,
            baseCurrencyDecimal,
            records
          )}
        </div>
      </MultiColumnsGrid>
    </div>
  );
};

export default Header;
