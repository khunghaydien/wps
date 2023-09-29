import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import LabelWithHint from '@commons/components/fields/LabelWithHint';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  getOptionsInvoice,
  JCT_NUMBER_INVOICE,
} from '@apps/domain/models/exp/JCTNo';
import { Record } from '@apps/domain/models/exp/Record';

import JctRegistrationNumber from '../JctRegistrationNumber';

import './index.scss';

type Props = {
  customHint: CustomHint;
  disabled?: boolean;
  expRecord: Record;
  hasRecordVendor?: boolean;
  isLoading: boolean;
  isShowJctRegistrationNumber?: boolean;
  jctRegistrationNumberUsage: string;
  loadingAreas: string[];
  onChangeRadio?: Function;
  optionValue?: string;
  recordJctNumber?: string;
  getHighlightDiff?: (arg0: string) => boolean;
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
    recordJctNumber,
    disabled,
    isShowJctRegistrationNumber,
    hasRecordVendor,
    onChangeJctNumber,
    getHighlightDiff,
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
        <label
          htmlFor={id}
          className={classNames({
            'highlight-bg': getHighlightDiff('jctInvoiceOption') && checked,
          })}
        >
          {label}
        </label>
      </div>
    );
  };

  const renderJctRegistrationNumberField = () => {
    const vendorId = get(props.expRecord, 'items.0.vendorId', null);
    const vendorJctRegistrationNumber = get(
      props.expRecord,
      'items.0.vendorJctRegistrationNumber',
      null
    );
    const disabledJctNo =
      !isChecked(JCT_NUMBER_INVOICE.Invoice) ||
      disabled ||
      (vendorId &&
        vendorJctRegistrationNumber &&
        vendorJctRegistrationNumber === recordJctNumber &&
        hasRecordVendor);

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
          isHighlightDiff={getHighlightDiff('jctRegistrationNumber')}
        />
      </div>
    );
  };

  const options = getOptionsInvoice(jctRegistrationNumberUsage);

  return (
    <div className={ROOT}>
      <LabelWithHint
        text={msg().Exp_Clbl_Invoice}
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
