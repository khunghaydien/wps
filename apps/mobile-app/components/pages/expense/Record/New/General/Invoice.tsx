import React from 'react';

import msg from '@commons/languages';

import {
  getOptionsInvoice,
  JCT_NUMBER_INVOICE,
} from '@apps/domain/models/exp/JCTNo';

import LabelWithHint from '@mobile/components/atoms/LabelWithHint';

import JctRegistrationNumber from './JctRegistrationNumber';

import './Invoice.scss';

type Props = {
  hintMsg?: string;
  isShowHint?: boolean;
  onClickHint?: () => void;
  disabled?: boolean;
  jctRegistrationNumberUsage: string;
  onChangeRadio?: Function;
  optionValue?: string;
  recordJctNumber?: string;
  onChangeJctNumber?: (arg0: string) => void;
  isShowJctRegistrationNumber?: boolean;
};

const ROOT = 'mobile-app-pages-expense-page-record-new-general-invoice';

const RecordInvoice = (props: Props) => {
  const {
    jctRegistrationNumberUsage,
    optionValue,
    onChangeJctNumber,
    recordJctNumber,
    disabled,
    isShowJctRegistrationNumber,
  } = props;

  const isChecked = (value) => {
    return value === optionValue;
  };

  const onChangeRadio = (e) => {
    if (onChangeRadio) {
      props.onChangeRadio(e.target.value);
    }
  };

  const renderInputs = ({ id, value, label, isShow }) => {
    const checked = isChecked(value);

    if (!isShow) return null;
    return (
      <div className={`${ROOT}__radio-field`}>
        <input
          className={`${ROOT}__radio`}
          id={id}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChangeRadio}
          disabled={disabled}
        />
        <label htmlFor={id} className={`${ROOT}__label`}>
          {label}
        </label>
      </div>
    );
  };

  const renderJctRegistrationNumberField = () => {
    const disabledJctNo = !isChecked(JCT_NUMBER_INVOICE.Invoice) || disabled;
    if (!isShowJctRegistrationNumber) return null;
    return (
      <div className={`${ROOT}__jct-registration-number`}>
        <JctRegistrationNumber
          value={recordJctNumber || ''}
          disabled={disabledJctNo}
          placeholder={msg().Exp_Clbl_JctRegistrationNumber}
          onChange={onChangeJctNumber}
        />
      </div>
    );
  };

  const options = getOptionsInvoice(jctRegistrationNumberUsage);

  return (
    <div className={ROOT}>
      <LabelWithHint
        className={`${ROOT}__label`}
        text={msg().Exp_Clbl_JCTInvoice}
        hintMsg={props.hintMsg}
        onClickHint={props.onClickHint}
        isShowHint={props.isShowHint}
      />
      <div className={`${ROOT}__invoice-jct`}>
        {renderInputs({
          id: JCT_NUMBER_INVOICE.Invoice,
          value: JCT_NUMBER_INVOICE.Invoice,
          label: msg().Exp_Clbl_JCTInvoice,
          isShow: options.includes(JCT_NUMBER_INVOICE.Invoice),
        })}
        {renderJctRegistrationNumberField()}
        {renderInputs({
          id: JCT_NUMBER_INVOICE.NonInvoice,
          value: JCT_NUMBER_INVOICE.NonInvoice,
          label: msg().Exp_Clbl_JCTNonInvoice,
          isShow: options.includes(JCT_NUMBER_INVOICE.NonInvoice),
        })}
        {renderInputs({
          id: JCT_NUMBER_INVOICE.NotRequired,
          value: JCT_NUMBER_INVOICE.NotRequired,
          label: msg().Exp_Clbl_JCTNotRequired,
          isShow: options.includes(JCT_NUMBER_INVOICE.NotRequired),
        })}
      </div>
    </div>
  );
};

export default RecordInvoice;
