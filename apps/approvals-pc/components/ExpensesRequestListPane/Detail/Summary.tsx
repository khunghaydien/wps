import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import Button from '../../../../commons/components/buttons/Button';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import Tooltip from '../../../../commons/components/Tooltip';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../commons/utils/FormatUtil';
import { Text } from '../../../../core';
import TaxSummary from '@commons/components/exp/Form/TaxSummary';

import { STATUS_MAP } from '../../../../domain/models/exp/CustomRequest';
import {
  getCustomLayoutFromEIs,
  getLabelValueFromEIs,
} from '../../../../domain/models/exp/ExtendedItem';
import {
  calculateSubtotalAmount,
  ExpRequest,
} from '../../../../domain/models/exp/request/Report';
import {
  getJctRegistrationNumber,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
} from '../../../../domain/models/exp/Vendor';
import {
  TAX_DETAILS_TYPE,
  TaxDetailType,
} from '@apps/domain/models/exp/TaxType';

import { SideFile } from '../../../modules/ui/expenses/detail/sideFilePreview';

import AttachmentPreview from '../../DetailParts/AttachmentPreview';

const ROOT = 'approvals-pc-expenses-request-pane-detail';

type Props = {
  isApexView?: boolean;
  expRequest: ExpRequest;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useJctRegistrationNumber: boolean;
  expDisplayTaxDetailsSetting: TaxDetailType;
  openVendorDetail: () => void;
  openCustomRequestPage: (id?: string) => void;
  setSideFile: (sideFile: SideFile) => void;
  hideSideFile: () => void;
};

