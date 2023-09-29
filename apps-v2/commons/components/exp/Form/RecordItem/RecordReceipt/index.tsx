import React, { RefObject, useRef } from 'react';
import ReactDropzone from 'react-dropzone';

import Button from '@apps/commons/components/buttons/Button';
import TextUtil from '@apps/commons/utils/TextUtil';
import ImgIconAttention from '@commons/images/icons/attention.svg';

import {
  RECEIPT_TYPE,
  Record,
  RECORD_ATTACHMENT_MAX_COUNT,
  RECORD_TYPE,
} from '../../../../../../domain/models/exp/Record';
import {
  ALLOWED_MIME_TYPES,
  FileMetadata,
  getMetadataDisplay,
  getMetadataWarning,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from '@apps/domain/models/exp/Receipt';

import TrashIcon from '../../../../../images/icons/iconTrash.svg';
import msg from '../../../../../languages';
import IconButton from '../../../../buttons/IconButton';
import LabelWithHint from '../../../../fields/LabelWithHint';
import AttachmentPreview from '../../Dialog/AttachmentPreview/AttachmentGalleryPane/AttachmentPreview';
import { useAttachmentPreviewDialog } from '../../RecordList/BulkEdit/GridArea/GridProofCell/ActiveDialogProvider';

import './index.scss';

type Props = {
  canAddReceipts?: boolean;
  errors: { receiptList?: string };
  expRecord: Record;
  fileAttachment: string;
  fileMetadata: FileMetadata[];
  hintMsg?: string;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  maxReceipts?: number;
  readOnly: boolean;
  recordType: string;
  summaryField?: JSX.Element;
  targetRecord: string;
  touched: { receiptList?: boolean };
  useImageQualityCheck: boolean;
  onClickOpenLibraryButton: () => void;
  onDeleteFile: (receiptId: string) => void;
  onImageDrop: (files: Array<File>) => void;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
};

const ROOT = 'record-receipt';
export const RECORD_ATTACHMENT_MAX_COUNT_ERROR = 'Exp_Lbl_SelectMultipleFiles';

type ReactDropzoneRefType = RefObject<ReactDropzone> &
  RefObject<HTMLDivElement>;

const RecordReceipt = (props: Props) => {
  const dropzoneRef = useRef() as ReactDropzoneRefType;
  const { updateSelectedAttachedFileId } = useAttachmentPreviewDialog();

  const handleDropAccepted = (files: File[]) => {
    const { setFieldError, setFieldTouched, targetRecord } = props;
    const { receiptList } = props.expRecord;
    if (
      files.length >
      RECORD_ATTACHMENT_MAX_COUNT - (receiptList || []).length
    ) {
      const error = RECORD_ATTACHMENT_MAX_COUNT_ERROR;
      setFieldError(`report.${targetRecord}.receiptList`, error);
      setFieldTouched(`report.${targetRecord}.receiptList`, true, false);
    } else props.onImageDrop(files);
  };

  const handleDropRejected = (rejectedFiles: any) => {
    const { setFieldError, setFieldTouched, targetRecord } = props;
    const rejectedFile = rejectedFiles[0];
    let error = 'Common_Err_Required';
    if (rejectedFile.size < MIN_FILE_SIZE) {
      error = 'Common_Err_InvalidType';
    }

    if (rejectedFile.size > MAX_FILE_SIZE) {
      error = 'Common_Err_MaxFileSize';
    }

    setFieldError(`report.${targetRecord}.receiptList`, error);
    setFieldTouched(`report.${targetRecord}.receiptList`, true, false);
  };

  const isRequired = () => {
    const { fileAttachment, isExpenseRequest } = props;
    const isNotRequired = fileAttachment !== RECEIPT_TYPE.Required;
    return !(isNotRequired || isExpenseRequest);
  };

  const renderDeleteButton = (receiptId: string) => {
    return (
      receiptId &&
      !props.readOnly &&
      !props.isFinanceApproval && (
        <IconButton
          src={TrashIcon}
          srcType="svg"
          className={`${ROOT}__button--delete`}
          data-testid={`${ROOT}__button--delete`}
          onClick={() => props.onDeleteFile(receiptId)}
        />
      )
    );
  };

  const renderAttachmentErrMsg = () => {
    const { errors, touched } = props;

    const attachmentError = errors?.receiptList || '';
    const isAttachmentTouched = touched?.receiptList || false;

    if (!attachmentError) {
      return null;
    }

    const attachmentErrorMsg =
      attachmentError === RECORD_ATTACHMENT_MAX_COUNT_ERROR
        ? TextUtil.template(
            msg()[RECORD_ATTACHMENT_MAX_COUNT_ERROR],
            RECORD_ATTACHMENT_MAX_COUNT
          )
        : msg()[attachmentError];

    return (
      isAttachmentTouched && (
        <div className="value">
          <div data-testid={`${ROOT}-feedback`} className="input-feedback">
            {attachmentErrorMsg}
          </div>
        </div>
      )
    );
  };

  const renderReceiptsFieldLabel = () => {
    const { isExpenseRequest, hintMsg, readOnly, isFinanceApproval } = props;
    const attachmentLabel = isExpenseRequest
      ? msg().Exp_Lbl_Quotations
      : msg().Exp_Lbl_Receipts;

    return (
      <LabelWithHint
        text={attachmentLabel}
        hintMsg={(!readOnly && !isFinanceApproval && hintMsg) || ''}
        isRequired={isRequired()}
      />
    );
  };

  const renderDropZone = () => {
    const { expRecord, onClickOpenLibraryButton, maxReceipts, canAddReceipts } =
      props;
    const { receiptList } = expRecord || {};
    const isReachedMaxReceiptCount =
      receiptList && receiptList.length === maxReceipts;

    const disableDropZone = isReachedMaxReceiptCount || !canAddReceipts;

    return (
      <div className={props.summaryField ? `${ROOT}__field-container` : ''}>
        <div className={`${ROOT}__dropzone`}>
          {renderReceiptsFieldLabel()}
          <ReactDropzone
            ref={dropzoneRef}
            className={`${ROOT}__file`}
            accept={ALLOWED_MIME_TYPES.join()}
            onDropAccepted={handleDropAccepted}
            onDropRejected={handleDropRejected}
            disabled={disableDropZone}
            multiple={true}
            maxSize={MAX_FILE_SIZE}
            minSize={MIN_FILE_SIZE}
            disableClick
          >
            <Button
              type="primary"
              className={`${ROOT}__button ts-button`}
              disabled={disableDropZone}
              onClick={() => {
                dropzoneRef?.current?.open();
              }}
            >
              {msg().Exp_Lbl_ChooseFile}
            </Button>

            <Button
              type="primary"
              className={`${ROOT}__button ts-button`}
              data-testid={`${ROOT}-button--file`}
              onClick={(e) => {
                e.stopPropagation();
                onClickOpenLibraryButton();
              }}
              disabled={disableDropZone}
            >
              {msg().Exp_Lbl_SelectReceiptLibrary}
            </Button>

            <span className={`${ROOT}__label`}>{`${
              msg().Exp_Lbl_OrDragFilesHere
            } [${
              (receiptList || []).length
            }/${RECORD_ATTACHMENT_MAX_COUNT}]`}</span>

            <span className={`${ROOT}__label`}>{`(${
              msg().Exp_Lbl_UpToThreeFiles
            })`}</span>
            {renderAttachmentErrMsg()}
          </ReactDropzone>
        </div>
        {props.summaryField}
      </div>
    );
  };

  const renderFileInput = (receipt) => {
    let container;
    const { receiptFileId, receiptId, receiptDataType, receiptTitle } = receipt;
    if (receiptFileId) {
      const contentDocumentId = receiptId;
      const selectedMetadata = props.fileMetadata.find(
        (x) => x.contentDocumentId === contentDocumentId
      );
      const metadataWarning = TextUtil.nl2br(
        getMetadataWarning(selectedMetadata, props.isExpenseRequest)
      );
      const { useImageQualityCheck } = props;

      container = (
        <div key={receiptId} className={`${ROOT}__receipt-container`}>
          <AttachmentPreview
            height={180}
            attachment={{
              attachedFileVerId: receiptFileId,
              attachedFileDataType: receiptDataType,
              attachedFileName: receiptTitle,
            }}
            onClick={() => {
              updateSelectedAttachedFileId(receiptFileId);
            }}
          />
          {renderDeleteButton(receiptId)}
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
      );
    }

    return container;
  };

  const { recordType, expRecord, fileAttachment, canAddReceipts } = props;

  const isNotOptional = fileAttachment !== RECEIPT_TYPE.Optional;

  const isReceiptAllowedByExpType = (): boolean => {
    switch (recordType) {
      case RECORD_TYPE.General:
      case RECORD_TYPE.FixedAllowanceSingle:
        return true;
      default:
        return false;
    }
  };

  if (!isReceiptAllowedByExpType && isNotOptional) {
    return null;
  }

  const { receiptList } = expRecord;

  return (
    <div className={`${ROOT}`}>
      {canAddReceipts && renderDropZone()}
      {receiptList.length > 0 && (
        <>
          {!canAddReceipts && renderReceiptsFieldLabel()}
          <div className={`${ROOT}__input`} data-testid={`${ROOT}-input`}>
            {(receiptList || []).map((receipt) => renderFileInput(receipt))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecordReceipt;
