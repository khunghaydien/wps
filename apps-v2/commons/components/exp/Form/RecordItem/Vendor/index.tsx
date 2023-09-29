import React from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import Button from '@commons/components/buttons/Button';
import DateField from '@commons/components/fields/DateField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import IconCompany from '@commons/images/icons/company.svg';
import IconUser from '@commons/images/icons/user.svg';
import msg from '@commons/languages';

import { Record } from '@apps/domain/models/exp/Record';
import {
  getJctRegistrationNumber,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
  vendorTypes,
} from '@apps/domain/models/exp/Vendor';

import QuickSearch, { Option } from '../../QuickSearch';

import './index.scss';

type Props = {
  errors: { recordDate?: string; records?: Array<any> };
  expRecord: Record;
  isRequired: boolean;
  readOnly: boolean;
  recordIdx: number;
  shouldUpdateJctRegistrationNumber: boolean;
  showVendorFilter: boolean;
  useJctRegistrationNumber: boolean;
  getRecentVendors: () => Promise<Option[]>;
  isHighlight: (key: string) => boolean;
  onChangeUpdateReport: (
    arg0: string,
    arg1: any,
    arg2?: boolean,
    arg3?: unknown,
    arg4?: boolean
  ) => void;
  onClickVendorSearch: () => void;
  searchVendors: (keyword?: string) => Promise<Option[]>;
  toggleVendorDetail: (arg0: boolean) => void;
};

const ROOT = 'ts-expenses__form-record-item__vendor';

const { COMPANY, PERSONAL } = vendorTypes;

export const vendorFilters = [
  {
    label: msg().Exp_Lbl_Personal,
    value: PERSONAL,
    isChecked: true,
    icon: <IconUser />,
  },
  {
    label: msg().Com_Lbl_Company,
    value: COMPANY,
    isChecked: true,
    icon: <IconCompany />,
  },
];

const RecordVendor = (props: Props) => {
  const {
    isRequired,
    readOnly,
    recordIdx,
    expRecord,
    showVendorFilter,
    useJctRegistrationNumber,
    errors,
    isHighlight,
    shouldUpdateJctRegistrationNumber,
    getRecentVendors,
    toggleVendorDetail,
    onChangeUpdateReport,
    onClickVendorSearch,
    searchVendors,
  } = props;
  const targetRecord = expRecord.items[0];
  const displayValue = targetRecord.vendorId
    ? `${targetRecord.vendorCode} - ${targetRecord.vendorName}`
    : '';
  const placeHolder = msg().Com_Lbl_PressEnterToSearch;
  const showPaymentDate =
    targetRecord.vendorId &&
    targetRecord.paymentDueDateUsage !== VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed;
  const paymentDateRequired =
    targetRecord.paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required;
  const vendorError = get(errors, `records[${recordIdx}].items.0.vendorId`);
  const paymentDueDateError = get(
    errors,
    `records[${recordIdx}].items.0.paymentDueDate`
  );

  const onClearVendor = async () => {
    const targetRecord = `records[${recordIdx}]`;
    toggleVendorDetail(false);
    const updatedRecord = cloneDeep(expRecord);
    updatedRecord.items[0].vendorId = null;
    updatedRecord.items[0].paymentDueDateUsage = null;
    updatedRecord.items[0].paymentDueDate = null;
    updatedRecord.items[0].vendorJctRegistrationNumber = '';
    updatedRecord.items[0].vendorIsJctQualifiedIssuer = false;
    await onChangeUpdateReport(targetRecord, updatedRecord);
    if (isRequired) {
      onChangeUpdateReport(
        'isRecordVendorRequired',
        isRequired,
        false,
        false,
        true
      );
    }
  };

  const onSelectVendor = (x: Option) => {
    if (!x.id) {
      onClearVendor();
      return;
    }
    const targetRecord = `records[${recordIdx}]`;
    const updatedRecord = cloneDeep(expRecord);
    updatedRecord.items[0].vendorId = x.id;
    updatedRecord.items[0].vendorName = x.name;
    updatedRecord.items[0].vendorCode = x.code;
    updatedRecord.items[0].paymentDueDateUsage = x.paymentDueDateUsage;
    updatedRecord.items[0].paymentDueDate = null;
    if (useJctRegistrationNumber) {
      if (x.jctRegistrationNumber && shouldUpdateJctRegistrationNumber) {
        updatedRecord.items[0].jctRegistrationNumber = x.jctRegistrationNumber;
      }
      updatedRecord.items[0].vendorJctRegistrationNumber =
        x.jctRegistrationNumber;
      updatedRecord.items[0].vendorIsJctQualifiedIssuer =
        x.isJctQualifiedInvoiceIssuer;
    }
    onChangeUpdateReport(targetRecord, updatedRecord);
  };

  const onChangePaymentDate = (value: string) => {
    const targetRecord = `records[${recordIdx}]`;
    onChangeUpdateReport(
      `${targetRecord}.items.0.paymentDueDate`,
      value,
      false,
      { paymentDueDate: true }
    );
  };

  return (
    <div className={ROOT}>
      <div className={`${ROOT}-input ts-text-field-container`}>
        <LabelWithHint text={msg().Exp_Clbl_Vendor} isRequired={isRequired} />
        <QuickSearch
          ROOT={ROOT}
          filters={showVendorFilter ? vendorFilters : []}
          disabled={readOnly}
          placeholder={placeHolder}
          selectedId={targetRecord.vendorId}
          targetDate={''}
          displayValue={displayValue}
          onSelect={onSelectVendor}
          getRecentlyUsedItems={getRecentVendors}
          getSearchResult={searchVendors}
          openSearchDialog={onClickVendorSearch}
          isHighlight={isHighlight('vendorId')}
          useJctRegistrationNumber={useJctRegistrationNumber}
        />
        {vendorError && (
          <div className="input-feedback">{msg()[vendorError]}</div>
        )}
        {targetRecord.vendorId && (
          <div className={`${ROOT}--info`}>
            <Button
              className={`${ROOT}-btn--viewDetail`}
              onClick={() => toggleVendorDetail(true)}
            >
              {msg().Exp_Btn_VendorDetail}
            </Button>
            {useJctRegistrationNumber && (
              <div className={`${ROOT}--jct-number`}>
                {`${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  targetRecord.vendorJctRegistrationNumber,
                  targetRecord.vendorIsJctQualifiedIssuer
                )}`}
              </div>
            )}
          </div>
        )}
      </div>

      {showPaymentDate && (
        <div className="ts-text-field-container">
          <p className="key">
            {paymentDateRequired && <span className="is-required">*</span>}
            &nbsp;{msg().Exp_Clbl_PaymentDate}
          </p>
          <DateField
            value={targetRecord.paymentDueDate || ''}
            onChange={onChangePaymentDate}
            disabled={readOnly}
            className={classNames({
              'highlight-bg': isHighlight('paymentDueDate'),
            })}
          />
          {paymentDueDateError && (
            <div className="input-feedback">{msg()[paymentDueDateError]}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordVendor;
