import React from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import TaxSummary from '@commons/components/exp/Form/TaxSummary';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import CommentArea from '@mobile/components/molecules/commons/CommentArea';
import FileCard from '@mobile/components/molecules/commons/FileCard';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { STATUS_MAP } from '@apps/domain/models/exp/CustomRequest';
import { getLabelValueFromEIs } from '@apps/domain/models/exp/ExtendedItem';
import {
  calculateSubtotalAmount,
  ExpRequest,
} from '@apps/domain/models/exp/request/Report';
import {
  TAX_DETAILS_TYPE,
  TaxDetailType,
} from '@apps/domain/models/exp/TaxType';
import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';

import Amount from '@mobile/components/atoms/Amount';
import IconButton from '@mobile/components/atoms/IconButton';

const ROOT = 'mobile-app-pages-approval-page-expense-report';

export type Props = {
  isExpenseApproval: boolean;
  report: ExpRequest;
  currencySymbol: string;
  expDisplayTaxDetailsSetting: TaxDetailType;
  currencyDecimalPlaces: number;
  onClickVendorDetail: () => void;
  useJctRegistrationNumber?: boolean;
};

const renderSubtotalAmount = (
  baseCurrencySymbol,
  baseCurrencyDecimal,
  records,
  expDisplayTaxDetailsSetting: TaxDetailType,
  className?: string
) => {
  const { foreignCurrency, baseCurrencyAmount } =
    calculateSubtotalAmount(records);
  const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
    const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
    return (
      <>
        <Amount
          className={classNames(`${ROOT}__sub-foreign-amount`, className)}
          key={fc}
          amount={amount}
          symbol={symbol}
          decimalPlaces={decimalPlaces}
        />
      </>
    );
  });

  return (
    <>
      {!isEmpty(foreignCurrencyAmount) &&
        expDisplayTaxDetailsSetting === TAX_DETAILS_TYPE.NotUsed && (
          <>
            {!!baseCurrencyAmount && (
              <Amount
                className={`${ROOT}__sub-base-amount`}
                amount={baseCurrencyAmount}
                symbol={baseCurrencySymbol}
                decimalPlaces={baseCurrencyDecimal}
              />
            )}
            {foreignCurrencyAmount}
          </>
        )}
      {expDisplayTaxDetailsSetting !== TAX_DETAILS_TYPE.NotUsed && (
        <TaxSummary
          records={records}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          foreignCurrencyAmount={foreignCurrencyAmount}
          expDisplayTaxDetailsSetting={expDisplayTaxDetailsSetting}
        />
      )}
    </>
  );
};

const renderFileList = (fileList) => {
  const list = (fileList || []).map((file) => (
    <FileCard key={file.attachedFileVerId} file={file} />
  ));
  return (
    !isEmpty(list) && (
      <ViewItem label={msg().Exp_Lbl_AttachedFile}>{list}</ViewItem>
    )
  );
};

const renderCustomRequest = (report) => {
  const { customRequestId, customRequestName, customRequestStatus, requestId } =
    report || {};

  if (!customRequestId) {
    return <></>;
  }

  const status = customRequestStatus || '';
  const statusClass = classNames(
    `${ROOT}__custom-request-status`,
    status.toLowerCase()
  );
  const statusText = customRequestStatus
    ? msg()[STATUS_MAP[customRequestStatus]]
    : '';
  const statusLabel = statusText && (
    <span className={statusClass}>{statusText}</span>
  );
  const name = (
    <a
      className={`${ROOT}__custom-request-name`}
      href={`/lightning/r/ComGeneralRequest__c/${customRequestId}/view`}
      onClick={() => {
        // used for redirect back to this page after click back btn
        window.sessionStorage.setItem('returnTab', 'approval');
        window.sessionStorage.setItem('returnReportId', requestId);
      }}
    >
      {customRequestName || ''}
    </a>
  );

  return (
    <ViewItem label={msg().Exp_Lbl_CustomRequest}>
      {statusLabel}
      {name}
    </ViewItem>
  );
};

const renderPreRequestSummary = (
  preRequest,
  currencySymbol,
  currencyDecimal
) => {
  return (
    !isEmpty(preRequest) && (
      <>
        <div className={`${ROOT}__title`}>{msg().Exp_Lbl_ExpRequest}</div>
        <ViewItem label={msg().Exp_Lbl_RequestTitle}>
          {preRequest.subject}
        </ViewItem>
        <ViewItem label={msg().Exp_Lbl_RequestNo}>
          {preRequest.requestNo}
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_EstimatedAmount}>
          <Amount
            className={`${ROOT}__amount`}
            amount={preRequest.totalAmount}
            symbol={currencySymbol}
            decimalPlaces={currencyDecimal}
          />
        </ViewItem>
        <ViewItem label={msg().Exp_Lbl_RequestPurpose}>
          {preRequest.purpose}
        </ViewItem>
      </>
    )
  );
};

