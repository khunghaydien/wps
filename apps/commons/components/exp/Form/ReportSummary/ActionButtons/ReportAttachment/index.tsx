import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {
  fileDownloadUrl,
  isNotImage,
  isPDF,
  previewUrl,
} from '../../../../../../../domain/models/exp/Receipt';
import {
  ATTACHMENT_MAX_COUNT,
  Report,
} from '../../../../../../../domain/models/exp/Report';

import FileUtil from '../../../../../../utils/FileUtil';

import IconAttach from '../../../../../../images/icons/attach.svg';
import IconDelete from '../../../../../../images/icons/close.svg';
import msg from '../../../../../../languages';
import LightboxModal from '../../../../../LightboxModal';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__actions';

export type ReportAttachmentProps = {
  openReceiptLibraryDialog?: () => void;
  updateReport?: (Object: Record<string, any>) => void;
};

type Props = ReportAttachmentProps & {
  errors?: any;
  expReport: Report;
  isExpense?: boolean;
  isFinanceApproval?: boolean;
  isReadOnlyApexPage?: boolean;
  isReportAttachmentRequired?: boolean;
  readOnly?: boolean;
};

const pinIcon = <IconAttach className={`${ROOT}__attach-icon`} />;

const getPreviewInfo = (attachedFileDataType, attachedFileId) => {
  const isPdf = isPDF(attachedFileDataType);
  const downloadUrl =
    isNotImage(attachedFileDataType) && fileDownloadUrl(attachedFileId);
  return { downloadUrl, isPdf };
};

const ReportAttachment = (props: Props) => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [showImgPreview, setShowImgPreview] = useState(false);
  const [previewIamgeUrl, setPreviewIamgeUrl] = useState('');

  const {
    expReport,
    openReceiptLibraryDialog,
    isFinanceApproval,
    updateReport,
    readOnly,
    isReportAttachmentRequired,
    isExpense,
    isReadOnlyApexPage,
  } = props;
  const attachedFileList = expReport.attachedFileList || [];
  const isNoAttachment = isEmpty(attachedFileList);
  const fileCount = attachedFileList.length;

  const hideAllBtn =
    !expReport.useFileAttachment ||
    (isFinanceApproval && isNoAttachment) ||
    (readOnly && isNoAttachment);
  const disableEdit = readOnly || isFinanceApproval;

  if (hideAllBtn) {
    return null;
  }

  const errorKey = get(props.errors, 'attachedFileList');

  const handlePreview = (attachedFileVerId, e) => {
    e.stopPropagation();
    const imageUrl = previewUrl(attachedFileVerId);
    setShowImgPreview(true);
    setPreviewIamgeUrl(imageUrl);
  };

  const deleteFile = (targetedFileId) => {
    if (updateReport) {
      const updateObj = attachedFileList.filter(
        ({ attachedFileId }) => attachedFileId !== targetedFileId
      );
      updateReport({ attachedFileList: updateObj });
    }
  };

  const renderName = (
    {
      attachedFileDataType,
      attachedFileName,
      attachedFileId,
      attachedFileVerId,
      attachedFileExtension,
    },
    parentClassName
  ) => {
    const { downloadUrl, isPdf } = getPreviewInfo(
      attachedFileDataType,
      attachedFileId
    );
    const originName =
      FileUtil.getOriginalFileNameWithoutPrefix(attachedFileName);
    const name = `${originName}.${
      attachedFileExtension || attachedFileDataType.toLowerCase()
    }`;
    const className = `${parentClassName}-name attached_file_name`;
    if (isPdf && isReadOnlyApexPage) {
      return (
        <div
          className={className}
          onClick={() => {
            window.open(downloadUrl, '_blank');
          }}
        >
          {name}
        </div>
      );
    } else if (isNotImage(attachedFileDataType)) {
      return (
        <div className={className}>
          <a href={downloadUrl} download={originName}>
            {name}
          </a>
        </div>
      );
    } else {
      return (
        <div
          className={className}
          onClick={(e) => handlePreview(attachedFileVerId, e)}
        >
          {name}
        </div>
      );
    }
  };

  const renderReceiptItem = (receipt) => {
    const { attachedFileId } = receipt;
    const className = disableEdit
      ? `${ROOT}__attached_item-button`
      : `${ROOT}__attached_item`;

    return (
      <div className={className}>
        {renderName(receipt, className)}
        {!disableEdit && (
          <div className={`${ROOT}__item_delete`}>
            <IconDelete
              aria-hidden="true"
              onClick={() => deleteFile(attachedFileId)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isReportAttachmentRequired && isExpense && (
        <span className="is-required">*&nbsp;</span>
      )}
      <div>
        <button
          type="button"
          className={`slds-button slds-button--icon ${ROOT}__attach attached`}
          onClick={() => setIsFileMenuOpen((prevIsOpen) => !prevIsOpen)}
          onBlur={() => {
            // use time out otherwise will block onClick dropdown item
            setTimeout(() => setIsFileMenuOpen(false), 300);
          }}
          data-testid={`${ROOT}-attach`}
        >
          {pinIcon}
          {!!fileCount && (
            <div
              className={`${ROOT}__attach-count`}
              data-testid={`${ROOT}-attach-count`}
            >
              {fileCount}
            </div>
          )}
        </button>
        {errorKey && (
          <div className={`${ROOT}__error-message`}>{msg()[errorKey]}</div>
        )}

        {isFileMenuOpen && (
          <div className={`${ROOT}__submenu receiptList align-left`}>
            {!disableEdit && (
              <button
                type="button"
                className={`${ROOT}__add_file`}
                disabled={fileCount === ATTACHMENT_MAX_COUNT}
                onClick={openReceiptLibraryDialog}
              >
                {msg().Exp_Lbl_AddFile}
              </button>
            )}
            {attachedFileList.map((receipt) => renderReceiptItem(receipt))}
          </div>
        )}
      </div>

      {showImgPreview && (
        <CSSTransition
          in={showImgPreview}
          timeout={500}
          classNames={`${ROOT}__modal-container`}
          unmountOnExit
        >
          <LightboxModal
            src={previewIamgeUrl}
            toggleLightbox={() => setShowImgPreview(false)}
          />
        </CSSTransition>
      )}
    </>
  );
};

export default ReportAttachment;
