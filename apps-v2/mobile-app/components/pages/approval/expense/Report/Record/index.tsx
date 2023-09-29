import React from 'react';

import _, { get, isEmpty, isEqual, isNil } from 'lodash';
import { $Values } from 'utility-types';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import msg from '../../../../../../../commons/languages';
import DateUtil from '../../../../../../../commons/utils/DateUtil';
import FilePreview from '../../../../../molecules/commons/FilePreview';
import Navigation from '../../../../../molecules/commons/Navigation';
import ViewItem from '../../../../../molecules/commons/ViewItem';
import Highlight from '@apps/commons/components/exp/Highlight';
import { convertNullOrUndefined } from '@apps/commons/utils/exp/RequestReportDiffUtils';
import { Color } from '@apps/core/styles';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import TextUtil from '@commons/utils/TextUtil';

import { getLabelValueFromEIs } from '../../../../../../../domain/models/exp/ExtendedItem';
import {
  isIcRecord,
  isItemizedRecord,
  isMileageRecord,
  Record as RecordType,
  RECORD_TYPE,
} from '../../../../../../../domain/models/exp/Record';
import {
  ExpRequest,
  ExpRequestRecord,
} from '../../../../../../../domain/models/exp/request/Report';
import {
  isUseJctNo,
  JCT_NUMBER_INVOICE,
  JCT_NUMBER_INVOICE_MSG_KEY,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import { isUseMerchant } from '@apps/domain/models/exp/Merchant';
import {
  MileageDestinationInfo,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';
import {
  AMOUNT_MATCH_STATUS,
  FileMetadata,
  generateOCRAmountMsg,
  getMetadataDisplay,
  getMetadataWarning,
} from '@apps/domain/models/exp/Receipt';
import { getDetailDisplay } from '@apps/domain/models/exp/TransportICCard';
import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';

import Amount from '@apps/mobile-app/components/atoms/Amount';
import MultipleTaxEntriesApprovalForm from '@apps/mobile-app/components/pages/expense/Record/New/General/MultipleTaxEntries/MultipleTaxEntriesApprovalForm';
import IconButton from '@mobile/components/atoms/IconButton';
import Label from '@mobile/components/atoms/Label';
import RecordSummaryListItem from '@mobile/components/molecules/expense/RecordSummaryListItem';
import MileageApproval from '@mobile/components/pages/approval/expense/Report/Record/Mileage';

import Wrapper from '../../../../../atoms/Wrapper';
import General from './General';
import OCRMessage from './OCRMessage';
import Route from './Route';

import './index.scss';

export type Props = {
  report: ExpRequest;
  record: ExpRequestRecord;
  preRecord?: ExpRequestRecord;
  currencySymbol: string;
  mileageUnit: MileageUnit;
  currencyDecimalPlaces: number;
  useImageQualityCheck: boolean;
  selectedMetadatas: Record<string, FileMetadata>;
  expActiveModule: $Values<typeof EXPENSE_APPROVAL_REQUEST>;
  onClickBack: () => void;
  isHighlightDiff?: boolean;
  onClickOpenMap?: (destinations: Array<MileageDestinationInfo>) => void;
  useJctRegistrationNumber: boolean;
  navigateToItemizationPage: (idx: number) => void;
  onClickVendorDetail: () => void;
};

const ROOT = 'mobile-app-pages-approval-page-expense-record';

const Record = (props: Props) => {
  const {
    record,
    preRecord,
    isHighlightDiff,
    currencyDecimalPlaces,
    currencySymbol,
    mileageUnit,
    report,
    useImageQualityCheck,
    selectedMetadatas,
    expActiveModule,
    onClickOpenMap,
    navigateToItemizationPage,
    onClickVendorDetail,
  } = props;

  if (!record) {
    return null;
  }

  let recordBody = null;
  let totalAmount = null;
  let amountStatus = null;
  let amountMessage = null;
  let dateMsg = null;
  if (record.recordType === RECORD_TYPE.TransitJorudanJP) {
    const isDiffRoute =
      isHighlightDiff &&
      !isNil(preRecord) &&
      !isEqual(record.routeInfo, preRecord.routeInfo);

    recordBody = (
      <>
        <Highlight highlight={isDiffRoute}>
          <Route record={record} baseCurrencySymbol={currencySymbol} />
        </Highlight>
        {isDiffRoute && (
          <Highlight
            className={`${ROOT}-route-original`}
            highlightColor={Color.bgDisabled}
          >
            <Route record={preRecord} baseCurrencySymbol={currencySymbol} />
          </Highlight>
        )}
      </>
    );
  } else {
    const isForeignCurrency = _.get(record, 'items.0.useForeignCurrency');
    const decimal = _.get(record, 'items.0.currencyInfo.decimalPlaces') || 0;
    const symbol = _.get(record, 'items.0.currencyInfo.symbol') || '';

    const { amount } = record;

    const { status, message } = generateOCRAmountMsg(
      record.ocrAmount,
      record.amount,
      currencyDecimalPlaces,
      'Exp_Clbl_Amount'
    );
    amountStatus = status;
    amountMessage = message;
    const dateBaseMsg =
      record.ocrDate === record.recordDate
        ? msg().Exp_Msg_MatchedWithReceipt
        : msg().Exp_Msg_ManuallyEntered;
    dateMsg = TextUtil.template(dateBaseMsg, msg().Exp_Clbl_Date);

    totalAmount = (
      <>
        <Amount
          amount={amount}
          decimalPlaces={currencyDecimalPlaces}
          symbol={currencySymbol}
          className="base-amount"
        />

        {isForeignCurrency && (
          <Amount
            amount={record.items[0].localAmount}
            decimalPlaces={decimal}
            symbol={symbol}
            className="local-amount"
          />
        )}
      </>
    );

    const isOCR = !_.isNil(record.ocrDate) && !_.isNil(record.ocrAmount);
    const amountValid = isOCR && amountStatus === AMOUNT_MATCH_STATUS.OK;
    const dateValid = isOCR && record.ocrDate === record.recordDate;
    const isMileage = isMileageRecord(record.recordType);
    const isMultipleTax = record.items[0]?.taxItems?.length > 0;

    recordBody = (
      <>
        {isOCR && amountValid && dateValid && (
          <OCRMessage check message={msg().Exp_Msg_OCRMatch} />
        )}
        {isOCR && !dateValid && (
          <OCRMessage check={dateValid} message={dateMsg} />
        )}
        {isOCR && !amountValid && (
          <OCRMessage check={amountValid} message={amountMessage} />
        )}

        {isMultipleTax ? (
          <div className="approval-multi-tax-form">
            <MultipleTaxEntriesApprovalForm
              record={record}
              preRecord={preRecord}
              baseCurrencyDecimal={currencyDecimalPlaces}
              currencySymbol={currencySymbol}
              isHighlightDifference={isHighlightDiff}
            />
          </div>
        ) : (
          <>
            {isMileage && (
              <MileageApproval
                record={record}
                preRecord={preRecord}
                isHighlightDiff={isHighlightDiff}
                currencySymbol={currencySymbol}
                mileageUnit={mileageUnit}
                onClickOpenMap={onClickOpenMap}
              />
            )}
            <General
              record={record}
              isHighlightDiff={isHighlightDiff}
              preRecord={preRecord}
              currencyDecimalPlaces={currencyDecimalPlaces}
              currencySymbol={currencySymbol}
            />
          </>
        )}
      </>
    );
  }

  const extendedItems = getLabelValueFromEIs(record.items[0], true);

  let preExtendedItems;
  if (isHighlightDiff && preRecord) {
    preExtendedItems = getLabelValueFromEIs(preRecord.items[0], true);
  }

  let { jobCode, jobName, costCenterCode, costCenterName, expPreRequest } =
    report;
  const recordItem = record.items[0];
  if (jobCode && recordItem.jobCode) {
    jobCode = recordItem.jobCode;
    jobName = recordItem.jobName;
  }
  let isJobDiff = false;
  let preJobCode, preJobName;
  if (isHighlightDiff && expPreRequest && preRecord) {
    preJobCode = convertNullOrUndefined(expPreRequest.jobCode);
    preJobName = convertNullOrUndefined(expPreRequest.jobName);
    if (preRecord && preJobCode && preRecord.items) {
      const recordItem = preRecord.items[0];
      if (recordItem && recordItem.jobCode) {
        preJobCode = convertNullOrUndefined(recordItem.jobCode);
        preJobName = convertNullOrUndefined(recordItem.jobName);
      }
    }
    if (preJobCode !== jobCode) isJobDiff = true;
  }
  let jobDiffLabel = '';
  if (isHighlightDiff && !isEmpty(preJobCode)) {
    jobDiffLabel = `${preJobCode} ${preJobName ? ` - ${preJobName}` : ''}`;
  }

  if (costCenterCode && recordItem.costCenterHistoryId) {
    costCenterCode = recordItem.costCenterCode;
    costCenterName = recordItem.costCenterName;
  }
  let isDiffCostCenter = false;
  let preCCCode, preCCName;
  if (isHighlightDiff && expPreRequest && preRecord) {
    preCCCode = convertNullOrUndefined(expPreRequest.costCenterCode);
    preCCName = convertNullOrUndefined(expPreRequest.costCenterName);
    if (preRecord && preCCCode && preRecord.items) {
      const recordItem = preRecord.items[0];
      if (recordItem && recordItem.costCenterCode) {
        preCCCode = convertNullOrUndefined(recordItem.costCenterCode);
        preCCName = convertNullOrUndefined(recordItem.costCenterName);
      }
    }
    if (preCCCode !== costCenterCode) isDiffCostCenter = true;
  }
  let ccDiffLabel = '';
  if (isHighlightDiff && !isEmpty(preCCCode)) {
    ccDiffLabel = `${preCCCode} ${preCCName ? ` - ${preCCName}` : ''}`;
  }

  const renderMerchant = () => {
    if (!isUseMerchant(props.record.merchantUsage)) {
      return null;
    }
    const highlight = isHighlightDiff && isHighlight('items.0.merchant');
    const final = _.get(record, 'items.0.merchant', '');
    const original = convertNullOrUndefined(
      _.get(preRecord, 'items.0.merchant')
    );
    return (
      <div className={`${ROOT}__merchant-info`}>
        <ViewItem label={msg().Exp_Clbl_Merchant} className="block">
          <Highlight highlight={highlight}>{final}</Highlight>
          {highlight && (
            <Highlight highlightColor={Color.bgDisabled}>
              {`(${original})`}
            </Highlight>
          )}
        </ViewItem>
      </div>
    );
  };

  const renderJctRegistrationNumber = () => {
    const { record, preRecord, useJctRegistrationNumber, isHighlightDiff } =
      props;
    const preJctRegistrationNumber = _.get(
      preRecord,
      'items[0].jctRegistrationNumber',
      ''
    );
    const preVendorId = _.get(preRecord, 'items[0].vendorId', '');
    const preVendorIsJctQualifiedIssuer = _.get(
      preRecord,
      'items[0].vendorIsJctQualifiedIssuer',
      false
    );
    const jctRegistrationNumberUsage = _.get(
      record,
      'jctRegistrationNumberUsage',
      JCT_REGISTRATION_NUMBER_USAGE.NotUsed
    );
    const jctRegistrationNumber = _.get(
      record,
      'items[0].jctRegistrationNumber',
      ''
    );
    const vendorId = _.get(record, 'items[0].vendorId', '');
    const vendorIsJctQualifiedIssuer = _.get(
      record,
      'items[0].vendorIsJctQualifiedIssuer',
      false
    );
    if (!useJctRegistrationNumber || !isUseJctNo(jctRegistrationNumberUsage)) {
      return null;
    }

    const preJctInvoiceOption = _.get(preRecord, 'items[0].jctInvoiceOption');
    const jctInvoiceOption = _.get(record, 'items[0].jctInvoiceOption');
    let value = msg()[JCT_NUMBER_INVOICE_MSG_KEY[jctInvoiceOption]];
    let preValue = msg()[JCT_NUMBER_INVOICE_MSG_KEY[preJctInvoiceOption]];
    let isHighlight = false;

    const hasJctRegistrationNumber =
      (jctRegistrationNumber ||
        (vendorId && vendorIsJctQualifiedIssuer && !jctRegistrationNumber)) &&
      jctInvoiceOption === JCT_NUMBER_INVOICE.Invoice;
    const hasPreJctRegistrationNumber =
      preJctInvoiceOption === JCT_NUMBER_INVOICE.Invoice &&
      ((preVendorId &&
        preVendorIsJctQualifiedIssuer &&
        !preJctRegistrationNumber) ||
        preJctRegistrationNumber);
    if (hasJctRegistrationNumber) {
      value = getJctRegistrationNumber(
        jctRegistrationNumber,
        vendorIsJctQualifiedIssuer
      );
    }
    if (hasPreJctRegistrationNumber) {
      preValue = getJctRegistrationNumber(
        preJctRegistrationNumber,
        preVendorIsJctQualifiedIssuer
      );
    }
    if (isHighlightDiff && !isEmpty(preRecord)) {
      if (preValue !== value) {
        isHighlight = true;
      }
    }

    return (
      <div className={`${ROOT}__jct-number-info`}>
        <ViewItem label={msg().Exp_Clbl_Invoice} className="block">
          <Highlight highlight={isHighlight}>
            <div className={`${ROOT}__jct-number-label`}>
              {hasJctRegistrationNumber &&
                `${msg().Exp_Clbl_JctRegistrationNumber}: `}
              {value}
            </div>
          </Highlight>
          {isHighlight && (
            <Highlight highlightColor={Color.bgDisabled}>
              {`(${
                hasPreJctRegistrationNumber && preValue
                  ? `${msg().Exp_Clbl_JctRegistrationNumber}: `
                  : ''
              }${preValue || ''})`}
            </Highlight>
          )}
        </ViewItem>
      </div>
    );
  };

  const renderVendor = () => {
    let vendorCode,
      vendorName,
      vendorJctRegistrationNumber,
      vendorIsJctQualifiedIssuer;
    if (recordItem.vendorId) {
      vendorCode = recordItem.vendorCode;
      vendorName = recordItem.vendorName;
      vendorJctRegistrationNumber = recordItem.vendorJctRegistrationNumber;
      vendorIsJctQualifiedIssuer = recordItem.vendorIsJctQualifiedIssuer;
    }
    let isVendorDiff = false;
    let preVendorCode,
      preVendorName,
      preVendorJctRegistrationNumber,
      preVendorIsJctQualifiedIssuer;
    if (isHighlightDiff && preRecord) {
      const preRecordItem = preRecord.items[0];
      if (preRecordItem.vendorId) {
        preVendorCode = convertNullOrUndefined(preRecordItem.vendorCode);
        preVendorName = convertNullOrUndefined(preRecordItem.vendorName);
        preVendorJctRegistrationNumber = convertNullOrUndefined(
          preRecordItem.vendorJctRegistrationNumber
        );
        preVendorIsJctQualifiedIssuer =
          preRecordItem.vendorIsJctQualifiedIssuer;
      }
      if (preVendorCode !== vendorCode) isVendorDiff = true;
    }
    let vendorDiffLabel = '';
    if (isHighlightDiff && !isEmpty(preVendorCode)) {
      vendorDiffLabel = `${preVendorCode} ${
        preVendorName ? ` - ${preVendorName}` : ''
      }`;
      if (props.useJctRegistrationNumber) {
        vendorDiffLabel += `${preVendorName ? '\n' : ''}${
          msg().Exp_Clbl_JctRegistrationNumber
        }: ${getJctRegistrationNumber(
          preVendorJctRegistrationNumber,
          preVendorIsJctQualifiedIssuer
        )}`;
      }
    }

    if (!vendorCode && !isVendorDiff) return null;

    return (
      <div className={`${ROOT}__vendor`}>
        <ViewItem label={msg().Exp_Lbl_Vendor} className="block">
          <Highlight highlight={isVendorDiff}>
            <>
              <div className={`${ROOT}__vendor-info`}>
                <span>{vendorCode ? `${vendorCode} - ${vendorName}` : ''}</span>
                {vendorCode && (
                  <IconButton
                    className={`${ROOT}__vendor-detail`}
                    icon="chevronright"
                    onClick={onClickVendorDetail}
                  />
                )}
              </div>
              {recordItem.vendorId && props.useJctRegistrationNumber && (
                <div className={`${ROOT}--jct-number`}>
                  {`${
                    msg().Exp_Clbl_JctRegistrationNumber
                  }: ${getJctRegistrationNumber(
                    vendorJctRegistrationNumber,
                    vendorIsJctQualifiedIssuer
                  )}`}
                </div>
              )}
            </>
          </Highlight>
          {isVendorDiff && (
            <Highlight
              className={`${ROOT}-highlight ${ROOT}-highlight-italic`}
              highlightColor={Color.bgDisabled}
            >
              {`(${vendorDiffLabel})`}
            </Highlight>
          )}
        </ViewItem>
      </div>
    );
  };

  const renderPaymentDueDate = () => {
    const paymentDueDate = _.get(record, 'items.0.paymentDueDate', '');
    const highlight = isHighlightDiff && isHighlight('items.0.paymentDueDate');
    const prePaymentDueDate = convertNullOrUndefined(
      _.get(preRecord, 'items.0.paymentDueDate')
    );
    if (!paymentDueDate && !highlight) return null;

    return (
      <div className={`${ROOT}__payment-due-date-info`}>
        <ViewItem label={msg().Exp_Lbl_PaymentDate} className="block">
          <Highlight highlight={highlight}>
            {DateUtil.formatYMD(paymentDueDate)}
          </Highlight>
          {highlight && (
            <Highlight highlightColor={Color.bgDisabled}>
              {`(${DateUtil.formatYMD(prePaymentDueDate)})`}
            </Highlight>
          )}
        </ViewItem>
      </div>
    );
  };

  const isHighlight = (key: string) => {
    if (!isHighlightDiff) return false;
    const value = _.get(record, key);
    const preValue = _.get(preRecord, key);
    return !_.isEqual(value, preValue);
  };

  const isHighlightSummary = isHighlightDiff && isHighlight('items.0.remarks');

  const isHighlightPaymentMethodName =
    isHighlightDiff && isHighlight('paymentMethodName');

  const renderMetadata = (receipt) => {
    const { receiptId } = receipt;
    const selectedMetadata = selectedMetadatas[receiptId];
    const metadata = useImageQualityCheck && (
      <div className={`${ROOT}__metadata`}>
        {getMetadataDisplay(selectedMetadata)}
      </div>
    );
    const isRequestApproval =
      expActiveModule === EXPENSE_APPROVAL_REQUEST.request;
    const metadataWarningText = TextUtil.nl2br(
      getMetadataWarning(selectedMetadata, isRequestApproval)
    );
    const metadataWarning = useImageQualityCheck && metadataWarningText && (
      <div className={`${ROOT}__metadata-warning`}>
        <ImgIconAttention className={`${ROOT}__metadata-warning-svg`} />
        <span className={`${ROOT}__metadata-warning-msg`}>
          {metadataWarningText}
        </span>
      </div>
    );
    return (
      <>
        {metadata} {metadataWarning}
      </>
    );
  };

  let finalReceiptList = [];

  const {
    receiptId,
    receiptList,
    receiptCreatedDate,
    receiptDataType,
    receiptFileId,
    receiptTitle,
  } = record;
  if (receiptId) {
    finalReceiptList.push({
      receiptCreatedDate,
      receiptDataType,
      receiptFileId,
      receiptId,
      receiptTitle,
    });
  } else finalReceiptList = receiptList || [];

  const [_parentItem, ...childItemList] = record.items;
  const isRecordItemized = isItemizedRecord(record.items.length);

  const isHighlightNewItem = (itemIdx: number) =>
    isHighlightDiff && !get(preRecord, `items.${itemIdx}`);
  const isShowJob = jobCode || isJobDiff;
  const isShowCC = costCenterCode || isDiffCostCenter;
  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_RecordDetails}
        onClickBack={props.onClickBack}
      />
      <div className="main-content">
        <div className={`${ROOT}__header`}>
          <div className={`${ROOT}__date`}>
            <Highlight
              className={`${ROOT}-highlight`}
              highlight={isHighlight('recordDate')}
            >
              {DateUtil.dateFormat(record.recordDate)}
            </Highlight>
          </div>

          <div className={`${ROOT}__exp-type`}>
            {record.items[0].expTypeName}
            {record.recordType === RECORD_TYPE.FixedAllowanceMulti &&
              ` : ${record.items[0].fixedAllowanceOptionLabel || ''}`}
          </div>

          <Highlight
            className={`${ROOT}-highlight`}
            highlight={isHighlight('amount')}
          >
            {totalAmount}
          </Highlight>
        </div>

        <div className={`${ROOT}__content`}>
          <div className={`${ROOT}__content-parent`}>
            <ViewItem label={msg().Exp_Clbl_PaymentMethod} className="block">
              <Highlight highlight={isHighlightPaymentMethodName}>
                {record.paymentMethodName}
              </Highlight>
              {isHighlightPaymentMethodName && !isNil(preRecord) && (
                <Highlight highlightColor={Color.bgDisabled}>
                  {`(${preRecord.paymentMethodName || ''})`}
                </Highlight>
              )}
            </ViewItem>
            {recordBody}

            {isShowCC && (
              <ViewItem label={msg().Exp_Clbl_CostCenter} className="block">
                {costCenterCode && (
                  <Highlight highlight={isDiffCostCenter}>
                    {`${costCenterCode} - ${costCenterName}`}
                  </Highlight>
                )}
                {isDiffCostCenter && (
                  <Highlight
                    className={`${ROOT}-highlight ${ROOT}-highlight-italic`}
                    highlightColor={Color.bgDisabled}
                  >
                    {`(${ccDiffLabel})`}
                  </Highlight>
                )}
              </ViewItem>
            )}

            {isShowJob && (
              <ViewItem label={msg().Exp_Lbl_Job} className="block">
                {jobCode && (
                  <Highlight highlight={isJobDiff}>
                    {`${jobCode} - ${jobName}`}
                  </Highlight>
                )}
                {isJobDiff && (
                  <Highlight
                    className={`${ROOT}-highlight ${ROOT}-highlight-italic`}
                    highlightColor={Color.bgDisabled}
                  >
                    {`(${jobDiffLabel})`}
                  </Highlight>
                )}
              </ViewItem>
            )}

            {isIcRecord(record.recordType) && (
              <ViewItem label={msg().Exp_Lbl_Detail} className="block">
                {getDetailDisplay(record.transitIcRecordInfo)}
              </ViewItem>
            )}
            {renderMerchant()}
            {renderVendor()}
            {renderPaymentDueDate()}
            {renderJctRegistrationNumber()}
            {extendedItems.map((item, i) => {
              const preItem =
                preExtendedItems &&
                preExtendedItems.find((p) => p.id === item.id);
              let highlight = false;
              const isNewRecord = isHighlightDiff && isEmpty(preRecord);
              const original = _.get(item, 'value', '');
              const diff = _.get(preItem, 'value', '');
              if (isHighlightDiff && !isNewRecord) {
                if (!isEqual(original, diff)) highlight = true;
              }

              return (
                <ViewItem key={i} label={item.label} className="block">
                  <Highlight highlight={highlight}>{original}</Highlight>
                  {highlight && (
                    <Highlight highlightColor={Color.bgDisabled}>
                      {`(${diff})`}
                    </Highlight>
                  )}
                </ViewItem>
              );
            })}

            {record.items[0].remarks && (
              <ViewItem label={msg().Exp_Clbl_Summary} className="block">
                <Highlight highlight={isHighlightSummary}>
                  {record.items[0].remarks}
                </Highlight>
                {isHighlightSummary && !isNil(preRecord) && (
                  <Highlight highlightColor={Color.bgDisabled}>
                    {`(${convertNullOrUndefined(
                      _.get(preRecord, 'items.0.remarks')
                    )})`}
                  </Highlight>
                )}
              </ViewItem>
            )}
          </div>

          {finalReceiptList.map((receipt, index) => {
            return (
              <>
                <FilePreview
                  className={`${ROOT}__receipt block ${
                    index !== 0 ? `${ROOT}__receipt-with-padding` : ''
                  }`}
                  title={receipt.receiptTitle}
                  id={receipt.receiptId}
                  fileId={receipt.receiptFileId}
                  dataType={receipt.receiptDataType}
                  label={msg().Exp_Lbl_Receipts}
                  uploadedDate={receipt.receiptCreatedDate}
                  openExternal
                  noSection={index !== 0}
                />
                {renderMetadata(receipt)}
              </>
            );
          })}

          {isRecordItemized && (
            <div className={`${ROOT}__itemization`}>
              <Label
                className={`${ROOT}__itemization-label`}
                text={msg().Exp_Lbl_Itemization}
              />
              {childItemList.map((item, idx) => (
                <Highlight
                  className={`${ROOT}__itemization-highlight-new`}
                  highlight={isHighlightNewItem(idx + 1)}
                  key={record.recordId}
                >
                  <RecordSummaryListItem
                    key={item.itemId}
                    currencyDecimalPlaces={currencyDecimalPlaces}
                    currencySymbol={currencySymbol}
                    isHighlightDiff={
                      isHighlightDiff &&
                      !isEmpty(get(preRecord, `items.${idx + 1}`))
                    }
                    itemIdx={idx + 1}
                    record={record as RecordType}
                    preExpRecord={preRecord}
                    onClick={() => navigateToItemizationPage(idx + 1)}
                  />
                </Highlight>
              ))}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Record;
