/* eslint-disable react/display-name */
import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import { Color } from '@apps/core/styles';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import CommentArea from '@mobile/components/molecules/commons/CommentArea';
import FileCard from '@mobile/components/molecules/commons/FileCard';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { STATUS_MAP } from '@apps/domain/models/exp/CustomRequest';
import { getLabelValueFromEIs } from '@apps/domain/models/exp/ExtendedItem';
import { generateSettlementAmount } from '@apps/domain/models/exp/Report';
import {
  calculateSubtotalAmount,
  ExpRequest,
} from '@apps/domain/models/exp/request/Report';
import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';

import Amount from '@mobile/components/atoms/Amount';
import IconButton from '@mobile/components/atoms/IconButton';

const ROOT = 'mobile-app-pages-approval-page-expense-report';

const requestToReportMapping = {
  totalAmount: 'totalAmount',
  purpose: 'purpose',
  costCenterName: 'costCenterName',
  remarks: 'remarks',
  costCenterCode: 'costCenterCode',
  jobCode: 'jobCode',
  jobName: 'jobName',
  vendorId: 'vendorId',
  vendorName: 'vendorName',
  vendorJctRegistrationNumber: 'vendorJctRegistrationNumber',
  paymentDueDate: 'paymentDueDate',
  subject: 'subject',
};

export type Props = {
  isExpenseApproval: boolean;
  report: ExpRequest;
  currencySymbol: string;
  currencyDecimalPlaces: number;
  onClickVendorDetail: () => void;
  isHighlightDiff?: boolean;
  useJctRegistrationNumber?: boolean;
  alwaysDisplaySettlementAmount?: boolean;
};

const renderSubtotalAmount = (
  baseCurrencySymbol,
  baseCurrencyDecimal,
  records
) => {
  const { foreignCurrency, baseCurrencyAmount } =
    calculateSubtotalAmount(records);
  const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
    const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
    return (
      <>
        <Amount
          className={`${ROOT}__sub-foreign-amount`}
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
      {!isEmpty(foreignCurrencyAmount) && (
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

const renderCashAdvanceArea = (
  decimalPlaces: number,
  baseCurrencySymbol: string,
  isExpenseApproval: boolean,
  report: ExpRequest
) => {
  const { useCashAdvance } = report;
  const isExpenseUseCashAdvance = isExpenseApproval && useCashAdvance;
  const isRequestUseCashAdvance = !isExpenseApproval && useCashAdvance;

  if (!isExpenseUseCashAdvance && !isRequestUseCashAdvance) return null;
  if (isExpenseUseCashAdvance) {
    return (
      <>
        <ViewItem align="right" label={msg().Exp_Clbl_CashAdvanceAmount}>
          {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            report.expPreRequest.cashAdvanceAmount,
            decimalPlaces
          )}`}
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_CashAdvanceDate}>
          {DateUtil.dateFormat(report.expPreRequest.cashAdvanceDate)}
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_CashAdvanceRequestPurpose}>
          {report.expPreRequest.cashAdvanceRequestPurpose}
        </ViewItem>
      </>
    );
  }
  return (
    <>
      <ViewItem align="right" label={msg().Exp_Clbl_CashAdvanceRequestAmount}>
        {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
          report.cashAdvanceRequestAmount,
          decimalPlaces
        )}`}
      </ViewItem>
      <ViewItem label={msg().Exp_Clbl_CashAdvanceRequestDate}>
        {DateUtil.dateFormat(report.cashAdvanceRequestDate)}
      </ViewItem>
      <ViewItem label={msg().Exp_Clbl_CashAdvanceRequestPurpose}>
        {report.cashAdvanceRequestPurpose}
      </ViewItem>
    </>
  );
};

const renderSettlementFields = (
  decimalPlaces: number,
  baseCurrencySymbol: string,
  isExpenseApproval: boolean,
  alwaysDisplaySettlementAmount: boolean,
  isHighlightDiff: boolean,
  report: ExpRequest
) => {
  const { settlementAmount, settlementResult, useCashAdvance } = report;

  const isShowSettlementAmount =
    isExpenseApproval && (useCashAdvance || alwaysDisplaySettlementAmount);
  if (!isShowSettlementAmount) {
    return null;
  }

  const settlementAmountValue = generateSettlementAmount(
    decimalPlaces,
    baseCurrencySymbol,
    settlementAmount,
    settlementResult
  );

  return (
    <ViewItem label={msg().Exp_Clbl_SettlementAmount}>
      <Highlight highlight={isHighlightDiff}>{settlementAmountValue}</Highlight>
    </ViewItem>
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
        <ViewItem label={msg().Exp_Lbl_RequestNo}>
          {preRequest.requestNo}
        </ViewItem>
        <ViewItem label={msg().Exp_Lbl_RequestTitle}>
          {preRequest.subject}
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_EstimatedAmount}>
          <Amount
            amount={preRequest.totalAmount}
            symbol={currencySymbol}
            decimalPlaces={currencyDecimal}
          />
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_ScheduledDate}>
          {DateUtil.dateFormat(preRequest.scheduledDate)}
        </ViewItem>
        <ViewItem label={msg().Exp_Lbl_RequestPurpose}>
          {preRequest.purpose}
        </ViewItem>
      </>
    )
  );
};

