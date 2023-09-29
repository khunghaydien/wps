import React from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import msg from '@commons/languages';
import FormatUtil from '@commons/utils/FormatUtil';

import { getTotalTaxSummary, Records } from '@apps/domain/models/exp/Report';
import {
  TAX_DETAILS_TYPE,
  TaxDetailType,
} from '@apps/domain/models/exp/TaxType';

import './TaxSummary.scss';

const ROOT = 'ts-expenses__form-tax-summary';
type TaxSummaryProps = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expDisplayTaxDetailsSetting: TaxDetailType;
  foreignCurrencyAmount?: JSX.Element[];
  isPCApproval?: boolean;
  records: Records;
};
const TaxSummary = ({
  records,
  baseCurrencySymbol,
  baseCurrencyDecimal,
  foreignCurrencyAmount,
  isPCApproval,
  expDisplayTaxDetailsSetting,
}: TaxSummaryProps) => {
  const cssClass = classNames({
    [`${ROOT}__approval`]: isPCApproval,
  });
  const listSumTax = getTotalTaxSummary(records);
  const isShowTaxSummary = listSumTax.length > 0;
  const isShowForeignAmounts = !isEmpty(foreignCurrencyAmount);
  if (!isShowTaxSummary && !isShowForeignAmounts) return null;
  return (
    <>
      <div className={`${cssClass} ${ROOT}`}>
        {isShowTaxSummary && (
          <div className={`${cssClass}--tax-detail ${ROOT}--tax-detail`}>
            <div
              className={`${cssClass}--tax-detail-title ${ROOT}--tax-detail-title`}
            >
              {msg().Exp_Lbl_TaxDetails}
            </div>
            <div className={`${ROOT}--tax-detail-line`}></div>
            <div
              className={`${cssClass}--tax-detail-list-amount ${ROOT}--tax-detail-list-amount`}
            >
              {listSumTax.map((item, i) => (
                <div
                  key={i}
                  className={`${cssClass}--list-amount-item ${ROOT}--list-amount-item`}
                >
                  <div className={`${ROOT}--list-amount-item-tax-rate-detail`}>
                    <div className={`${ROOT}--list-amount-item-tax-rate`}>
                      {item.taxRate}%
                    </div>
                  </div>
                  <div
                    className={`${ROOT}--list-amount-item-tax-rate-subdetail`}
                  >
                    <span className={`${ROOT}--list-amount-item-tax-amount`}>
                      {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                        expDisplayTaxDetailsSetting ===
                          TAX_DETAILS_TYPE.ExcludedAmount
                          ? item.amountExcl
                          : item.amount,
                        baseCurrencyDecimal
                      )}`}
                    </span>
                    <span>
                      (
                      {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                        item.gst,
                        baseCurrencyDecimal
                      )}`}
                      )
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isShowForeignAmounts && (
          <div
            className={`${cssClass}--foreign-currency ${ROOT}--foreign-currency`}
          >
            <div
              className={`${cssClass}--foreign-currency-title ${ROOT}--foreign-currency-title`}
            >
              {msg().Exp_Lbl_ForeignCurrencyDetails}
            </div>
            <div className={`${ROOT}--foreign-currency-line `}></div>
            <div
              className={`${cssClass}--foreign-currency-amount ${ROOT}--foreign-currency-amount`}
            >
              {foreignCurrencyAmount}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default TaxSummary;
