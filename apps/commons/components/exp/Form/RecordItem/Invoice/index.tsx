import React from 'react';

import LabelWithHint from '@commons/components/fields/LabelWithHint';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  getOptionsInvoice,
  JCT_NUMBER_INVOICE,
} from '@apps/domain/models/exp/JCTNo';

import JctRegistrationNumber from '../JctRegistrationNumber';

import './index.scss';

type Props = {
  customHint: CustomHint;
  disabled?: boolean;
  isLoading: boolean;
  isShowJctRegistrationNumber?: boolean;
  jctRegistrationNumberUsage: string;
  loadingAreas: string[];
  onChangeRadio?: Function;
  optionValue?: string;
  recordJctNumber?: string;
  onChangeJctNumber?: (arg0: string) => void;
};

const ROOT = 'ts-expenses__form-record-item-invoice';

const RecordInvoice = (props: Props) => {
  const {
    customHint,
    jctRegistrationNumberUsage,
    isLoading,
    loadingAreas,
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
          // onConfirm={() => {}}
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          isDotLoader
          isLoaderOverride
        />
      </div>
    );
  };

  const options = getOptionsInvoice(jctRegistrationNumberUsage);

  return (
    <div className={ROOT}>
      <LabelWithHint
        text={msg().Exp_Clbl_JCTInvoice}
        hintMsg={customHint?.recordInvoice}
      />
      <MultiColumnsGrid sizeList={[6, 6]}>
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
      </MultiColumnsGrid>
    </div>
  );
};

export default RecordInvoice;
