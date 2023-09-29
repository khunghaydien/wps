import React from 'react';

import { cloneDeep, set } from 'lodash';

import TextUtil from '@apps/commons/utils/TextUtil';
import ImgIconAttention from '@commons/images/icons/attention.svg';

import {
  ALLOWED_MIME_TYPES,
  FileMetadata,
  getMetadataDisplay,
  getMetadataWarning,
  isNotImage,
  MAX_FILE_SIZE,
  previewUrl,
} from '../../../../../../domain/models/exp/Receipt';
import {
  RECEIPT_TYPE,
  Record,
  RECORD_TYPE,
} from '../../../../../../domain/models/exp/Record';

import DeleteIcon from '../../../../../images/icons/iconTrash.svg';
import msg from '../../../../../languages';
import IconButton from '../../../../buttons/IconButton';
import Dropzone from '../../../../fields/Dropzone';
import LabelWithHint from '../../../../fields/LabelWithHint';
import Lightbox from '../../../../Lightbox';
import SFFilePreview from '../../../../SFFilePreview';

import './index.scss';

type Props = {
  errors: { receiptId?: string };
  expRecord: Record;
  fileAttachment: string;
  fileMetadata: FileMetadata[];
  hintMsg?: string;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  readOnly: boolean;
  recordType: string;
  targetRecord: string;
  touched: { receiptId?: string };
  useImageQualityCheck: boolean;
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2: any,
    arg3: any
  ) => void;
  onClickOpenLibraryButton: () => void;
  onImageDrop: (files: File) => void;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
};

const ROOT = 'record-receipt';

export default class RecordReceipt extends React.Component<Props> {
  updateRecord(updateObj: any) {
    const tmpRecord = cloneDeep(this.props.expRecord);
    const tmpTouched = cloneDeep(this.props.touched);

    Object.keys(updateObj as any).forEach((key) => {
      set(tmpRecord, key, updateObj[key]);
      set(tmpTouched, key, true);
    });

    this.props.onChangeEditingExpReport(
      this.props.targetRecord,
      tmpRecord,
      false,
      tmpTouched
    );
  }

  handleDropAccepted = (files: File[]) => {
    this.props.onImageDrop(files[0]);
  };

  handleDropRejected = (rejectedFiles: any) => {
    const { setFieldError, setFieldTouched, targetRecord } = this.props;
    const rejectedFile = rejectedFiles[0];
    let error = 'Common_Err_Required';

    if (rejectedFile.size > MAX_FILE_SIZE) {
      error = 'Common_Err_MaxFileSize';
    }

    setFieldError(`report.${targetRecord}.receiptId`, error);
    setFieldTouched(`report.${targetRecord}.receiptId`, true, false);
  };

  handleDeleteFile = () => {
    this.updateRecord({
      receiptId: null,
      receiptFileId: null,
      receiptTitle: null,
      receiptDataType: null,
      ocrAmount: null,
      ocrDate: null,
    });
  };

  isRequired() {
    const { fileAttachment, isExpenseRequest } = this.props;
    const isNotRequired = fileAttachment !== RECEIPT_TYPE.Required;
    return !(isNotRequired || isExpenseRequest);
  }

  renderDeleteButton = () => {
    return (
      this.props.expRecord.receiptId &&
      !this.props.readOnly &&
      !this.props.isFinanceApproval && (
        <IconButton
          src={DeleteIcon}
          srcType="svg"
          className={`${ROOT}__button--delete ts-button`}
          data-testid={`${ROOT}__button--delete`}
          onClick={this.handleDeleteFile}
        />
      )
    );
  };

