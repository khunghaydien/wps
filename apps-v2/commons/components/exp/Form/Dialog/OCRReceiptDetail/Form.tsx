import React, { useCallback, useEffect, useMemo } from 'react';

import AmountField from '@commons/components/fields/AmountField';
import DateField from '@commons/components/fields/DateField';
import TextField from '@commons/components/fields/TextField';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
  OcrInfo,
} from '@apps/domain/models/exp/Receipt';

// import JctRegistrationNumber from '../../RecordItem/JctRegistrationNumber';
import Warning from './Warning';

export type FormProps = {
  baseCurrencyDecimal: number;
  ocrDetail: OcrInfo;
  setOCRDetail: (OcrInfo) => void;
};

type Props = {
  className: string;
  // isLoading: boolean;
  // loadingAreas: string[];
  originalOCRDetail: OcrInfo;
  // useJctRegistrationNumber?: boolean;
} & FormProps;

const Form = (props: Props) => {
  const today = DateUtil.getToday();
  const {
    recordDate: date,
    amount,
    merchant,
    // jctRegistrationNumber,
  } = props.ocrDetail;
  const recordDate = date || today;

  const updateFieldByKey = useCallback(
    (key: string) => (value) => {
      const updated = { ...props.ocrDetail, [key]: value };
      return props.setOCRDetail(updated);
    },
    [props.ocrDetail, props.setOCRDetail]
  );

  const handleDateChange = (val) => {
    const value = val || today;
    updateFieldByKey('recordDate')(value);
  };

  useEffect(() => {
    // today's date for record date will be default if cannot obtain from OCR
    if (!date) {
      handleDateChange(today);
    }
  }, [date]);

  const dateField = (
    <DateField value={recordDate} required onChange={handleDateChange} />
  );
  const amountField = useMemo(
    () => (
      <AmountField
        fractionDigits={props.baseCurrencyDecimal}
        value={amount}
        onBlur={updateFieldByKey('amount')}
      />
    ),
    [props.baseCurrencyDecimal, amount, updateFieldByKey]
  );

  const { status, message } = generateOCRAmountMsg(
    props.originalOCRDetail.amount,
    amount,
    props.baseCurrencyDecimal
  );

  const isShowAmountWarning = status !== AMOUNT_MATCH_STATUS.OK;
  const isFilledToday = !props.originalOCRDetail.recordDate && date === today;
  const isShowDateWarning =
    props.originalOCRDetail.recordDate !== recordDate || isFilledToday;
  // if today is filled due to no scanned data, show Exp_Err_AutoFillToday warning msg
  const dateWarningLabelKey = isFilledToday ? null : 'Exp_Clbl_Date';
  const dateWarningMsg = isFilledToday
    ? msg().Exp_Err_AutoFillToday
    : undefined;

  const merchantField = (
    <TextField
      value={merchant}
      label={msg().Exp_Clbl_Merchant}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        updateFieldByKey('merchant')(e.target.value);
      }}
    />
  );

  // const jctRegistrationNumberField = (
  //   <div className={`${props.className}__jct-number-container`}>
  //     <JctRegistrationNumber
  //       value={jctRegistrationNumber}
  //       onChange={updateFieldByKey('jctRegistrationNumber')}
  //       isLoading={props.isLoading}
  //       loadingAreas={props.loadingAreas}
  //       isDotLoader
  //       isLoaderOverride
  //       onConfirm={() => {}}
  //       disabled={false}
  //     />
  //   </div>
  // );

  return (
    <div className={props.className}>
      <div className={`${props.className}__title`}>
        {msg().Exp_Lbl_ConfirmReceiptDetail}
      </div>
      <div className="key">
        <span className="is-required">*</span>
        &nbsp;{msg().Exp_Clbl_Date}
      </div>
      {dateField}
      {isShowDateWarning && (
        <Warning labelKey={dateWarningLabelKey} wholeMsg={dateWarningMsg} />
      )}
      <div className="key">{msg().Exp_Clbl_Amount}</div>
      {amountField}
      {isShowAmountWarning && <Warning labelKey={null} wholeMsg={message} />}
      {merchantField}
      {/* {props.useJctRegistrationNumber && jctRegistrationNumberField} */}
    </div>
  );
};

export default Form;