const ApprovalReport = (props: Props) => {
  const {
    isExpenseApproval,
    report,
    currencySymbol,
    currencyDecimalPlaces,
    onClickVendorDetail,
    useJctRegistrationNumber,
    expDisplayTaxDetailsSetting,
  } = props;

  const extendedItems = getLabelValueFromEIs(report);

  return (
    <section className={`${ROOT}__section`}>
      {renderPreRequestSummary(
        report.expPreRequest,
        currencySymbol,
        currencyDecimalPlaces
      )}
      <div className={`${ROOT}__title`}>
        {isExpenseApproval ? msg().Exp_Lbl_Report : msg().Exp_Lbl_ExpRequest}
      </div>
      <CommentArea src={report.employeePhotoUrl} value={report.comment} />
      <ViewItem label={msg().Appr_Lbl_ApplicantName}>
        {report.employeeName}
      </ViewItem>
      <ViewItem label={msg().Exp_Clbl_ReportTitle}>{report.subject}</ViewItem>
      <ViewItem label={msg().Exp_Clbl_RecordDate}>
        {DateUtil.dateFormat(
          isExpenseApproval ? report.accountingDate : report.scheduledDate
        )}
      </ViewItem>
      <ViewItem label={msg().Appr_Lbl_TotalAmount}>
        <Amount
          amount={report.totalAmount}
          symbol={currencySymbol}
          decimalPlaces={currencyDecimalPlaces}
        />
        {renderSubtotalAmount(
          currencySymbol,
          currencyDecimalPlaces,
          report.records,
          expDisplayTaxDetailsSetting,
          `${
            expDisplayTaxDetailsSetting === TAX_DETAILS_TYPE.NotUsed
              ? `${ROOT}__tax-summary-amount-right`
              : `${ROOT}__tax-summary-amount-left`
          }`
        )}
      </ViewItem>
      <ViewItem label={msg().Exp_Clbl_ReportType}>
        {report.expReportTypeName}
      </ViewItem>
      {renderCustomRequest(report)}
      {report.delegatedEmployeeName && (
        <ViewItem label={msg().Appr_Lbl_DelegatedApplicantName}>
          {report.delegatedEmployeeName}
        </ViewItem>
      )}
      <ViewItem label={msg().Exp_Clbl_Purpose}>{report.purpose}</ViewItem>
      {report.costCenterCode && (
        <ViewItem label={msg().Exp_Clbl_CostCenterHeader}>
          {`${report.costCenterCode} - ${report.costCenterName}`}
        </ViewItem>
      )}
      {report.jobCode && (
        <ViewItem label={msg().Appr_Lbl_Job}>
          {`${report.jobCode} - ${report.jobName}`}
        </ViewItem>
      )}
      {report.vendorId && (
        <ViewItem label={msg().Exp_Clbl_Vendor}>
          <div>
            <span>{`${report.vendorCode} - ${report.vendorName}`}</span>
            <IconButton
              className={`${ROOT}__vendor-detail`}
              icon="chevronright"
              onClick={onClickVendorDetail}
            />
          </div>
          {useJctRegistrationNumber && (
            <div className={`${ROOT}__vendor-jct`}>{`${
              msg().Exp_Clbl_JctRegistrationNumber
            }: ${getJctRegistrationNumber(
              report.vendorJctRegistrationNumber,
              report.vendorIsJctQualifiedIssuer
            )}`}</div>
          )}
        </ViewItem>
      )}
      {report.paymentDueDate && (
        <ViewItem label={msg().Exp_Clbl_PaymentDate}>
          {report.paymentDueDate
            ? report.paymentDueDate.replace(/-/g, '/')
            : ''}
        </ViewItem>
      )}
      {extendedItems.map((item, i) => (
        <ViewItem key={i} label={item.label}>
          {item.value}
        </ViewItem>
      ))}
      <ViewItem label={msg().Exp_Clbl_ReportRemarks}>{report.remarks}</ViewItem>
      {renderFileList(report.attachedFileList)}
    </section>
  );
};

export default ApprovalReport;
