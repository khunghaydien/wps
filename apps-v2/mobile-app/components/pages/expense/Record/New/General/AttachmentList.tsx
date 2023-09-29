import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import TextUtil from '@apps/commons/utils/TextUtil';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import msg from '@commons/languages';
import FilePreview from '@mobile/components/molecules/commons/FilePreview';

import {
  ALLOWED_MIME_TYPES,
  Base64FileList,
  FileMetadata,
  getMetadata,
  getMetadataDisplay,
  getMetadataWarning,
  MAX_FILE_SIZE,
} from '@apps/domain/models/exp/Receipt';
import {
  RECEIPT_TYPE,
  Record,
  RECORD_ATTACHMENT_MAX_COUNT,
} from '@apps/domain/models/exp/Record';

import Errors from '@mobile/components/atoms/Errors';
import IconButton from '@mobile/components/atoms/IconButton';
import Label from '@mobile/components/atoms/Label';
import UploadOptionsModal from '@mobile/components/organisms/expense/UploadOptionsModal';

import './AttachmentList.scss';

type Props = {
  receiptList?: Array<{
    receiptDataType?: string;
    receiptFileId?: string;
    receiptId?: string;
    receiptTitle?: string;
    receiptCreatedDate?: string;
  }>;
  readOnly?: boolean;
  receiptConfig: string;
  errors: string[];
  isRequest?: boolean;
  selectedMetadatas: Array<FileMetadata>;
  useImageQualityCheck: boolean;
  record: Record;
  openReceiptLibrary: () => void;
  getBase64files: (file: any) => Base64FileList;
  uploadReceipts: (list: Base64FileList) => Array<{
    contentVersionId: string;
    contentDocumentId: string;
  }>;
  saveFileMetadatas: (fileMetadata: Array<FileMetadata>) => void;
  onChangeUpdateValues: (arg0: {
    receiptList: Array<{
      receiptId: string | null;
      receiptFileId: string | null;
      receiptDataType: string | null;
      receiptTitle: string | null;
    }>;
  }) => void;
};

const ROOT = 'mobile-app-pages-expense-page-record-new-general-attachment';

