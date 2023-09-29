import React from 'react';

import get from 'lodash/get';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import RouteMap from '../../../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap';
import SFFilePreview from '../../../../../commons/components/SFFilePreview';
import ImgEditOn from '../../../../../commons/images/btnEditOn.svg';
import msg from '../../../../../commons/languages';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import MultipleTaxEntriesApprovalForm from '@apps/commons/components/exp/Form/RecordItem/General/MultipleTaxEntries/MultipleTaxEntriesApprovalForm';
import TextUtil from '@apps/commons/utils/TextUtil';
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
  record: ExpRequestRecord;
  selectedMetadatas: Record<string, FileMetadata>;
  request: ExpRequest;
  recordIdx: number;
  hideSideFile: () => void;
  setSideFile: (file: SideFile) => void;
  baseCurrencyCode?: string;
  expTaxTypeList?: any;
  isApexView?: boolean;
  mileageUnit: MileageUnit;
  isRecordBodyOpen?: boolean;
  useJctRegistrationNumber?: boolean;
  openVendorDetail: (vendorId: string) => void;
};

const ROOT =
  'approvals-pc-expenses-pre-approval-pane-detail__records-area-record__body';
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

  renderBaseCurrency() {
    const { record, baseCurrencySymbol, baseCurrencyDecimal } = this.props;

    const isMultipleTax = record.items[0]?.taxItems?.length > 0;

    if (isMultipleTax) {
      return (
        <div className="multiple-tax-wrapper">
          <MultipleTaxEntriesApprovalForm
            expRecord={record}
            baseCurrencySymbol={baseCurrencySymbol}
            baseCurrencyDecimal={baseCurrencyDecimal}
          />
        </div>
      );
    }

    const editImage = this.props.record.items[0].taxManual ? (
      <ImgEditOn aria-hidden="true" />
    ) : null;
    const amountWithoutGST = FormatUtil.formatNumber(
      this.props.record.items[0].withoutTax,
      this.props.baseCurrencyDecimal
    );
    const amountIncludeGST = FormatUtil.formatNumber(
      this.props.record.items[0].amount,
      this.props.baseCurrencyDecimal
    );
    const gstVat = FormatUtil.formatNumber(
      this.props.record.items[0].gstVat,
      this.props.baseCurrencyDecimal
    );
    const withholdingTaxAmount = FormatUtil.formatNumber(
      this.props.record.items[0].withholdingTaxAmount,
      this.props.baseCurrencyDecimal
    );
    const amountPayable = FormatUtil.formatNumber(
      this.props.record.items[0].amountPayable,
      this.props.baseCurrencyDecimal
    );

    let taxRate = this.props.record.items[0].taxRate;
    // @ts-ignore
    taxRate = isNil(taxRate) ? '-' : taxRate;

    return (
      <div className={`${ROOT}-item--divider`}>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_IncludeTax}
          </div>
          <div
            className={`${ROOT}-item-body`}
          >{`${this.props.baseCurrencySymbol} ${amountIncludeGST}`}</div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_WithoutTax}
          </div>
          <div
            className={`${ROOT}-item-body`}
          >{`${this.props.baseCurrencySymbol} ${amountWithoutGST}`}</div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_GstAmount}</div>
          <div className={`${ROOT}-item-body`}>
            {`${this.props.baseCurrencySymbol} ${gstVat}`}
            {editImage}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_GstRate}</div>
          <div className={`${ROOT}-item-body`}>{`${taxRate} %`}</div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Gst}</div>
          <div className={`${ROOT}-item-body`}>
            {this.props.record.items[0].taxTypeName}
          </div>
        </div>

        {isUseWithholdingTax(this.props.record.withholdingTaxUsage) && (
          <>
            <div className={`${ROOT}-item`}>
              <div className={`${ROOT}-item-title`}>
                {msg().Exp_Clbl_WithholdingTaxAmount}
              </div>
              <div
                className={`${ROOT}-item-body`}
              >{`${this.props.baseCurrencySymbol} ${withholdingTaxAmount}`}</div>
            </div>
            <div className={`${ROOT}-item`}>
              <div className={`${ROOT}-item-title`}>
                {msg().Exp_Clbl_AmountPayable}
              </div>
              <div
                className={`${ROOT}-item-body`}
              >{`${this.props.baseCurrencySymbol} ${amountPayable}`}</div>
            </div>
          </>
        )}
      </div>
    );
  }

  renderForeignCurrency() {
    const { record } = this.props;
    const localAmount = FormatUtil.formatNumber(
      record.items[0].localAmount,
      record.items[0].currencyInfo.decimalPlaces
    );
    const isEditable = record.items[0].exchangeRateManual;
    const editImage = isEditable ? <ImgEditOn aria-hidden="true" /> : null;

    const exchangeRate = record.items[0].exchangeRate;

    return (
      <div className={`${ROOT}-item--divider`}>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_LocalAmount}
          </div>
          <div className={`${ROOT}-item-body`}>
            {`${record.items[0].currencyInfo.symbol || ''} ${localAmount}`}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_ExchangeRate}
          </div>
          <div className={`${ROOT}-item-body`}>
            {exchangeRate}
            {editImage}
          </div>
        </div>
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}> {msg().Exp_Clbl_Currency}</div>
          <div className={`${ROOT}-item-body`}>
            {record.items[0].currencyInfo.code}
          </div>
        </div>
      </div>
    );
  }

  renderJorudan() {
    return (
      <RouteMap
        routeInfo={this.props.record.routeInfo}
        baseCurrencySymbol={this.props.baseCurrencySymbol}
      />
    );
  }

  renderMileage() {
    const { record, baseCurrencySymbol, mileageUnit } = this.props;
    return (
      <MileageApproval
        record={record}
        baseCurrencySymbol={baseCurrencySymbol}
        mileageUnit={mileageUnit}
        isRecordBodyOpen={this.props.isRecordBodyOpen}
      />
    );
  }

  renderAttachment(receipt) {
    let attachmentContainer = null;
    const { useImageQualityCheck, selectedMetadatas } = this.props;
    const {
      receiptId,
      receiptFileId = '',
      receiptDataType = '',
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
      getMetadataWarning(selectedMetadata, true)
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
  }

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
    const { request, record } = this.props;
    let jobCode = request.jobCode;
    let jobName = request.jobName;
    const recordItem = record.items[0];
    if (recordItem.jobId) {
      jobCode = recordItem.jobCode;
      jobName = recordItem.jobName;
    }

    return (
      jobCode && (
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Job}</div>
          <div className={`${ROOT}-item-body`}>{`${jobCode} - ${jobName}`}</div>
        </div>
      )
    );
  }

  renderCC() {
    const { request, record } = this.props;
    let costCenterCode = request.costCenterCode;
    let costCenterName = request.costCenterName;
    const recordItem = record.items[0];
    if (recordItem.costCenterHistoryId) {
      costCenterCode = recordItem.costCenterCode;
      costCenterName = recordItem.costCenterName;
    }
    return (
      costCenterCode && (
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>
            {msg().Exp_Clbl_CostCenter}
          </div>
          <div
            className={`${ROOT}-item-body`}
          >{`${costCenterCode} - ${costCenterName}`}</div>
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

  renderMerchant = () => {
    if (!isUseMerchant(this.props.record.merchantUsage)) {
      return null;
    }
    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Merchant}</div>
        <div className={`${ROOT}-item-body`}>
          {this.props.record.items[0].merchant || ''}
        </div>
      </div>
    );
  };

  renderJctRegistrationNumber = () => {
    const { record, useJctRegistrationNumber } = this.props;
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
    const vendorIsJctQualifiedIssuer = get(
      record,
      'items[0].vendorIsJctQualifiedIssuer',
      false
    );
    const vendorId = get(record, 'items[0].vendorId', '');
    const jctInvoiceOption = get(record, 'items[0].jctInvoiceOption');

    if (!useJctRegistrationNumber || !isUseJctNo(jctRegistrationNumberUsage)) {
      return null;
    }

    let value = msg()[JCT_NUMBER_INVOICE_MSG_KEY[jctInvoiceOption]];
    if (
      (jctRegistrationNumber || (vendorId && vendorIsJctQualifiedIssuer)) &&
      jctInvoiceOption === JCT_NUMBER_INVOICE.Invoice
    ) {
      value = `${
        msg().Exp_Clbl_JctRegistrationNumber
      }: ${getJctRegistrationNumber(
        jctRegistrationNumber,
        vendorIsJctQualifiedIssuer
      )} `;
    }
    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Invoice}</div>
        <div className={`${ROOT}-item-body`}>{value}</div>
      </div>
    );
  };

  renderVendor() {
    const { record, useJctRegistrationNumber } = this.props;
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

    if (!vendorCode) return null;

    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Vendor}</div>
        <div className={`${ROOT}-item-body`}>
          <div>
            <div>{`${vendorCode} - ${vendorName}`}</div>
            {useJctRegistrationNumber && (
              <div className={`${ROOT}--jct-number`}>
                {`${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  vendorJctRegistrationNumber,
                  vendorIsJctQualifiedIssuer
                )}`}
              </div>
            )}
            <Button
              className={`${ROOT}__vendor-detail`}
              onClick={() => this.props.openVendorDetail(recordItem.vendorId)}
            >
              {msg().Exp_Btn_VendorDetail}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderPaymentDueDate() {
    const { record } = this.props;
    const recordItem = record.items[0];
    const paymentDueDate = recordItem.paymentDueDate;
    if (!paymentDueDate) return null;

    return (
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_PaymentDate}</div>
        <div className={`${ROOT}-item-body`}>
          {DateUtil.formatYMD(paymentDueDate)}
        </div>
      </div>
    );
  }

  render() {
    let renderArea;

    switch (this.props.record.recordType) {
      case 'General':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
        renderArea = this.props.record.items[0].useForeignCurrency
          ? this.renderForeignCurrency()
          : this.renderBaseCurrency();
        break;
      case 'TransitJorudanJP':
        renderArea = this.renderJorudan();
        break;
      case RECORD_TYPE.Mileage:
        const mileageCurrencyArea = this.renderBaseCurrency();
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

    const isShowPMField = isShowPaymentMethodField(
      [],
      this.props.record as IRecord
    );
    return (
      <div className={`${ROOT}`}>
        {isShowPMField && (
          <div className={`${ROOT}-item`}>
            <div className={`${ROOT}-item-title`}>
              {msg().Exp_Clbl_PaymentMethod}
            </div>
            <div className={`${ROOT}-item-body`}>
              {this.props.record.paymentMethodName}
            </div>
          </div>
        )}
        {renderArea}
        {this.renderJob()}
        {this.renderCC()}
        {this.renderIcTransitDetail()}
        {this.renderMerchant()}
        {this.renderVendor()}
        {this.renderPaymentDueDate()}
        {this.renderJctRegistrationNumber()}
        {extendedItems.map((pair) => (
          <div className={`${ROOT}-item`} key={pair.label}>
            <div className={`${ROOT}-item-title`}>{pair.label}</div>
            <div className={`${ROOT}-item-body`}>{pair.value}</div>
          </div>
        ))}

        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_Summary}</div>
          <div className={`${ROOT}-item-body ${ROOT}-item-body-summary`}>
            {this.props.record.items[0].remarks}
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