export default (props: Props) => {
  const {
    isExpenseApproval,
    report,
    currencySymbol,
    currencyDecimalPlaces,
    onClickVendorDetail,
    isHighlightDiff,
    useJctRegistrationNumber,
    alwaysDisplaySettlementAmount,
  } = props;

  let diffValues;
  if (isHighlightDiff && report.expPreRequest)
    diffValues = convertDifferenceValues(
      requestToReportMapping,
      report,
      report.expPreRequest
    );

  const extendedItems = getLabelValueFromEIs(report);
  const expPreExtendedItems =
    isHighlightDiff &&
    report.expPreRequest &&
    getLabelValueFromEIs(report.expPreRequest);

  const renderOriginal = (value: any) => (
    <Highlight
      className={classNames(
        `${ROOT}-view-item-container`,
        `${ROOT}-diff-item-container`
      )}
      highlightColor={Color.bgDisabled}
    >
      {`(${value})`}
    </Highlight>
  );

  let jobDiffLabel = '';
  const preJobCode = get(diffValues, `jobCode.original`);
  if (preJobCode) {
    const preJobName =
      get(diffValues, `jobName.original`) || report.expPreRequest?.jobName;
    jobDiffLabel = `${preJobCode} - ${preJobName}`;
  }
  let costCenterDiffLabel = '';
  const preCostCenterCode = get(diffValues, `costCenterCode.original`);
  if (preCostCenterCode) {
    const preCostCenterName =
      get(diffValues, `costCenterName.original`) ||
      report.expPreRequest?.costCenterName;
    costCenterDiffLabel = `${preCostCenterCode} - ${preCostCenterName}`;
  }
  const isShowCostCenter =
    report.costCenterCode || isDifferent('costCenterCode', diffValues);
  const isShowJob = report.jobCode || isDifferent('jobCode', diffValues);
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
      <ViewItem label={msg().Exp_Clbl_ReportTitle}>
        <Highlight
          className={`${ROOT}-view-item-container`}
          highlight={isDifferent('subject', diffValues)}
        >
          {report.subject}
        </Highlight>
        {isDifferent('subject', diffValues) &&
          renderOriginal(diffValues.subject.original)}
      </ViewItem>
      <ViewItem
        className={`${ROOT}-item-container`}
        label={
          isExpenseApproval
            ? msg().Exp_Clbl_RecordDate
            : msg().Exp_Clbl_ScheduledDate
        }
      >
        {DateUtil.dateFormat(
          isExpenseApproval ? report.accountingDate : report.scheduledDate
        )}
      </ViewItem>
      <ViewItem
        className={`${ROOT}-item-container`}
        label={
          isExpenseApproval
            ? msg().Appr_Lbl_TotalAmount
            : msg().Exp_Clbl_EstimatedAmount
        }
      >
        <Highlight highlight={isDifferent('totalAmount', diffValues)}>
          <Amount
            amount={report.totalAmount}
            symbol={currencySymbol}
            decimalPlaces={currencyDecimalPlaces}
          />
        </Highlight>
        {isDifferent('totalAmount', diffValues) && (
          <Highlight
            className={`${ROOT}-diff-item-container ${ROOT}-diff-item-container-end`}
            highlightColor={Color.bgDisabled}
          >
            <Amount
              amount={diffValues.totalAmount.original}
              symbol={currencySymbol}
              decimalPlaces={currencyDecimalPlaces}
            />
          </Highlight>
        )}
        {renderSubtotalAmount(
          currencySymbol,
          currencyDecimalPlaces,
          report.records
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
      <ViewItem
        className={`${ROOT}-item-container`}
        label={msg().Exp_Clbl_Purpose}
      >
        <Highlight
          className={`${ROOT}-view-item-container`}
          highlight={isDifferent('purpose', diffValues)}
        >
          {report.purpose}
        </Highlight>
        {isDifferent('purpose', diffValues) &&
          renderOriginal(diffValues.purpose.original)}
      </ViewItem>
      {isShowCostCenter && (
        <ViewItem label={msg().Exp_Clbl_CostCenterHeader}>
          {report.costCenterCode && (
            <Highlight
              className={`${ROOT}-view-item-container`}
              highlight={isDifferent('costCenterCode', diffValues)}
            >
              {`${report.costCenterCode} - ${report.costCenterName}`}
            </Highlight>
          )}
          {isDifferent('costCenterCode', diffValues) &&
            renderOriginal(costCenterDiffLabel)}
        </ViewItem>
      )}
      {isShowJob && (
        <ViewItem label={msg().Appr_Lbl_Job}>
          {report.jobCode && (
            <Highlight
              className={`${ROOT}-view-item-container`}
              highlight={isDifferent('jobCode', diffValues)}
            >
              {`${report.jobCode} - ${report.jobName}`}
            </Highlight>
          )}
          {isDifferent('jobCode', diffValues) && renderOriginal(jobDiffLabel)}
        </ViewItem>
      )}
      {(report.vendorId || isDifferent('vendorName', diffValues)) && (
        <ViewItem label={msg().Exp_Clbl_Vendor}>
          <div>
            {report.vendorId && (
              <Highlight
                className={`${ROOT}-view-item-container`}
                highlight={isDifferent('vendorId', diffValues)}
              >
                <div className={`${ROOT}__vendor`}>
                  <div>
                    <span>{`${report.vendorCode} - ${report.vendorName}`}</span>
                    {useJctRegistrationNumber && (
                      <div className={`${ROOT}__vendor-jct`}>{`${
                        msg().Exp_Clbl_JctRegistrationNumber
                      }: ${getJctRegistrationNumber(
                        report.vendorJctRegistrationNumber,
                        report.vendorIsJctQualifiedIssuer
                      )}`}</div>
                    )}
                  </div>
                  <IconButton
                    className={`${ROOT}__vendor-detail`}
                    icon="chevronright"
                    onClick={onClickVendorDetail}
                  />
                </div>
              </Highlight>
            )}

            {isDifferent('vendorName', diffValues) &&
              renderOriginal(
                `${diffValues.vendorName.original}${
                  useJctRegistrationNumber
                    ? `${diffValues.vendorName.original ? '\n' : ''}${
                        msg().Exp_Clbl_JctRegistrationNumber
                      }: ${getJctRegistrationNumber(
                        get(
                          diffValues,
                          `${requestToReportMapping.vendorJctRegistrationNumber}.original`
                        ),
                        get(
                          report,
                          'expPreRequest.vendorIsJctQualifiedIssuer',
                          false
                        )
                      )}`
                    : ''
                }`
              )}
          </div>
        </ViewItem>
      )}
      {(report.paymentDueDate || isDifferent('paymentDueDate', diffValues)) && (
        <ViewItem label={msg().Exp_Clbl_PaymentDate}>
          <Highlight
            className={`${ROOT}-view-item-container`}
            highlight={isDifferent('paymentDueDate', diffValues)}
          >
            {DateUtil.formatYMD(report.paymentDueDate)}
          </Highlight>
          {isDifferent('paymentDueDate', diffValues) &&
            renderOriginal(
              (diffValues.paymentDueDate.original || '').replace(/-/g, '/')
            )}
        </ViewItem>
      )}
      {extendedItems.map((item, i) => {
        let highlight = false;
        const preItem =
          expPreExtendedItems &&
          expPreExtendedItems.find((p) => p.id === item.id);
        let final: any = get(item, 'value', '');
        const original = get(preItem, 'value', '');
        if (isHighlightDiff) {
          if (!isEqual(final, original)) {
            highlight = true;
            if (final.trim().length === 0) final = <>&nbsp;</>;
          }
        }
        return (
          <ViewItem
            className={`${ROOT}-item-container`}
            key={i}
            label={item.label}
          >
            <Highlight
              className={`${ROOT}-view-item-container`}
              highlight={highlight}
            >
              {final}
            </Highlight>
            {highlight && renderOriginal(original)}
          </ViewItem>
        );
      })}
      <ViewItem
        className={`${ROOT}-item-container`}
        label={msg().Exp_Clbl_ReportRemarks}
      >
        <Highlight
          className={`${ROOT}-view-item-container`}
          highlight={isDifferent('remarks', diffValues)}
        >
          {report.remarks}
        </Highlight>
        {isDifferent('remarks', diffValues) &&
          renderOriginal(diffValues.remarks.original)}
      </ViewItem>
      {renderCashAdvanceArea(
        currencyDecimalPlaces,
        currencySymbol,
        isExpenseApproval,
        report
      )}
      {renderSettlementFields(
        currencyDecimalPlaces,
        currencySymbol,
        isExpenseApproval,
        alwaysDisplaySettlementAmount,
        isHighlightDiff,
        report
      )}
      {renderFileList(report.attachedFileList)}
    </section>
  );
};
