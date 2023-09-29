import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { forEach, get, isEmpty } from 'lodash';

import { Record } from '../../../../../domain/models/exp/Record';
import { Report } from '../../../../../domain/models/exp/Report';

import ImgIconChevronDown from '../../../../images/icons/chevrondown.svg';
import msg from '../../../../languages';
import IconButton from '../../../buttons/IconButton';
import Column, { MessageAreaColumn } from './Column';

import './index.scss';

const ROOT = 'ts-expenses__form-message-area';

type Props = {
  errors: any;
  expReport: Report;
  isAlwaysOpen?: boolean;
  overlap?: { record: boolean; report: boolean };
};

type ViewItems = Array<MessageAreaColumn>;

const RECORD_REQUIRED_NAME = {
  withholdingTaxAmount: msg().Exp_Clbl_WithholdingTaxAmount,
  merchant: msg().Exp_Clbl_Merchant,
  fixedAllowanceOptionId: msg().Exp_Lbl_AmountSelection,
  paymentMethodId: msg().Exp_Clbl_PaymentMethod,
  vendorId: msg().Exp_Lbl_Vendor,
  paymentDueDate: msg().Exp_Lbl_PaymentDate,
};

const RECORD_REQUIRED_FIELDS = [
  'withholdingTaxAmount',
  'merchant',
  'fixedAllowanceOptionId',
  'paymentMethodId',
  'vendorId',
  'paymentDueDate',
];

const RECORD_CHECK_LIST = [
  'recordDate',
  'receiptId',
  'expTypeId',
  'items',
  'transitIcRecordId',
  ...RECORD_REQUIRED_FIELDS,
];

const getEIFieldName = (key: string, expRecord: Record) => {
  const eiPrefix = key.substring(0, key.indexOf('Value'));
  return get(expRecord, `items.0.${eiPrefix}Info.name`, '');
};

//
// Area to display only special errors and warn.
// Normal errors are not displayed here.
//
const MessageArea = (props: Props) => {
  const { errors: updatedErrs, expReport, isAlwaysOpen, overlap } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState(updatedErrs);

  useEffect(() => {
    setIsOpen(isAlwaysOpen);
  }, []);

  useEffect(() => {
    if (!overlap?.record) {
      setErrors(updatedErrs);
    }
  }, [updatedErrs, overlap?.record]);

  const onClickHeaderIcon = () => {
    if (!isAlwaysOpen) {
      setIsOpen(!isOpen);
    }
  };

  if (isEmpty(errors) || isEmpty(errors.records)) {
    return null;
  }

  // collect item for display list
  const viewItems: ViewItems = [];

  // record
  forEach(errors.records, function (record, idx) {
    const expRecord = expReport.records[idx];
    if (record && expRecord) {
      const recordDate = expRecord.recordDate || msg().Exp_Lbl_InputEmpty;
      const { expTypeName } = get(expRecord, 'items.0') || {};
      forEach(record, function (value, key) {
        if (RECORD_CHECK_LIST.includes(key) && typeof value === 'string') {
          viewItems.push({
            recordDate,
            expTypeName,
            message: value,
            fieldName:
              value === 'Common_Err_Required' ? RECORD_REQUIRED_NAME[key] : '',
          });
        }
      });
      const errorItem = get(record, 'items[0]');
      if (errorItem) {
        Object.entries(errorItem).forEach(([key, value]) => {
          if (RECORD_REQUIRED_FIELDS.includes(key)) {
            viewItems.push({
              recordDate,
              expTypeName,
              message: value,
              fieldName: RECORD_REQUIRED_NAME[key],
            });
          } else if (RECORD_CHECK_LIST.includes(key)) {
            viewItems.push({
              recordDate,
              expTypeName,
              message: value,
            });
          }
          if (key.includes('extendedItem')) {
            viewItems.push({
              recordDate,
              expTypeName,
              message: value,
              fieldName: getEIFieldName(key, expRecord),
            });
          }
        });
      }
    }
  });

  if (!viewItems.length) {
    return null;
  }

  const titleButtonClassName = classNames(`${ROOT}__title-button`, {
    [`${ROOT}__title-button--open`]: isOpen,
    [`${ROOT}__title-button--hide-icon`]: isAlwaysOpen,
  });
  const headerClassName = classNames(`${ROOT}__header`, {
    [`${ROOT}__header--open`]: isOpen,
    [`${ROOT}__header--text`]: isAlwaysOpen,
    [`${ROOT}__header--button`]: !isAlwaysOpen,
  });

  const displayMsg = isAlwaysOpen
    ? msg().Exp_Lbl_MessageAreaWarningTitle
    : msg().Exp_Lbl_MessageAreaTitle;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__main`}>
        <div className={headerClassName}>
          <IconButton
            srcType="svg"
            fillColor="#B7423A"
            src={ImgIconChevronDown}
            className={titleButtonClassName}
            onClick={onClickHeaderIcon}
          >
            <div className={`${ROOT}__header-message`}>{displayMsg}</div>
          </IconButton>
        </div>
        {isOpen && (
          <table className={`${ROOT}__body`}>
            {viewItems.map((item, idx) => (
              <Column key={idx} column={item} idx={idx} />
            ))}
          </table>
        )}
      </div>
    </div>
  );
};

export default MessageArea;