  renderFileInput = (receiptFileId = '') => {
    const { expRecord, isFinanceApproval, fileAttachment } = this.props;
    const isReceiptOptional = fileAttachment === RECEIPT_TYPE.Optional;
    let container: React.ReactNode =
      isFinanceApproval && isReceiptOptional ? msg().Com_Lbl_NoReceipt : '';

    if (!isFinanceApproval && !receiptFileId) {
      container = (
        <Dropzone
          className={`${ROOT}__file`}
          accept={ALLOWED_MIME_TYPES.join()}
          onDropAccepted={this.handleDropAccepted}
          onDropRejected={this.handleDropRejected}
          disabled={this.props.readOnly}
          multiple={false}
          maxSize={MAX_FILE_SIZE}
        >
          <div className={`${ROOT}__file-label`}>
            <p>{msg().Exp_Lbl_DragAndDrop}</p>
            <button type="button" className={`${ROOT}__button--file ts-button`}>
              {msg().Exp_Lbl_ChooseFile}
            </button>
          </div>
        </Dropzone>
      );
    }
    if (expRecord.receiptFileId) {
      const isNotImageType = isNotImage(expRecord.receiptDataType);
      const imgUrl = previewUrl(expRecord.receiptFileId, false);

      container = (
        <React.Fragment>
          {isNotImageType ? (
            <SFFilePreview
              fileType={expRecord.receiptDataType}
              receiptId={expRecord.receiptId || ''}
              receiptFileId={expRecord.receiptFileId || ''}
              uploadedDate={expRecord.receiptCreatedDate || ''}
              fileName={expRecord.receiptTitle || ''}
              withDownloadLink
            />
          ) : (
            <Lightbox>
              <img
                alt="Receipt"
                className="lightbox-img-thumbnail"
                src={imgUrl}
              />
            </Lightbox>
          )}
        </React.Fragment>
      );
    }

    return container;
  };

  render() {
    const {
      errors,
      touched,
      recordType,
      expRecord,
      fileAttachment,
      hintMsg,
      useImageQualityCheck,
    } = this.props;

    const isNotOptional = fileAttachment !== RECEIPT_TYPE.Optional;

    const isReceiptAllowedByExpType = (): boolean => {
      switch (recordType) {
        case RECORD_TYPE.General:
        case RECORD_TYPE.HotelFee:
        case RECORD_TYPE.FixedAllowanceSingle:
          return true;
        default:
          return false;
      }
    };

    if (!isReceiptAllowedByExpType && isNotOptional) {
      return null;
    }

    const attachmentError = errors.receiptId;
    const isAttachmentTouched = touched.receiptId || false;
    const attachmentLabel = this.props.isExpenseRequest
      ? msg().Exp_Lbl_Quotation
      : msg().Exp_Lbl_Receipt;
    const contentDocumentId = expRecord.receiptId;
    const selectedMetadata = this.props.fileMetadata.find(
      (x) => x.contentDocumentId === contentDocumentId
    );
    const metadataWarning = TextUtil.nl2br(
      getMetadataWarning(selectedMetadata, this.props.isExpenseRequest)
    );

    return (
      <div className={`${ROOT}`}>
        <LabelWithHint
          text={attachmentLabel}
          hintMsg={
            (!this.props.readOnly &&
              !this.props.isFinanceApproval &&
              hintMsg) ||
            ''
          }
          isRequired={this.isRequired()}
        />
        <div className={`${ROOT}__input`} data-testid={`${ROOT}-input`}>
          {this.renderFileInput(expRecord.receiptFileId)}
          {!this.props.isExpenseRequest && !this.props.isFinanceApproval ? (
            <div className={`${ROOT}__input-action`}>
              <button
                type="button"
                className={`${ROOT}__button--file ts-button`}
                data-testid={`${ROOT}-button--file`}
                onClick={this.props.onClickOpenLibraryButton}
                disabled={this.props.readOnly}
              >
                {msg().Exp_Lbl_SelectReceiptLibrary}
              </button>
              {this.renderDeleteButton()}
            </div>
          ) : (
            this.renderDeleteButton()
          )}

          {attachmentError && isAttachmentTouched && (
            <div className="value">
              <div data-testid={`${ROOT}-feedback`} className="input-feedback">
                {msg()[attachmentError]}
              </div>
            </div>
          )}

          {useImageQualityCheck && (
            <div className={`${ROOT}__metadata`}>
              {getMetadataDisplay(selectedMetadata)}
            </div>
          )}
          {useImageQualityCheck && metadataWarning && (
            <div className={`${ROOT}__metadata-warning`}>
              <ImgIconAttention className={`${ROOT}__metadata-warning-svg`} />
              <span className={`${ROOT}__metadata-warning-msg`}>
                {metadataWarning}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
