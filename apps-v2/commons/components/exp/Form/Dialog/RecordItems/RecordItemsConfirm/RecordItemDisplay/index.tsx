import React from 'react';

import { getLabelValueFromEIs } from '../../../../../../../../domain/models/exp/ExtendedItem';
import { RecordItem } from '../../../../../../../../domain/models/exp/Record';

import DateUtil from '../../../../../../../utils/DateUtil';
import FormatUtil from '../../../../../../../utils/FormatUtil';

import ImgEditOn from '../../../../../../../images/btnEditOn.svg';
import msg from '../../../../../../../languages';
import TextField from '../../../../../../fields/TextField';
import MultiColumnsGrid from '../../../../../../MultiColumnsGrid';

import './index.scss';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  recordItem?: RecordItem;
};

const RecordItemDisplay = ({
  recordItem,
  baseCurrencyDecimal,
  baseCurrencySymbol,
}: Props) => {
  if (!recordItem) {
    return null;
  }

  const ROOT = 'ts-expenses-modal-record-items__confirm-display';
  const extendedItems = getLabelValueFromEIs(recordItem);
  const taxNameDisplay = `${
    recordItem.taxTypeName || ''
  } - ${FormatUtil.convertToDisplayingPercent(recordItem.taxRate)}`;

  const renderBaseCurrency = () => {
    const amountWithoutGST = FormatUtil.formatNumber(
      recordItem.withoutTax,
      baseCurrencyDecimal
    );
    const gstVat = FormatUtil.formatNumber(
      recordItem.gstVat,
      baseCurrencyDecimal
    );

    const amountInclGST = FormatUtil.formatNumber(
      recordItem.amount,
      baseCurrencyDecimal
    );

    const editImage = recordItem.taxManual ? (
      <ImgEditOn aria-hidden="true" className="edit-icon" />
    ) : null;

    return (
      <MultiColumnsGrid className={`${ROOT}-amount-area`} sizeList={[6, 6]}>
        <div>
          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_Amount}
          </div>
          <TextField
            value={`${baseCurrencySymbol} ${amountInclGST}`}
            readOnly
          />

          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_WithoutTax}
          </div>
          <TextField
            value={`${baseCurrencySymbol} ${amountWithoutGST}`}
            readOnly
          />
        </div>

        <div>
          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_Gst}
          </div>
          <TextField value={taxNameDisplay} readOnly />

          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_GstAmount}
          </div>
          <div className={`${ROOT}-amount-area-gst`}>
            <TextField value={`${baseCurrencySymbol} ${gstVat}`} readOnly />
            {editImage}
          </div>
        </div>
      </MultiColumnsGrid>
    );
  };

  const renderForeignCurrency = () => {
    const amount = FormatUtil.formatNumber(
      recordItem.amount,
      baseCurrencyDecimal
    );
    const localAmount = FormatUtil.formatNumber(
      recordItem.localAmount,
      recordItem.currencyInfo.decimalPlaces
    );
    const isEditable = recordItem.exchangeRateManual;
    const editImage = isEditable ? (
      <ImgEditOn aria-hidden="true" className="edit-icon" />
    ) : null;

    return (
      <MultiColumnsGrid className={`${ROOT}-amount-area`} sizeList={[6, 6]}>
        <div>
          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_LocalAmount}
          </div>
          <TextField
            value={`${recordItem.currencyInfo.symbol || ''} ${localAmount}`}
            readOnly
          />

          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_Amount}
          </div>
          <TextField value={`${baseCurrencySymbol} ${amount}`} readOnly />
        </div>

        <div>
          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_Currency}
          </div>
          <TextField value={recordItem.currencyInfo.code} readOnly />

          <div className={`${ROOT}-amount-area-label`}>
            {msg().Exp_Clbl_ExchangeRate}
          </div>
          <div className={`${ROOT}-amount-area-rate`}>
            <TextField value={recordItem.exchangeRate} readOnly />
            {editImage}
          </div>
        </div>
      </MultiColumnsGrid>
    );
  };

  const renderAmountArea = () => {
    if (recordItem.useForeignCurrency) {
      return renderForeignCurrency();
    }
    return renderBaseCurrency();
  };

  return (
    <div className={`${ROOT}`}>
      <section className={`${ROOT}-header`}>
        <div className={`${ROOT}-nav-title`}>
          <span>{msg().Exp_Lbl_Detail}</span>
        </div>
      </section>

      <section className={`${ROOT}-content`}>
        <div className={`${ROOT}-date`}>
          <div className="key">{msg().Exp_Clbl_Date}</div>
          <div className="content">
            {DateUtil.formatYMD(recordItem.recordDate)}
          </div>
        </div>

        <div className={`${ROOT}-exp-type`}>
          <div className="key">{msg().Exp_Clbl_ExpenseType}</div>
          <div className="content">{recordItem.expTypeName}</div>
        </div>
        {recordItem.expTypeDescription && (
          <div className={`${ROOT}__expense-type-description`}>
            {recordItem.expTypeDescription}
          </div>
        )}

        {renderAmountArea()}

        {extendedItems.map((pair) => (
          <div className={`${ROOT}-ei`} key={pair.label}>
            <div className="key">{pair.label}</div>
            <div className={`${ROOT}-ei-body content`}>{pair.value}</div>
          </div>
        ))}

        <div className={`${ROOT}-sum`}>
          <div className="key">{msg().Exp_Clbl_Summary}</div>
          <div className={`${ROOT}-sum-body content`}>{recordItem.remarks}</div>
        </div>
      </section>
    </div>
  );
};

export default RecordItemDisplay;
