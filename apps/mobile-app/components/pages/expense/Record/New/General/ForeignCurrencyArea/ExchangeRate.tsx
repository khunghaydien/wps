import React, { useEffect, useState } from 'react';

import msg from '../../../../../../../../commons/languages';
import CurrencyUtil from '../../../../../../../../commons/utils/CurrencyUtil';
import TextField from '../../../../../../molecules/commons/Fields/TextField';
import ViewItem from '../../../../../../molecules/commons/ViewItem';
import IconButton from '@commons/components/buttons/IconButton';
import ImgEditDisabled from '@commons/images/btnEditDisabled.svg';
import ImgEditOn from '@commons/images/btnEditOn.svg';

const ROOT =
  'mobile-app-pages-expense-page-record-new-general-foreign-currency-area-exchange-rate';

type Props = {
  readOnly: boolean;
  exchangeRateManual: boolean;
  exchangeRate: number;
  originalExchangeRate: number;
  onExchangeRateBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onExchangeRateFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClickEditRateBtn: () => void;
};

const ExchangeRate = (props: Props) => {
  const { readOnly, exchangeRateManual, exchangeRate } = props;
  const [rate, setRate] = useState(exchangeRate);
  useEffect(() => {
    setRate(exchangeRate);
  }, [exchangeRate]);

  const hanldeExchangeRateChange = (e) => {
    const { value } = e.target;
    if (CurrencyUtil.validateExchangeRate(value) || value.length === 0) {
      setRate(value);
    }
  };

  const disabledInput = readOnly || !props.exchangeRateManual;
  const disabledPencil = readOnly || !props.originalExchangeRate;

  const readOnlyClass = `${readOnly ? 'read-only' : ''}`;

  const rateArea = (
    <TextField
      className="rate-area"
      label={msg().Exp_Clbl_ExchangeRate}
      value={rate}
      onChange={hanldeExchangeRateChange}
      onBlur={props.onExchangeRateBlur}
      onFocus={props.onExchangeRateFocus}
      required
      disabled={disabledInput}
    />
  );

  const pencilIcon = (
    <IconButton
      alt={exchangeRateManual ? 'ImgEditOn' : 'ImgEditOff'}
      onClick={props.onClickEditRateBtn}
      className={`${ROOT}__edit`}
      disabled={disabledPencil}
      src={exchangeRateManual ? ImgEditDisabled : ImgEditOn}
      srcType="svg"
    />
  );

  return (
    <ViewItem label="" align="left" className={`${ROOT} ${readOnlyClass}`}>
      {rateArea}
      {pencilIcon}
    </ViewItem>
  );
};

export default ExchangeRate;
