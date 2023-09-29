import React, { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '../../../../../../../commons/languages';
import FilePreview from '../../../../../molecules/commons/FilePreview';
import TextUtil from '@apps/commons/utils/TextUtil';
import ImgIconAttention from '@commons/images/icons/attention.svg';

import {
  ALLOWED_MIME_TYPES,
  Base64FileList,
  FileMetadata,
  getMetadata,
  getMetadataDisplay,
  getMetadataWarning,
  MAX_FILE_SIZE,
} from '../../../../../../../domain/models/exp/Receipt';
import { RECEIPT_TYPE } from '../../../../../../../domain/models/exp/Record';

import { AppAction } from '@apps/mobile-app/action-dispatchers/AppThunk';

import Errors from '../../../../../atoms/Errors';
import Label from '../../../../../atoms/Label';
import TextButton from '../../../../../atoms/TextButton';
import UploadOptionsModal from '../../../../../organisms/expense/UploadOptionsModal';

import './Attachment.scss';

type Props = {
  receiptFileId?: string;
  receiptId?: string;
  receiptDataType?: string;
  receiptTitle?: string;
  receiptCreatedDate?: string;
  readOnly?: boolean;
  receiptConfig: string;
  errors: string[];
  isRequest?: boolean;
  selectedMetadata: FileMetadata;
  useImageQualityCheck: boolean;
  openReceiptLibrary: () => void;
  getBase64files: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => AppAction<Promise<Base64FileList>>;
  uploadReceipts: (list: Base64FileList) => AppAction<
    Promise<{
      contentVersionId: string;
      contentDocumentId: string;
    }>
  >;
  saveFileMetadata: (fileMetadata: FileMetadata) => void;
  onChangeUpdateValues: (arg0: {
    receiptId: string | null;
    receiptFileId: string | null;
    receiptDataType: string | null;
    receiptTitle: string | null;
  }) => void;
};

const ROOT = 'mobile-app-pages-expense-page-record-new-general-attachment';

const Attachment = (props: Props) => {
  const [isLargeFile, setIsLargeFile] = useState(false);
  const [isInvalidFileType, setIsInvalidFileType] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    receiptFileId,
    receiptTitle,
    receiptId,
    receiptDataType,
    receiptCreatedDate,
    readOnly,
    receiptConfig,
    errors,
    isRequest,
    useImageQualityCheck,
  } = props;

  const receiptOptional = receiptConfig === RECEIPT_TYPE.Optional;
  const receiptRequired = receiptConfig === RECEIPT_TYPE.Required;

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files[0];
    // @ts-ignore
    props.getBase64files(e).then((base64Files) => {
      const isLarge = base64Files[0].size > MAX_FILE_SIZE;
      const isInvalidType = !ALLOWED_MIME_TYPES.includes(base64Files[0].type);
      setIsLargeFile(isLarge);
      setIsInvalidFileType(isInvalidType);
      if (isLarge || isInvalidType) {
        return;
      }
      // @ts-ignore
      props.uploadReceipts(base64Files).then(async (res) => {
        // now record only support single file attachment
        const { contentDocumentId, contentVersionId } = res[0];
        let updateFileInfo;
        if (res) {
          updateFileInfo = {
            receiptId: contentDocumentId,
            receiptFileId: contentVersionId,
            receiptDataType: base64Files[0].type,
            receiptTitle: base64Files[0].name,
          };

          const metadata = await getMetadata(file);
          if (metadata) {
            props.saveFileMetadata({
              ...metadata,
              contentDocumentId,
            });
          }
        } else {
          updateFileInfo = {
            receiptId: null,
            receiptFileId: null,
            receiptDataType: null,
            receiptTitle: null,
          };
        }
        props.onChangeUpdateValues(updateFileInfo);
      });
    });
  };

  const handleDeleteFile = () => {
    setIsLargeFile(false);
    setIsInvalidFileType(false);
    const resetFileInfo = {
      receiptId: null,
      receiptFileId: null,
      receiptDataType: null,
      receiptTitle: null,
      receiptCreatedDate: null,
      ocrAmount: null,
      ocrDate: null,
    };
    props.onChangeUpdateValues(resetFileInfo);
  };

  if (!receiptRequired && !receiptOptional) {
    return null;
  }

  const title = (
    <Label
      className={`${ROOT}__title`}
      text={isRequest ? msg().Exp_Lbl_Quotation : msg().Exp_Lbl_Receipt}
      marked={!isRequest && receiptRequired}
    />
  );

  const errorMsg = isEmpty(errors) ? null : <Errors messages={errors} />;

  const metadata = useImageQualityCheck && (
    <div className={`${ROOT}__metadata`}>
      {getMetadataDisplay(props.selectedMetadata)}
    </div>
  );
  const metadataWarningText = TextUtil.nl2br(
    getMetadataWarning(props.selectedMetadata, isRequest)
  );
  const metadataWarning = props.useImageQualityCheck && metadataWarningText && (
    <div className={`${ROOT}__metadata-warning`}>
      <ImgIconAttention className={`${ROOT}__metadata-warning-svg`} />
      <span className={`${ROOT}__metadata-warning-msg`}>
        {metadataWarningText}
      </span>
    </div>
  );

  let attachmentContainer = null;
  if (readOnly) {
    attachmentContainer = (
      <FilePreview
        className={ROOT}
        title={receiptTitle}
        id={receiptId}
        fileId={receiptFileId}
        dataType={receiptDataType}
        uploadedDate={receiptCreatedDate}
        openExternal
        imgAltText={isRequest ? msg().Exp_Lbl_Quotation : undefined}
      />
    );
  } else if (!receiptFileId) {
    attachmentContainer = (
      <div className={ROOT}>
        <div className={`${ROOT}__wrapper`}>
          {isLargeFile && (
            <div className={`${ROOT}__error`}>
              {msg().Common_Err_MaxFileSize}
            </div>
          )}
          {isInvalidFileType && (
            <div className={`${ROOT}__error`}>
              {msg().Common_Err_InvalidType}
            </div>
          )}
          <label
            className={`${ROOT}__label`}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {isRequest ? msg().Exp_Btn_AddQuotation : msg().Exp_Btn_AddReceipt}
          </label>
          {isModalOpen && (
            <UploadOptionsModal
              className={ROOT}
              handleAttachFile={handleAttachFile}
              openReceiptLibrary={props.openReceiptLibrary}
              closeModal={() => {
                setIsModalOpen(false);
              }}
              title={msg().Exp_Btn_UploadFile}
            />
          )}
        </div>
      </div>
    );
  } else {
    attachmentContainer = (
      <div className={ROOT}>
        <FilePreview
          className={ROOT}
          title={receiptTitle}
          id={receiptId}
          fileId={receiptFileId}
          dataType={receiptDataType}
          uploadedDate={receiptCreatedDate}
          openExternal
        />
        <TextButton onClick={handleDeleteFile} className={`${ROOT}__delete`}>
          {isRequest
            ? msg().Exp_Lbl_DeleteQuotation
            : msg().Exp_Lbl_DeleteReceipt}
        </TextButton>
      </div>
    );
  }

  return (
    <>
      {title}
      {attachmentContainer}
      {errorMsg}
      {metadata}
      {metadataWarning}
    </>
  );
};

export default Attachment;
