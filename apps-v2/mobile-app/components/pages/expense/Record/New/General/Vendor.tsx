import React from 'react';

import msg from '@commons/languages';
import SearchButtonField from '@mobile/components/molecules/commons/Fields/SearchButtonField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';

import { Record } from '@apps/domain/models/exp/Record';
import {
  getJctRegistrationNumber,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
} from '@apps/domain/models/exp/Vendor';

import Icon from '@mobile/components/atoms/Icon';
import LabelWithHint from '@mobile/components/atoms/LabelWithHint';

import './Vendor.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general__vendor';

type Props = {
  values: Record;
  isVendorRequired: boolean;
  readOnly: boolean;
  useJctRegistrationNumber: boolean;
  setError: (arg0: string) => string[];
  handleDateChange: (date: Date) => void;
  onClickVendorItem: () => void;
  onClickDeleteVendorButton: () => void;
  onClickDeletePaymentDueDate: () => void;
  onClickVendorDetail: () => void;
};

const RecordVendor = (props: Props) => {
  const {
    values,
    isVendorRequired,
    readOnly,
    useJctRegistrationNumber,
    onClickVendorItem,
    onClickDeleteVendorButton,
    setError,
    handleDateChange,
    onClickDeletePaymentDueDate,
    onClickVendorDetail,
  } = props;
  const targetRecord = values.items[0];
  const showPaymentDate =
    targetRecord.vendorId &&
    targetRecord.paymentDueDateUsage !== VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed;
  const paymentDateRequired =
    targetRecord.paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required;

  return (
    <>
      <section className={`${ROOT}__input`}>
        {readOnly ? (
          <div>
            <LabelWithHint
              className={`${ROOT}__label`}
              text={msg().Exp_Clbl_Vendor}
              marked={isVendorRequired}
            />
            <button
              className={`${ROOT}--read-only`}
              onClick={onClickVendorDetail}
              type="button"
              disabled={!targetRecord.vendorId}
            >
              <span className={`${ROOT}--read-only__vendor-name`}>
                {targetRecord.vendorName}
              </span>
              <Icon type="chevronright" />
            </button>
          </div>
        ) : (
          <SearchButtonField
            required={isVendorRequired}
            placeholder={msg().Admin_Lbl_Search}
            onClick={onClickVendorItem}
            onClickDeleteButton={onClickDeleteVendorButton}
            value={targetRecord.vendorName}
            label={msg().Exp_Clbl_Vendor}
            errors={setError(`items.0.vendorId`)}
            disabled={readOnly}
          />
        )}

        {targetRecord.vendorId && useJctRegistrationNumber && (
          <div className={`${ROOT}__vendor-jct`}>{`${
            msg().Exp_Clbl_JctRegistrationNumber
          }: ${getJctRegistrationNumber(
            targetRecord.vendorJctRegistrationNumber,
            targetRecord.vendorIsJctQualifiedIssuer
          )}`}</div>
        )}
      </section>
      {showPaymentDate && (
        <section className={`${ROOT}__input`}>
          <SFDateField
            useRemoveValueButton
            onClickRemoveValueButton={onClickDeletePaymentDueDate}
            required={paymentDateRequired}
            label={msg().Exp_Clbl_PaymentDate}
            errors={setError(`items.0.paymentDueDate`)}
            onChange={(_e, { date }) => {
              handleDateChange(date);
            }}
            disabled={readOnly}
            value={targetRecord.paymentDueDate}
          />
        </section>
      )}
    </>
  );
};

export default RecordVendor;
