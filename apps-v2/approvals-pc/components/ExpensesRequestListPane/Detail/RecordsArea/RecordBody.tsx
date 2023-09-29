import React from 'react';

import classnames from 'classnames';
import { get, isEmpty, isEqual, isNil } from 'lodash';

import styled from 'styled-components';

import RouteMap from '../../../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap';
import SFFilePreview from '../../../../../commons/components/SFFilePreview';
import ImgEditOn from '../../../../../commons/images/btnEditOn.svg';
import msg from '../../../../../commons/languages';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import MultipleTaxEntriesApprovalForm from '@apps/commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/MultipleTaxEntriesApprovalForm';
import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  convertNullOrUndefined,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import TextUtil from '@apps/commons/utils/TextUtil';
import { Color } from '@apps/core/styles';
import Button from '@commons/components/buttons/Button';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import DateUtil from '@commons/utils/DateUtil';

import { getLabelValueFromEIs } from '../../../../../domain/models/exp/ExtendedItem';
import { isUseMerchant } from '../../../../../domain/models/exp/Merchant';
import {
  FileMetadata,
  getMetadataDisplay,
  getMetadataWarning,
  isNotImage,
  isPDF,
  previewUrl,
} from '../../../../../domain/models/exp/Receipt';
import {
  isIcRecord,
  isUseWithholdingTax,
  Record as IRecord,
  RECORD_TYPE,
} from '../../../../../domain/models/exp/Record';
import {
  ExpRequest,
  ExpRequestRecord,
} from '../../../../../domain/models/exp/request/Report';
import { getDetailDisplay } from '../../../../../domain/models/exp/TransportICCard';
import {
  isUseJctNo,
  JCT_NUMBER_INVOICE,
  JCT_NUMBER_INVOICE_MSG_KEY,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { isShowPaymentMethodField } from '@apps/domain/models/exp/PaymentMethod';
import { getJctRegistrationNumber } from '@apps/domain/models/exp/Vendor';

import { SideFile } from '../../../../modules/ui/sideFilePreview';

import MileageApproval from '@apps/approvals-pc/components/MileageApproval';

import './RecordBody.scss';

type Props = {
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useImageQualityCheck: boolean;
  selectedMetadatas: Record<string, FileMetadata>;
  record: ExpRequestRecord;
  preExpRecord?: ExpRequestRecord;
  report: ExpRequest;
  preExpReport?: ExpRequest;
  hideSideFile: () => void;
  setSideFile: (file: SideFile) => void;
  recordIdx: number;
  baseCurrencyCode?: string;
  expTaxTypeList?: any;
  isApexView?: boolean;
  isHighlightDiff?: boolean;
  mileageUnit: MileageUnit;
  isRecordBodyOpen?: boolean;
  useJctRegistrationNumber?: boolean;
  openVendorDetail: (vendorId: string) => void;
};

const ROOT =
  'approvals-pc-expenses-request-pane-detail__records-area-record__body';

const valuesToObjectMapping = {
  amount: 'amount',
  withoutTax: 'withoutTax',
  withholdingTaxAmount: 'withholdingTaxAmount',
  amountPayable: 'amountPayable',
  gstVat: 'gstVat',
  taxRate: 'taxRate',
  taxTypeName: 'taxTypeName',
  localAmount: 'localAmount',
  exchangeRate: 'exchangeRate',
  remarks: 'remarks',
  merchant: 'merchant',
  'currencyInfo.code': 'currencyInfo.code',
};

const recordLevelValuesToObjectMapping = {
  paymentMethodName: 'paymentMethodName',
};

export default class RecordContentBody extends React.Component<Props> {
  onOpenSideFile = (receipt) => {
    const {
      receiptCreatedDate: createdDate,
      receiptDataType: dataType,
      receiptId: id,
      receiptTitle: name,
      receiptFileId: verId,
    } = receipt;
    // click the same pdf should trigger download popup
    this.props.hideSideFile();
    setTimeout(() => {
      this.props.setSideFile({ createdDate, dataType, id, name, verId });
    }, 1);
  };

  getDiffValue(diffValues: DifferenceValues, key: string) {
    if (!diffValues) return undefined;
    const values = diffValues[key];
    if (values) return values.original;
    return undefined;
  }

  formatNumberWithFractionDigits = (
    value: number | string,
    fractionDigits: number
  ) => {
    if (isNil(value)) {
      return undefined;
    }
    return FormatUtil.formatNumber(value, fractionDigits);
  };

  renderBaseCurrency(diffValues?: DifferenceValues) {
    const {
      record,
      preExpRecord,
      baseCurrencySymbol,
      baseCurrencyDecimal,
      isHighlightDiff,
    } = this.props;

    const isMultipleTax = record.items[0]?.taxItems?.length > 0;

    if (isMultipleTax) {
      return (
        <div className="multiple-tax-wrapper">
          <MultipleTaxEntriesApprovalForm
            expRecord={record}
            preExpRecord={preExpRecord}
            baseCurrencySymbol={baseCurrencySymbol}
            baseCurrencyDecimal={baseCurrencyDecimal}
            isHighlightDifference={isHighlightDiff}
          />
        </div>
      );
    }

    const editImage = this.props.record.items[0].taxManual ? (
      <ImgEditOn aria-hidden="true" />
    ) : null;
    const amountWithGST = FormatUtil.formatNumber(
      this.props.record.items[0].amount,
      this.props.baseCurrencyDecimal
    );
    const amountWithGSTDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'amount'),
      this.props.baseCurrencyDecimal
    );
    const amountWithoutGST = FormatUtil.formatNumber(
      this.props.record.items[0].withoutTax,
      this.props.baseCurrencyDecimal
    );
    const amountWithoutGSTDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'withoutTax'),
      this.props.baseCurrencyDecimal
    );
    const gstVat = FormatUtil.formatNumber(
      this.props.record.items[0].gstVat,
      this.props.baseCurrencyDecimal
    );
    const gstVatDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'gstVat'),
      this.props.baseCurrencyDecimal
    );
    let taxRate = this.props.record.items[0].taxRate;
    // @ts-ignore
    taxRate = isNil(taxRate) ? '-' : taxRate;
    const taxRateDiff = this.getDiffValue(diffValues, 'taxRate');
    const withholdingTax = FormatUtil.formatNumber(
      this.props.record.items[0].withholdingTaxAmount,
      this.props.baseCurrencyDecimal
    );
    const withholdingTaxDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'withholdingTaxAmount'),
      this.props.baseCurrencyDecimal
    );
    const amountPayable = FormatUtil.formatNumber(
      this.props.record.items[0].amountPayable,
      this.props.baseCurrencyDecimal
    );
    const amountPayableDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'amountPayable'),
      this.props.baseCurrencyDecimal
    );
    const taxTypeNameDiff = this.getDiffValue(diffValues, 'taxTypeName');

    return (
      <div className={`${ROOT}-item--divider`}>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_IncludeTax}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={amountWithGSTDiff !== undefined}>
              {`${this.props.baseCurrencySymbol} ${amountWithGST}`}
            </Highlight>
            {!isNil(amountWithGSTDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${this.props.baseCurrencySymbol} ${amountWithGSTDiff})`}
              </Highlight>
            )}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_WithoutTax}
          </div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={amountWithoutGSTDiff !== undefined}>
              {`${this.props.baseCurrencySymbol} ${amountWithoutGST}`}
            </Highlight>
            {!isNil(amountWithoutGSTDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${this.props.baseCurrencySymbol} ${amountWithoutGSTDiff})`}
              </Highlight>
            )}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_GstAmount}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={gstVatDiff !== undefined}>
              {`${this.props.baseCurrencySymbol} ${gstVat}`}
            </Highlight>
            {!isNil(gstVatDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${this.props.baseCurrencySymbol} ${gstVatDiff})`}
              </Highlight>
            )}
            {editImage}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_GstRate}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight
              highlight={taxRateDiff !== undefined}
            >{`${taxRate} %`}</Highlight>
            {!isNil(taxRateDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >{`(${taxRateDiff} %)`}</Highlight>
            )}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Gst}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={taxTypeNameDiff !== undefined}>
              {this.props.record.items[0].taxTypeName}
            </Highlight>
            {!isNil(taxTypeNameDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${taxTypeNameDiff})`}
              </Highlight>
            )}
          </div>
        </div>

        {isUseWithholdingTax(this.props.record.withholdingTaxUsage) && (
          <>
            <div className={`${ROOT}-item`}>
              <div className={`${ROOT}-item-title`}>
                {msg().Exp_Clbl_WithholdingTaxAmount}
              </div>
              <div className={`${ROOT}-item-body`}>
                <Highlight highlight={withholdingTaxDiff !== undefined}>
                  {`${this.props.baseCurrencySymbol} ${withholdingTax}`}
                </Highlight>
                {!isNil(withholdingTaxDiff) && (
                  <Highlight
                    highlightColor={Color.bgDisabled}
                    className={`${ROOT}-item-body-highlight`}
                  >
                    {`(${this.props.baseCurrencySymbol} ${withholdingTaxDiff})`}
                  </Highlight>
                )}
              </div>
            </div>
            <div className={`${ROOT}-item`}>
              <div className={`${ROOT}-item-title`}>
                {msg().Exp_Clbl_AmountPayable}
              </div>
              <div className={`${ROOT}-item-body`}>
                <Highlight highlight={amountPayableDiff !== undefined}>
                  {`${this.props.baseCurrencySymbol} ${amountPayable}`}
                </Highlight>
                {!isNil(amountPayableDiff) && (
                  <Highlight
                    highlightColor={Color.bgDisabled}
                    className={`${ROOT}-item-body-highlight`}
                  >
                    {`(${this.props.baseCurrencySymbol} ${amountPayableDiff})`}
                  </Highlight>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  renderForeignCurrency(diffValues?: DifferenceValues) {
    const { record } = this.props;

    const amountWithGST = FormatUtil.formatNumber(
      this.props.record.items[0].amount,
      this.props.baseCurrencyDecimal
    );
    const amountWithGSTDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'amount'),
      this.props.baseCurrencyDecimal
    );

    const localAmount = FormatUtil.formatNumber(
      record.items[0].localAmount,
      record.items[0].currencyInfo.decimalPlaces
    );
    const localAmountDiff = this.formatNumberWithFractionDigits(
      this.getDiffValue(diffValues, 'localAmount'),
      record.items[0].currencyInfo.decimalPlaces
    );
    const isEditable = record.items[0].exchangeRateManual;
    const editImage = isEditable ? <ImgEditOn aria-hidden="true" /> : null;

    const exchangeRate = record.items[0].exchangeRate;
    const exchangeRateDiff = this.getDiffValue(diffValues, 'exchangeRate');

    const currencyDiff = this.getDiffValue(diffValues, 'currencyInfo.code');

    return (
      <div className={`${ROOT}-item--divider`}>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_IncludeTax}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={amountWithGSTDiff !== undefined}>
              {`${this.props.baseCurrencySymbol} ${amountWithGST}`}
            </Highlight>
            {!isNil(amountWithGSTDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${this.props.baseCurrencySymbol} ${amountWithGSTDiff})`}
              </Highlight>
            )}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_LocalAmount}
          </div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={localAmountDiff !== undefined}>
              {`${record.items[0].currencyInfo.symbol || ''} ${localAmount}`}
            </Highlight>
            {!isNil(localAmountDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(
                ${record.items[0].currencyInfo.symbol || ''} ${localAmountDiff}
                )`}
              </Highlight>
            )}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_ExchangeRate}
          </div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={exchangeRateDiff !== undefined}>
              {exchangeRate}
            </Highlight>
            {!isNil(exchangeRateDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >
                {`(${exchangeRateDiff})`}
              </Highlight>
            )}
            {editImage}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}> {msg().Exp_Clbl_Currency}</div>
          <div className={`${ROOT}-item-body`}>
            <Highlight highlight={currencyDiff !== undefined}>
              {record.items[0].currencyInfo.code}
            </Highlight>
            {!isNil(currencyDiff) && (
              <Highlight
                highlightColor={Color.bgDisabled}
                className={`${ROOT}-item-body-highlight`}
              >{`(${currencyDiff})`}</Highlight>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderJorudan(isHighlight: boolean) {
    return (
      <div className={`${ROOT}-jorudan-container`}>
        <Highlight
          highlight={isHighlight}
          className={`${ROOT}-jorudan-final-container`}
        >
          <RouteMap
            routeInfo={this.props.record.routeInfo}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
          />
        </Highlight>
        {isHighlight && !isEmpty(get(this.props.preExpRecord, 'routeInfo')) && (
          <Highlight
            className={`${ROOT}-jorudan-original-container`}
            highlightColor={Color.bgDisabled}
          >
            <RouteMap
              routeInfo={this.props.preExpRecord.routeInfo}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
            />
          </Highlight>
        )}
      </div>
    );
  }

  renderMileage() {
    const { record, preExpRecord, baseCurrencySymbol, mileageUnit } =
      this.props;
    return (
      <MileageApproval
        record={record}
        preExpRecord={preExpRecord}
        baseCurrencySymbol={baseCurrencySymbol}
        mileageUnit={mileageUnit}
        isHighlightDiff={this.props.isHighlightDiff}
        isRecordBodyOpen={this.props.isRecordBodyOpen}
      />
    );
  }

  renderAttachment = (receipt) => {
    let attachmentContainer = null;
    const { useImageQualityCheck, selectedMetadatas } = this.props;

    const {
      receiptId,
      receiptFileId,
      receiptDataType,
      receiptTitle = '',
      receiptCreatedDate = '',
    } = receipt;
    const selectedMetadata = selectedMetadatas[receiptId];

    if (receiptId) {
      const isNotImageType = isNotImage(receiptDataType);
      const isPdf = isPDF(receiptDataType);

      const fileUrl = previewUrl(receiptFileId, isNotImageType);

      attachmentContainer = (
        <AttachmentItem>
          {isNotImageType && !isPdf ? (
            <SFFilePreview
              fileType={receiptDataType}
              receiptId={receiptId || ''}
              receiptFileId={receiptFileId || ''}
              uploadedDate={receiptCreatedDate || ''}
              fileName={receiptTitle || ''}
              withDownloadLink
              isApexView={this.props.isApexView}
            />
          ) : (
            <img
              alt={msg().Exp_Lbl_Receipt}
              className={`${ROOT}__receipt-preview-body-img`}
              src={fileUrl}
              onClick={() => this.onOpenSideFile(receipt)}
            />
          )}
        </AttachmentItem>
      );
    }
    const metadata = (
      <div className={`${ROOT}__metadata`}>
        {getMetadataDisplay(selectedMetadata)}
      </div>
    );

    const metadataWarningText = TextUtil.nl2br(
      getMetadataWarning(selectedMetadata)
    );
    const metadataWarning = (
      <div className={`${ROOT}__metadata-warning`}>
        <ImgIconAttention className={`${ROOT}__metadata-warning-svg`} />
        <span className={`${ROOT}__metadata-warning-msg`}>
          {metadataWarningText}
        </span>
      </div>
    );

    return {
      attachmentContainer,
      useImageQualityCheck,
      metadata,
      metadataWarningText,
      metadataWarning,
    };
  };

  renderAttachments() {
    let receiptList = get(this.props.record, 'receiptList');
    const receiptId = get(this.props.record, 'receiptId');
    if (!receiptList && receiptId) {
      // Case for older clients because their structure not changed from BE side, so need to take from flat record object
      const {
        receiptFileId,
        receiptDataType,
        receiptTitle = '',
        receiptCreatedDate = '',
      } = this.props.record;
      receiptList = [
        {
          receiptId,
          receiptFileId,
          receiptDataType,
          receiptTitle,
          receiptCreatedDate,
        },
      ];
    }
    return (
      <AttachmentItems>
        {(receiptList || []).map((receipt, index) => {
          const {
            attachmentContainer,
            useImageQualityCheck,
            metadata,
            metadataWarningText,
            metadataWarning,
          } = this.renderAttachment(receipt);

          return (
            <AttachmentItemWithMetadata
              key={`${receipt.receiptId}-${index.toString()}`}
            >
              {attachmentContainer}
              {useImageQualityCheck && metadata}
              {useImageQualityCheck && metadataWarningText && metadataWarning}
            </AttachmentItemWithMetadata>
          );
        })}
      </AttachmentItems>
    );
  }

  renderJob() {
    const { report, record, preExpReport, preExpRecord, isHighlightDiff } =
      this.props;
    let jobCode = report.jobCode;
    let jobName = report.jobName;
    const recordItem = record.items[0];
    if (recordItem.jobId) {
      jobCode = recordItem.jobCode;
      jobName = recordItem.jobName;
    }
    let preJobCode, preJobName;
    let highlight = false;
    if (isHighlightDiff && preExpReport && preExpRecord) {
      preJobCode = convertNullOrUndefined(preExpReport.jobCode);
      preJobName = convertNullOrUndefined(preExpReport.jobName);
      const preRecordItem = preExpRecord.items[0];
      if (preRecordItem.jobId) {
        preJobCode = convertNullOrUndefined(preRecordItem.jobCode);
        preJobName = convertNullOrUndefined(preRecordItem.jobName);
      }
      if (preJobCode !== jobCode) highlight = true;
    }
    let jobDiffLabel = '';
    if (highlight && !isEmpty(preJobCode)) {
      jobDiffLabel = `${preJobCode} - ${preJobName}`;
    }
    const isShowJob = jobCode || jobDiffLabel;
    return (
      isShowJob && (
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Job}</div>
          <div className={`${ROOT}-item-body`}>
            {jobCode && (
              <Highlight highlight={highlight}>
                <div className={`${ROOT}-item-body`}>
                  {`${jobCode} - ${jobName}`}
                </div>
              </Highlight>
            )}
            {highlight && (
              <Highlight
                className={`${ROOT}-item-body-highlight`}
                highlightColor={Color.bgDisabled}
              >
                <div className={`${ROOT}-item-body`}>({jobDiffLabel})</div>
              </Highlight>
            )}
          </div>
        </div>
      )
    );
  }

  renderCC() {
    const { report, record, preExpReport, preExpRecord, isHighlightDiff } =
      this.props;
    let costCenterCode = report.costCenterCode;
    let costCenterName = report.costCenterName;
    const recordItem = record.items[0];
    if (recordItem.costCenterHistoryId) {
      costCenterCode = recordItem.costCenterCode;
      costCenterName = recordItem.costCenterName;
    }
    let preCostCenterCode, preCostCenterName;
    let highlightCC = false;
    if (isHighlightDiff && preExpReport && preExpRecord) {
      preCostCenterCode = convertNullOrUndefined(preExpReport.costCenterCode);
      preCostCenterName = convertNullOrUndefined(preExpReport.costCenterName);
      const preRecordItem = preExpRecord.items[0];
      if (preRecordItem.costCenterHistoryId) {
        preCostCenterCode = convertNullOrUndefined(
          preRecordItem.costCenterCode
        );
        preCostCenterName = convertNullOrUndefined(
          preRecordItem.costCenterName
        );
      }
      if (preCostCenterCode !== costCenterCode) highlightCC = true;
    }
    let costCenterDiffLabel = '';
    if (highlightCC && !isEmpty(preCostCenterCode)) {
      costCenterDiffLabel = `${preCostCenterCode} - ${preCostCenterName}`;
    }
    const isShowCC = costCenterCode || costCenterDiffLabel;
    return (
      isShowCC && (
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_CostCenter}
          </div>
          <div className={`${ROOT}-item-body`}>
            {costCenterCode && (
              <Highlight highlight={highlightCC}>
                <div className={`${ROOT}-item-body`}>
                  {`${costCenterCode} - ${costCenterName}`}
                </div>
              </Highlight>
            )}
            {highlightCC && (
              <Highlight
                className={`${ROOT}-item-body-highlight`}
                highlightColor={Color.bgDisabled}
              >
                <div className={`${ROOT}-item-body`}>
                  ({costCenterDiffLabel})
                </div>
              </Highlight>
            )}
          </div>
        </div>
      )
    );
  }

  renderIcTransitDetail = () => {
    if (!isIcRecord(this.props.record.recordType)) {
      return null;
    }
    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Detail}</div>
        <div className={`${ROOT}-item-body`}>
          {getDetailDisplay(this.props.record.transitIcRecordInfo)}
        </div>
      </div>
    );
  };

  renderMerchant = (diffValues) => {
    if (!isUseMerchant(this.props.record.merchantUsage)) {
      return null;
    }
    const isDiff = isDifferent('merchant', diffValues);
    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Merchant}</div>
        <div className={`${ROOT}-item-body`}>
          <Highlight highlight={isDiff}>
            {this.props.record.items[0].merchant || ''}
          </Highlight>
          {isDiff && (
            <Highlight
              className={`${ROOT}-item-body-highlight`}
              highlightColor={Color.bgDisabled}
            >
              <div className={`${ROOT}-item-body`}>
                ({get(diffValues, 'merchant.original', '')})
              </div>
            </Highlight>
          )}
        </div>
      </div>
    );
  };

  renderExtendedItem = (
    pair: { label: string; value: string },
    preRequestPair: { label: string; value: string }
  ) => {
    let isHighlight = false;
    const isNewRecord =
      this.props.isHighlightDiff && isEmpty(this.props.preExpRecord);
    if (this.props.isHighlightDiff && !isNewRecord) {
      const original = get(pair, 'value', '');
      const diff = get(preRequestPair, 'value', '');
      if (!isEqual(original, diff)) isHighlight = true;
    }
    return (
      <div className={`${ROOT}-item`} key={pair.label}>
        <div className={`${ROOT}-item-title`}>{pair.label}</div>
        <div className={`${ROOT}-item-body`}>
          <Highlight highlight={isHighlight}>
            <div className={`${ROOT}-item-body`}>{pair.value}</div>
          </Highlight>
          {isHighlight && (
            <Highlight
              className={`${ROOT}-item-body-highlight`}
              highlightColor={Color.bgDisabled}
            >
              <div className={`${ROOT}-item-body`}>
                ({get(preRequestPair, 'value', '')})
              </div>
            </Highlight>
          )}
        </div>
      </div>
    );
  };

  renderJctRegistrationNumber = () => {
    const { record, preExpRecord, useJctRegistrationNumber, isHighlightDiff } =
      this.props;
    const preJctRegistrationNumber = get(
      preExpRecord,
      'items[0].jctRegistrationNumber',
      ''
    );
    const preVendorId = get(preExpRecord, 'items[0].vendorId', '');
    const preVendorIsJctQualifiedIssuer = get(
      preExpRecord,
      'items[0].vendorIsJctQualifiedIssuer',
      false
    );
    const jctRegistrationNumberUsage = get(
      record,
      'jctRegistrationNumberUsage',
      JCT_REGISTRATION_NUMBER_USAGE.NotUsed
    );
    const jctRegistrationNumber = get(
      record,
      'items[0].jctRegistrationNumber',
      ''
    );
    const vendorId = get(record, 'items[0].vendorId', '');
    const vendorIsJctQualifiedIssuer = get(
      record,
      'items[0].vendorIsJctQualifiedIssuer',
      false
    );

    if (!useJctRegistrationNumber || !isUseJctNo(jctRegistrationNumberUsage)) {
      return null;
    }

    const preJctInvoiceOption = get(preExpRecord, 'items[0].jctInvoiceOption');
    const jctInvoiceOption = get(record, 'items[0].jctInvoiceOption');
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
    if (isHighlightDiff && !isEmpty(preExpRecord)) {
      if (preValue !== value) {
        isHighlight = true;
      }
    }

    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Invoice}</div>
        <div className={`${ROOT}-item-body`}>
          <Highlight highlight={isHighlight}>
            <div className={`${ROOT}-item-body`}>
              {hasJctRegistrationNumber &&
                `${msg().Exp_Clbl_JctRegistrationNumber}: `}
              {value}
            </div>
          </Highlight>
          {isHighlight && (
            <Highlight
              className={`${ROOT}-item-body-highlight`}
              highlightColor={Color.bgDisabled}
            >
              <span className={`${ROOT}-item-body`}>
                {`(${
                  hasPreJctRegistrationNumber && preValue
                    ? `${msg().Exp_Clbl_JctRegistrationNumber}: `
                    : ''
                }${preValue || ''})`}
              </span>
            </Highlight>
          )}
        </div>
      </div>
    );
  };

  renderVendor = () => {
    const { record, preExpRecord, isHighlightDiff, useJctRegistrationNumber } =
      this.props;
    let vendorCode,
      vendorName,
      vendorJctRegistrationNumber,
      vendorIsJctQualifiedIssuer;
    const recordItem = record.items[0];
    if (recordItem.vendorId) {
      vendorCode = recordItem.vendorCode;
      vendorName = recordItem.vendorName;
      vendorJctRegistrationNumber = recordItem.vendorJctRegistrationNumber;
      vendorIsJctQualifiedIssuer = recordItem.vendorIsJctQualifiedIssuer;
    }
    let preVendorCode,
      preVendorName,
      preVendorJctRegistrationNumber,
      preVendorIsJctQualifiedIssuer;
    let isVendorDiff = false;
    if (isHighlightDiff && preExpRecord) {
      const preRecordItem = preExpRecord.items[0];
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
    if (isVendorDiff && !isEmpty(preVendorCode)) {
      vendorDiffLabel = `${preVendorCode} ${
        preVendorName ? ` - ${preVendorName}` : ''
      }`;
      if (useJctRegistrationNumber) {
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
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Vendor}</div>
        <div className={`${ROOT}-item-body ${ROOT}-item-body-summary`}>
          <div>
            <Highlight highlight={isVendorDiff}>
              <div className={`${ROOT}-item-body`}>
                <div>{vendorCode ? `${vendorCode} - ${vendorName}` : ''}</div>
                {recordItem.vendorId && useJctRegistrationNumber && (
                  <div className={`${ROOT}--jct-number`}>
                    {`${
                      msg().Exp_Clbl_JctRegistrationNumber
                    }: ${getJctRegistrationNumber(
                      vendorJctRegistrationNumber,
                      vendorIsJctQualifiedIssuer
                    )}`}
                  </div>
                )}
              </div>
            </Highlight>
            {recordItem.vendorId && (
              <Button
                className={`${ROOT}__vendor-detail`}
                onClick={() => this.props.openVendorDetail(recordItem.vendorId)}
              >
                {msg().Exp_Btn_VendorDetail}
              </Button>
            )}
          </div>
          {isVendorDiff && (
            <Highlight
              className={`${ROOT}-item-body-highlight`}
              highlightColor={Color.bgDisabled}
            >
              <div className={`${ROOT}-item-body`}>({vendorDiffLabel})</div>
            </Highlight>
          )}
        </div>
      </div>
    );
  };

  renderPaymentDueDate = () => {
    const { record, preExpRecord, isHighlightDiff } = this.props;
    let paymentDueDate;
    const recordItem = record.items[0];
    if (recordItem.paymentDueDate) {
      paymentDueDate = recordItem.paymentDueDate;
    }
    let prePaymentDueDate;
    let isPaymentDueDateDiff = false;
    if (isHighlightDiff && preExpRecord) {
      const preRecordItem = preExpRecord.items[0];
      if (preRecordItem.paymentDueDate) {
        prePaymentDueDate = convertNullOrUndefined(
          preRecordItem.paymentDueDate
        );
      }
      if (prePaymentDueDate !== paymentDueDate) isPaymentDueDateDiff = true;
    }
    let paymentDueDateDiffLabel = '';
    if (isPaymentDueDateDiff && !isEmpty(prePaymentDueDate)) {
      paymentDueDateDiffLabel = prePaymentDueDate;
    }

    if (!paymentDueDate && !isPaymentDueDateDiff) return null;

    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_PaymentDate}</div>
        <div className={`${ROOT}-item-body`}>
          <Highlight highlight={isPaymentDueDateDiff}>
            <div className={`${ROOT}-item-body`}>
              {DateUtil.formatYMD(paymentDueDate)}
            </div>
          </Highlight>
          {isPaymentDueDateDiff && (
            <Highlight
              className={`${ROOT}-item-body-highlight`}
              highlightColor={Color.bgDisabled}
            >
              <div className={`${ROOT}-item-body`}>
                ({DateUtil.formatYMD(paymentDueDateDiffLabel)})
              </div>
            </Highlight>
          )}
        </div>
      </div>
    );
  };

  render() {
    let diffValues;
    let recordLevelDiffValues;
    const showHighlight =
      this.props.isHighlightDiff && !isEmpty(this.props.preExpRecord);
    if (showHighlight) {
      diffValues = convertDifferenceValues(
        valuesToObjectMapping,
        this.props.record.items[0],
        this.props.preExpRecord.items[0]
      );
      recordLevelDiffValues = convertDifferenceValues(
        recordLevelValuesToObjectMapping,
        this.props.record,
        this.props.preExpRecord
      );
    }
    let renderArea;

    switch (this.props.record.recordType) {
      case 'General':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
        renderArea = this.props.record.items[0].useForeignCurrency
          ? this.renderForeignCurrency(diffValues)
          : this.renderBaseCurrency(diffValues);
        break;
      case 'TransitJorudanJP':
        const isDiffRoute =
          showHighlight &&
          !isEqual(
            this.props.record.routeInfo,
            get(this.props.preExpRecord, 'routeInfo')
          );
        renderArea = this.renderJorudan(isDiffRoute);
        break;
      case RECORD_TYPE.Mileage:
        const mileageCurrencyArea = this.renderBaseCurrency(diffValues);
        const mileageArea = this.renderMileage();
        renderArea = (
          <div className={`${ROOT}-mileage-container`}>
            {mileageArea}
            {mileageCurrencyArea}
          </div>
        );
        break;
      default:
        break;
    }

    const extendedItems = getLabelValueFromEIs(
      this.props.record.items[0],
      true
    );
    let preRequestExtendedItems;
    if (showHighlight)
      preRequestExtendedItems = getLabelValueFromEIs(
        this.props.preExpRecord.items[0],
        true
      );

    const isNewRecord =
      this.props.isHighlightDiff && isEmpty(this.props.preExpRecord);

    const paymentMethodNameDiff = isDifferent(
      'paymentMethodName',
      recordLevelDiffValues
    );

    const isShowPMField =
      !!paymentMethodNameDiff ||
      isShowPaymentMethodField([], this.props.record as IRecord);

    return (
      <div className={classnames(ROOT, isNewRecord && `${ROOT}-highlight`)}>
        {isShowPMField && (
          <div className={`${ROOT}-item`}>
            <div className={`${ROOT}-item-title`}>
              {msg().Exp_Clbl_PaymentMethod}
            </div>
            <div className={`${ROOT}-item-body`}>
              <Highlight highlight={paymentMethodNameDiff}>
                {this.props.record.paymentMethodName}
              </Highlight>
              {paymentMethodNameDiff && (
                <Highlight
                  className={`${ROOT}-item-body-highlight`}
                  highlightColor={Color.bgDisabled}
                >
                  <div className={`${ROOT}-item-body`}>
                    (
                    {get(
                      recordLevelDiffValues,
                      'paymentMethodName.original',
                      ''
                    )}
                    )
                  </div>
                </Highlight>
              )}
            </div>
          </div>
        )}

        {renderArea}
        {this.renderJob()}
        {this.renderCC()}
        {this.renderIcTransitDetail()}
        {this.renderMerchant(diffValues)}
        {this.renderVendor()}
        {this.renderPaymentDueDate()}
        {this.renderJctRegistrationNumber()}
        {extendedItems.map((pair) => {
          const preRequestPair =
            preRequestExtendedItems &&
            preRequestExtendedItems.find(({ id }) => id === pair.id);
          return this.renderExtendedItem(pair, preRequestPair);
        })}

        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Summary}</div>
          <div className={`${ROOT}-item-body ${ROOT}-item-body-summary`}>
            <Highlight highlight={isDifferent('remarks', diffValues)}>
              {this.props.record.items[0].remarks}
            </Highlight>
            {isDifferent('remarks', diffValues) && (
              <Highlight
                className={`${ROOT}-item-body-highlight`}
                highlightColor={Color.bgDisabled}
              >
                <div className={`${ROOT}-item-body`}>
                  ({get(diffValues, 'remarks.original', '')})
                </div>
              </Highlight>
            )}
          </div>
        </div>
        {this.renderAttachments()}
      </div>
    );
  }
}

const AttachmentItem = styled.div`
  display: flex;
  flex-direction: column;

  img {
    border-radius: 3px;
  }
`;

const AttachmentItemWithMetadata = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
  padding: 15px;
  border: 1px solid #dddddd;
  border-radius: 3px;
`;

const AttachmentItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
`;