const Summary = (props: Props) => {
  const {
    expRequest,
    baseCurrencySymbol,
    baseCurrencyDecimal,
    openVendorDetail,
    openCustomRequestPage,
    isApexView,
  } = props;

  const getVendorInfo = (expRequest: ExpRequest) => {
    const {
      vendorCode,
      vendorName,
      paymentDueDate,
      paymentDueDateUsage,
      vendorJctRegistrationNumber,
      vendorIsJctQualifiedIssuer,
    } = expRequest;
    let vendorInfo = [];

    if (!vendorCode) {
      return vendorInfo;
    }

    vendorInfo = [
      {
        label: msg().Exp_Clbl_Vendor,
        value: `${vendorCode} - ${vendorName}`,
        extra: (
          <>
            {props.useJctRegistrationNumber && (
              <>
                <br />
                {`${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  vendorJctRegistrationNumber,
                  vendorIsJctQualifiedIssuer
                )}`}
              </>
            )}
            <br />
            <Button
              className={`${ROOT}__vendor-detail`}
              onClick={openVendorDetail}
            >
              {msg().Exp_Btn_VendorDetail}
            </Button>
          </>
        ),
      },
    ];

    if (paymentDueDateUsage !== VENDOR_PAYMENT_DUE_DATE_USAGE.NotUsed) {
      const paymentDateInfo = {
        label: msg().Exp_Clbl_PaymentDate,
        value: DateUtil.formatYMD(paymentDueDate) || '',
      };
      vendorInfo.push(paymentDateInfo);
    }

    return vendorInfo;
  };

  const renderSubtotalAmount = (expRequest: ExpRequest) => {
    const { foreignCurrency, baseCurrencyAmount } = calculateSubtotalAmount(
      expRequest.records
    );

    const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
      const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
      return (
        <div key={fc}>
          {symbol}&nbsp;{FormatUtil.formatNumber(amount, decimalPlaces)}
        </div>
      );
    });

    return (
      <>
        {!_.isEmpty(foreignCurrencyAmount) &&
          props.expDisplayTaxDetailsSetting === TAX_DETAILS_TYPE.NotUsed && (
            <Tooltip
              align="left"
              content={msg().Exp_Msg_SubtotalAmount}
              position="absolute"
            >
              <div>
                {!!baseCurrencyAmount && (
                  <div
                    className={`${ROOT}__total-base-amount`}
                  >{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                    baseCurrencyAmount,
                    baseCurrencyDecimal
                  )}`}</div>
                )}
                <div className={`${ROOT}__total-foriegn-amount`}>
                  {foreignCurrencyAmount}
                </div>
              </div>
            </Tooltip>
          )}
        {props.expDisplayTaxDetailsSetting !== TAX_DETAILS_TYPE.NotUsed && (
          <TaxSummary
            records={expRequest.records}
            baseCurrencySymbol={baseCurrencySymbol}
            baseCurrencyDecimal={baseCurrencyDecimal}
            foreignCurrencyAmount={foreignCurrencyAmount}
            isPCApproval={true}
            expDisplayTaxDetailsSetting={props.expDisplayTaxDetailsSetting}
          />
        )}
      </>
    );
  };

  const renderCustomRequestField = () => {
    const { customRequestId, customRequestStatus, customRequestName } =
      expRequest;
    const status = customRequestStatus || '';
    const className = `${ROOT}__list-detail-item-custom-request`;
    const statusClass = classNames(`${className}-status`, status.toLowerCase());
    const statusText = status && msg()[STATUS_MAP[status]];

    return [
      {
        label: msg().Exp_Lbl_CustomRequest,
        value: (
          <div>
            <span className={statusClass}>{statusText}</span>
            <span
              className={`${className}-name`}
              onClick={() => {
                openCustomRequestPage(customRequestId);
              }}
            >
              {customRequestName}
            </span>
          </div>
        ),
      },
    ];
  };

  const LABEL_JOB = msg().Exp_Lbl_Job;
  const LABEL_CC = msg().Exp_Clbl_CostCenterHeader;
  const hasValueOrNotJobOrCC = ({ label, value }) =>
    !(label === LABEL_JOB || label === LABEL_CC) || value;

  const reportNumber = `${msg().Exp_Lbl_ReportNo} : ${expRequest.reportNo}`;
  const totalAmount = `${baseCurrencySymbol} ${FormatUtil.formatNumber(
    expRequest.totalAmount,
    baseCurrencyDecimal
  )}`;

  const renderItems = [
    {
      label: msg().Exp_Clbl_RecordDate,
      value: DateUtil.formatYMD(expRequest.accountingDate),
    },
    {
      label: msg().Exp_Clbl_ReportType,
      value: expRequest.expReportTypeName || '',
    },
    ...(expRequest.customRequestId ? renderCustomRequestField() : []),
    {
      label: msg().Exp_Clbl_Purpose,
      value: expRequest.purpose || '',
    },
    {
      label: LABEL_CC,
      value: expRequest.costCenterName
        ? `${expRequest.costCenterCode} - ${expRequest.costCenterName}`
        : '',
    },
    {
      label: LABEL_JOB,
      value: expRequest.jobName
        ? `${expRequest.jobCode} - ${expRequest.jobName}`
        : '',
    },
    ...getVendorInfo(expRequest),
  ];
  const layout = expRequest.fieldCustomLayout;
  const hasCustomLayout = !_.isEmpty(layout);
  const renderFields = (fields) =>
    fields
      .filter(hasValueOrNotJobOrCC)
      .map(({ label, value, extra }: Record<string, any>) => {
        return (
          <li key={label} className={`${ROOT}__list-detail-item`}>
            <HorizontalLayout>
              <HorizontalLayout.Label cols={4}>{label}</HorizontalLayout.Label>
              <HorizontalLayout.Body cols={8}>
                {value}
                {extra || null}
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </li>
        );
      });
  const renderLayout = (layout) =>
    layout.map((row, idx) => {
      return (
        <li key={`row-${idx}`} className={`${ROOT}__list-detail-item`}>
          <HorizontalLayout>
            {row
              .filter(hasValueOrNotJobOrCC)
              .map(({ label, value, extra }: Record<string, any>) => {
                return (
                  <div key={label} className="slds-size--4-of-12">
                    <div className={`${ROOT}__extended-item-label`}>
                      {label}
                    </div>
                    <div className={`${ROOT}__extended-item-body`}>
                      {value}
                      {extra || null}
                    </div>
                  </div>
                );
              })}
          </HorizontalLayout>
        </li>
      );
    });
  return (
    <div className={`${ROOT}__container`}>
      <div className={`${ROOT}__summary-header`}>
        <Text
          size="xl"
          color="primary"
          bold
          className={`${ROOT}__summary-header--summary`}
        >
          {msg().Exp_Lbl_ReportSummary}
        </Text>
        <Text
          size="large"
          color="primary"
          className={`${ROOT}__summary-header--reportnum`}
        >
          {reportNumber}
        </Text>
        <div className={`${ROOT}__summary-header--amount-setion`}>
          <Text
            size="large"
            color="primary"
            className={`${ROOT}__summary-header--title`}
          >
            {expRequest.subject}
          </Text>
          <div className={`${ROOT}__summary-header--amount-setion-detail`}>
            <Text
              size="large"
              color="primary"
              bold
              className={`${ROOT}__summary-header--amount`}
            >
              {totalAmount}
            </Text>
            {renderSubtotalAmount(expRequest)}
          </div>
        </div>
      </div>
      <div>
        <ul className={`${ROOT}__list-detail`}>
          <AttachmentPreview
            attachedFileList={expRequest.attachedFileList}
            setSideFile={props.setSideFile}
            hideSideFile={props.hideSideFile}
            isApexView={isApexView}
          />
          {renderFields(renderItems)}
          {hasCustomLayout
            ? renderLayout(getCustomLayoutFromEIs(layout, expRequest))
            : renderFields(getLabelValueFromEIs(expRequest))}
          {renderFields([
            {
              label: msg().Exp_Clbl_ReportRemarks,
              value: expRequest.remarks || '',
            },
          ])}
        </ul>
      </div>
    </div>
  );
};

export default Summary;
