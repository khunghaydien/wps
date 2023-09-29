import React from 'react';

import { get, isNil } from 'lodash';

import Button from '../../../../../commons/components/buttons/Button';
import RouteMap from '../../../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap';
import SFFilePreview from '../../../../../commons/components/SFFilePreview';
import ImgEditOn from '../../../../../commons/images/btnEditOn.svg';
import msg from '../../../../../commons/languages';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import ImgIconAttention from '@commons/images/icons/attention.svg';

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
  isRecordItemized,
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

import { SideFile } from '../../../../modules/ui/expenses/detail/sideFilePreview';

import './RecordBody.scss';

type Props = {
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  useImageQualityCheck: boolean;
  selectedMetadata: FileMetadata;
  record: ExpRequestRecord;
  report: ExpRequest;
  openRecordItemsConfirmDialog: () => void;
  setSelectedRecord: (arg0: number) => void;
  hideSideFile: () => void;
  setSideFile: (file: SideFile) => void;
  recordIdx: number;
  baseCurrencyCode?: string;
  expTaxTypeList?: any;
  isApexView?: boolean;
  useJctRegistrationNumber?: boolean;
};

const ROOT =
  'approvals-pc-expenses-request-pane-detail__records-area-record__body';

export default class RecordContentBody extends React.Component<Props> {
  onOpenSideFile = () => {
    const {
      receiptCreatedDate: createdDate,
      receiptDataType: dataType,
      receiptId: id,
      receiptTitle: name,
      receiptFileId: verId,
    } = this.props.record;

    // click the same pdf should trigger download popup
    this.props.hideSideFile();
    setTimeout(() => {
      this.props.setSideFile({ createdDate, dataType, id, name, verId });
    }, 1);
  };

  renderBaseCurrency() {
    const editImage = this.props.record.items[0].taxManual ? (
      <ImgEditOn aria-hidden="true" />
    ) : null;
    const amountWithoutGST = FormatUtil.formatNumber(
      this.props.record.items[0].withoutTax,
      this.props.baseCurrencyDecimal
    );
    const gstVat = FormatUtil.formatNumber(
      this.props.record.items[0].gstVat,
      this.props.baseCurrencyDecimal
    );
    let taxRate = this.props.record.items[0].taxRate;
    // @ts-ignore
    taxRate = isNil(taxRate) ? '-' : taxRate;

    return (
      <div className={`${ROOT}-item--divider`}>
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
    const editImage =
      isEditable && !isRecordItemized(record.recordType) ? (
        <ImgEditOn aria-hidden="true" />
      ) : null;

    const exchangeRate = isRecordItemized(record.recordType)
      ? '—'
      : record.items[0].exchangeRate;

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

  renderAttachment() {
    let attachmentContainer = null;
    const { useImageQualityCheck, selectedMetadata, record } = this.props;

    const {
      receiptId,
      receiptFileId,
      receiptDataType,
      receiptTitle = '',
      receiptCreatedDate = '',
    } = record;

    if (receiptId) {
      const isNotImageType = isNotImage(receiptDataType);
      const isPdf = isPDF(receiptDataType);

      const fileUrl = previewUrl(receiptFileId, isNotImageType);

      attachmentContainer = (
        <div className={`${ROOT}__receipt-preview`}>
          <div className={`${ROOT}__receipt-preview-body`}>
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
                onClick={this.onOpenSideFile}
              />
            )}
          </div>
        </div>
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

    return (
      <div className={`${ROOT}__receipt`}>
        {attachmentContainer}
        {useImageQualityCheck && metadata}
        {useImageQualityCheck && metadataWarningText && metadataWarning}
      </div>
    );
  }

  renderRecordItemsBtn() {
    return (
      <div className={`${ROOT}__record-items-check-btn-container`}>
        <Button
          onClick={() => {
            this.props.setSelectedRecord(this.props.recordIdx);
            this.props.openRecordItemsConfirmDialog();
          }}
          className={`${ROOT}__record-items-check-btn`}
        >
          {msg().Exp_Btn_RecordItemsCheck}
        </Button>
      </div>
    );
  }

  renderJob() {
    const { report, record } = this.props;
    let jobCode = report.jobCode;
    let jobName = report.jobName;
    const recordItem = record.items[0];
    if (recordItem.jobId) {
      jobCode = recordItem.jobCode;
      jobName = recordItem.jobName;
    }

    return (
      jobCode &&
      jobName && (
        <div className={`${ROOT}-item`}>
          <div className={`${ROOT}-item-title`}>{msg().Exp_Lbl_Job}</div>
          <div className={`${ROOT}-item-body`}>{`${jobCode} - ${jobName}`}</div>
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
    const jctInvoiceOption = get(record, 'items[0].jctInvoiceOption');

    if (!useJctRegistrationNumber || !isUseJctNo(jctRegistrationNumberUsage)) {
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
      <div className={`${ROOT}-item`}>
        <div className={`${ROOT}-item-title`}>{msg().Exp_Clbl_JCTInvoice}</div>
        <div className={`${ROOT}-item-body`}>{value}</div>
      </div>
    );
  };

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
      case 'HotelFee':
        const currencyArea = this.props.record.items[0].useForeignCurrency
          ? this.renderForeignCurrency()
          : this.renderBaseCurrency();
        renderArea = <React.Fragment>{currencyArea}</React.Fragment>;
        break;

      default:
        break;
    }

    const extendedItems = isRecordItemized(this.props.record.recordType)
      ? []
      : getLabelValueFromEIs(this.props.record.items[0]);

    return (
      <div className={ROOT}>
        {this.props.record.recordType === 'HotelFee' &&
          this.renderRecordItemsBtn()}
        {this.renderAttachment()}
        {renderArea}
        {this.renderJob()}
        {this.renderIcTransitDetail()}
        {this.renderMerchant()}
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
      </div>
    );
  }
}
