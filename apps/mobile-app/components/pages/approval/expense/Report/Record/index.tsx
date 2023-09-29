import React from 'react';

import _ from 'lodash';
import { $Values } from 'utility-types';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import msg from '../../../../../../../commons/languages';
import DateUtil from '../../../../../../../commons/utils/DateUtil';
import FilePreview from '../../../../../molecules/commons/FilePreview';
import Navigation from '../../../../../molecules/commons/Navigation';
import ViewItem from '../../../../../molecules/commons/ViewItem';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import TextUtil from '@commons/utils/TextUtil';

import { getLabelValueFromEIs } from '../../../../../../../domain/models/exp/ExtendedItem';
import {
  isIcRecord,
  isRecordItemized,
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
  AMOUNT_MATCH_STATUS,
  FileMetadata,
  generateOCRAmountMsg,
  getMetadataDisplay,
  getMetadataWarning,
} from '@apps/domain/models/exp/Receipt';
import { getDetailDisplay } from '@apps/domain/models/exp/TransportICCard';

import Amount from '../../../../../atoms/Amount';
import Wrapper from '../../../../../atoms/Wrapper';
import ChildItems from '../../../../../molecules/expense/ChildItems';
import General from './General';
import OCRMessage from './OCRMessage';
import Route from './Route';

import './index.scss';

export type Props = {
  report: ExpRequest;
  record: ExpRequestRecord;
  currencySymbol: string;
  currencyDecimalPlaces: number;
  useImageQualityCheck: boolean;
  selectedMetadata: FileMetadata;
  expActiveModule: $Values<typeof EXPENSE_APPROVAL_REQUEST>;
  useJctRegistrationNumber: boolean;
  onClickBack: () => void;
};

const ROOT = 'mobile-app-pages-approval-page-expense-record';

const Record = (props: Props) => {
  const {
    record,
    currencyDecimalPlaces,
    currencySymbol,
    report,
    useImageQualityCheck,
    selectedMetadata,
    expActiveModule,
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
    recordBody = <Route record={record} baseCurrencySymbol={currencySymbol} />;
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
        <General
          record={record}
          currencyDecimalPlaces={currencyDecimalPlaces}
          currencySymbol={currencySymbol}
        />
      </>
    );
  }

  const extendedItems = isRecordItemized(record.recordType)
    ? []
    : getLabelValueFromEIs(record.items[0]);

  let { jobCode, jobName, costCenterCode, costCenterName } = report;
  const recordItem = record.items[0];
  if (jobCode && recordItem.jobId) {
    jobCode = recordItem.jobCode;
    jobName = recordItem.jobName;
  }

  if (costCenterCode && recordItem.costCenterHistoryId) {
    costCenterCode = recordItem.costCenterCode;
    costCenterName = recordItem.costCenterName;
  }

  const renderMerchant = () => {
    if (!isUseMerchant(props.record.merchantUsage)) {
      return null;
    }
    return (
      <div className={`${ROOT}__merchant-info`}>
        <ViewItem label={msg().Exp_Clbl_Merchant} className="block">
          {props.record.items[0].merchant || ''}
        </ViewItem>
      </div>
    );
  };

  const renderJctRegistrationNumber = () => {
    const { record, useJctRegistrationNumber } = props;
    const jctRegistrationNumber = _.get(
      record,
      'items[0].jctRegistrationNumber',
      ''
    );
    const jctRegistrationNumberUsage = _.get(
      record,
      'jctRegistrationNumberUsage',
      JCT_REGISTRATION_NUMBER_USAGE.NotUsed
    );
    const jctInvoiceOption = _.get(record, 'items[0].jctInvoiceOption');
    if (!isUseJctNo(jctRegistrationNumberUsage) || !useJctRegistrationNumber) {
      return null;
    }

    let value = msg()[JCT_NUMBER_INVOICE_MSG_KEY[jctInvoiceOption]];
    if (
      jctRegistrationNumber &&
      jctInvoiceOption === JCT_NUMBER_INVOICE.Invoice
    ) {
      value = `${
        msg().Exp_Clbl_JctRegistrationNumber
      }: ${jctRegistrationNumber} `;
    }
    return (
      <div className={`${ROOT}__jct-number-info`}>
        <ViewItem label={msg().Exp_Clbl_JCTInvoice} className="block">
          {value}
        </ViewItem>
      </div>
    );
  };

  const renderMetadata = () => {
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

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_RecordDetails}
        onClickBack={props.onClickBack}
      />
      <div className="main-content">
        <div className={`${ROOT}__header`}>
          <div className={`${ROOT}__date`}>
            {DateUtil.formatYMD(record.recordDate)}
          </div>

          <div className={`${ROOT}__exp-type`}>
            {record.items[0].expTypeName}
            {record.recordType === RECORD_TYPE.FixedAllowanceMulti &&
              ` : ${record.items[0].fixedAllowanceOptionLabel || ''}`}
          </div>

          {totalAmount}
        </div>

        <div className={`${ROOT}__content`}>
          <div className={`${ROOT}__content-parent`}>
            {recordBody}

            {costCenterCode && (
              <ViewItem label={msg().Exp_Clbl_CostCenter} className="block">
                {`${costCenterCode} - ${costCenterName}`}
              </ViewItem>
            )}

            {jobCode && (
              <ViewItem label={msg().Exp_Lbl_Job} className="block">
                {`${jobCode} - ${jobName}`}
              </ViewItem>
            )}

            {extendedItems.map((item, i) => (
              <ViewItem key={i} label={item.label} className="block">
                {item.value}
              </ViewItem>
            ))}

            {isIcRecord(record.recordType) && (
              <ViewItem label={msg().Exp_Lbl_Detail} className="block">
                {getDetailDisplay(record.transitIcRecordInfo)}
              </ViewItem>
            )}

            {record.items[0].remarks && (
              <ViewItem label={msg().Exp_Clbl_Summary} className="block">
                {record.items[0].remarks}
              </ViewItem>
            )}
          </div>

          {record.items.length > 1 && (
            <ChildItems
              items={record.items}
              currencyDecimalPlaces={currencyDecimalPlaces}
              currencySymbol={currencySymbol}
            />
          )}

          <FilePreview
            className={`${ROOT}__receipt block`}
            title={record.receiptTitle}
            id={record.receiptId}
            fileId={record.receiptFileId}
            dataType={record.receiptDataType}
            label={msg().Exp_Lbl_Receipt}
            uploadedDate={record.receiptCreatedDate}
            openExternal
          />

          {renderMetadata()}
          {renderMerchant()}
          {renderJctRegistrationNumber()}
        </div>
      </div>
    </Wrapper>
  );
};

export default Record;