const Attachment = (props: Props) => {
  const [isMaxFilesReached, setIsMaxFilesReached] = useState(false);
  const [isLargeFile, setIsLargeFile] = useState(false);
  const [isInvalidFileType, setIsInvalidFileType] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    receiptList,
    readOnly,
    receiptConfig,
    errors,
    isRequest,
    useImageQualityCheck,
  } = props;

  const receiptOptional = receiptConfig === RECEIPT_TYPE.Optional;
  const receiptRequired = receiptConfig === RECEIPT_TYPE.Required;

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { receiptList } = props;
    const { files } = e.currentTarget;
    if (
      e.currentTarget.files.length >
      RECORD_ATTACHMENT_MAX_COUNT - (receiptList || []).length
    ) {
      setIsModalOpen(false);
      setIsMaxFilesReached(true);
      return;
    }
    const base64Files: Base64FileList = await props.getBase64files(e);
    let isError = false;
    base64Files.forEach((base64File) => {
      const isLarge = base64File.size > MAX_FILE_SIZE;
      const isInvalidType = !ALLOWED_MIME_TYPES.includes(base64File.type);
      setIsLargeFile(isLarge);
      setIsInvalidFileType(isInvalidType);
      if (isLarge || isInvalidType) {
        isError = true;
      }
    });
    if (isError) {
      setIsModalOpen(false);
      return;
    }
    const updloadReceiptsRes = await props.uploadReceipts(base64Files);
    const receiptListClone = cloneDeep(receiptList || []);
    if (updloadReceiptsRes) {
      const fileMetadatas = [];
      for (let i = 0; i < updloadReceiptsRes.length; i++) {
        const file = files[i];
        const res = updloadReceiptsRes[i];
        const base64File = base64Files[i];
        const { contentDocumentId, contentVersionId } = res;
        const metadata = await getMetadata(file);
        if (metadata) {
          fileMetadatas.push({
            ...metadata,
            contentDocumentId,
          });
        }
        const receiptIndex = receiptListClone.length;
        let updateFileInfo;
        if (res) {
          updateFileInfo = {
            receiptId: contentDocumentId,
            receiptFileId: contentVersionId,
            receiptDataType: base64File.type,
            receiptTitle: base64File.name,
          };

          if (updateFileInfo) {
            if (receiptListClone.length === 0) {
              receiptListClone.push(updateFileInfo);
            } else {
              receiptListClone[receiptIndex] = updateFileInfo;
            }
          }
        }
      }
      props.saveFileMetadatas(fileMetadatas);
    }
    // @ts-ignore
    props.onChangeUpdateValues({ receiptList: receiptListClone });
    setIsModalOpen(false);
  };

  const handleDeleteFile = (id: string) => {
    const { record, receiptList } = props;
    const { ocrDate } = record;
    const receiptListClone = cloneDeep(receiptList);
    const receiptIndex = receiptList.findIndex(
      ({ receiptId }) => receiptId === id
    );
    const isOCRReceiptRemoved = receiptIndex === 0 && !isNil(ocrDate);
    const ocrUpdate: { ocrAmount?: number; ocrDate?: number } = {};
    if (isOCRReceiptRemoved) {
      ocrUpdate.ocrAmount = undefined;
      ocrUpdate.ocrDate = undefined;
    }
    receiptListClone.splice(receiptIndex, 1);
    setIsLargeFile(false);
    setIsInvalidFileType(false);
    setIsMaxFilesReached(false);
    // @ts-ignore
    props.onChangeUpdateValues({ receiptList: receiptListClone, ...ocrUpdate });
  };

  if (!receiptRequired && !receiptOptional) {
    return null;
  }

  const errorMsg = isEmpty(errors) ? null : <Errors messages={errors} />;

  const renderAddReceiptButton = () => (
    <div className={ROOT}>
      <div className={`${ROOT}__wrapper`}>
        {isMaxFilesReached && (
          <div className={`${ROOT}__error`}>
            {TextUtil.template(
              msg().Exp_Lbl_SelectMultipleFiles,
              RECORD_ATTACHMENT_MAX_COUNT
            )}
          </div>
        )}
        {isLargeFile && (
          <div className={`${ROOT}__error`}>{msg().Common_Err_MaxFileSize}</div>
        )}
        {isInvalidFileType && (
          <div className={`${ROOT}__error`}>{msg().Common_Err_InvalidType}</div>
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
            multiple
            closeOnUpload={false}
            title={msg().Exp_Btn_UploadFile}
          />
        )}
      </div>
    </div>
  );

  const renderReceipt = (receipt: {
    receiptDataType?: string;
    receiptFileId?: string;
    receiptId?: string;
    receiptTitle?: string;
    receiptCreatedDate?: string;
  }) => {
    const {
      receiptTitle,
      receiptId,
      receiptFileId,
      receiptDataType,
      receiptCreatedDate,
    } = receipt;
    const { selectedMetadatas } = props;
    const selectedMetadata = (selectedMetadatas || []).find(
      (m) => m.contentDocumentId === receiptId
    );
    const metadata = useImageQualityCheck && (
      <div className={`${ROOT}__metadata`}>
        {getMetadataDisplay(selectedMetadata)}
      </div>
    );
    const metadataWarningText = TextUtil.nl2br(
      getMetadataWarning(selectedMetadata, isRequest)
    );
    const metadataWarning = props.useImageQualityCheck &&
      metadataWarningText && (
        <div className={`${ROOT}__metadata-warning`}>
          <ImgIconAttention className={`${ROOT}__metadata-warning-svg`} />
          <span className={`${ROOT}__metadata-warning-msg`}>
            {metadataWarningText}
          </span>
        </div>
      );
    if (readOnly)
      return (
        <React.Fragment key={receipt.receiptId}>
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
          {metadata}
          {metadataWarning}
        </React.Fragment>
      );
    return (
      <div className={ROOT} key={receipt.receiptId}>
        <div className={`${ROOT}__preview`}>
          <FilePreview
            className={ROOT}
            title={receiptTitle}
            id={receiptId}
            fileId={receiptFileId}
            dataType={receiptDataType}
            uploadedDate={receiptCreatedDate}
            openExternal
          />
          <IconButton
            className={`${ROOT}__preview-delete`}
            icon="clear"
            onClick={() => handleDeleteFile(receiptId)}
            disabled={readOnly}
            size="large"
          />
          {metadata}
          {metadataWarning}
        </div>
      </div>
    );
  };

  const canShowAddReceiptButton =
    !readOnly &&
    receiptList &&
    receiptList.length < RECORD_ATTACHMENT_MAX_COUNT;

  return (
    <>
      <Label
        className={`${ROOT}__title`}
        text={isRequest ? msg().Exp_Lbl_Quotations : msg().Exp_Lbl_Receipts}
        marked={!isRequest && receiptRequired}
      />
      {canShowAddReceiptButton && renderAddReceiptButton()}
      {(receiptList || []).map((receipt) => {
        return renderReceipt(receipt);
      })}
      {errorMsg}
    </>
  );
};

export default Attachment;
