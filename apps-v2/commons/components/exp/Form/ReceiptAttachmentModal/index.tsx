import React, { ReactElement, useEffect, useState } from 'react';

import uniqueId from 'lodash/uniqueId';

import styled from 'styled-components';

import { Button } from '@apps/core';
import IconDelete from '@commons/images/icons/close.svg';
import msg from '@commons/languages';
import ExpColors from '@commons/styles/exp/variables/_colors.scss';
import FileUtil from '@commons/utils/FileUtil';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import {
  fileDownloadUrl,
  isNotImage,
  isPDF,
} from '@apps/domain/models/exp/Receipt';
import { Receipt } from '@apps/domain/models/exp/Record';
import { ATTACHMENT_MAX_COUNT } from '@apps/domain/models/exp/Report';

import AttachmentPreviewDialog from '../Dialog/AttachmentPreview';
import { useAttachmentPreviewDialog } from '../RecordList/BulkEdit/GridArea/GridProofCell/ActiveDialogProvider';

type Props = {
  alignFileMenu?: 'left' | 'right';
  attachedFileList: AttachedFile[] | Receipt[];
  isDisableEdit?: boolean;
  isFileMenuOpen: boolean;
  isFinanceApproval?: boolean;
  isReadOnlyApexPage?: boolean;
  isReportHeader?: boolean;
  deleteFile: (fileId: string) => void;
  openApprovalReceiptPreview?: (receipt: Receipt) => void;
  openReceiptLibraryDialog: () => void;
  openRecordAttachmentPreview?: (selectedAttachedFileId: string) => void;
};

const S = {
  AddButton: styled(Button)`
    height: 35px;
    border: none;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    border-bottom: #e3e3e3 1px solid;
    border-radius: 3px 3px 0 0;

    &:active {
      border-bottom-color: #e3e3e3;
    }
  `,
  DeleteButton: styled.button`
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 3px;
    cursor: pointer;
    border: none;
    position: absolute;
    right: 10px;
    padding: 0;
    background-color: transparent;

    svg {
      path {
        fill: #0070d2;
      }
    }

    &:active {
      background-color: ${ExpColors.backgroundGray};
    }

    svg {
      transform: scale(0.8);
    }
  `,
  FileMenu: styled.div<{ align: Props['alignFileMenu'] }>`
    width: 276px;
    position: absolute;
    z-index: 3;
    border: 1px solid #dddbda;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 16%);
    margin-top: 2px;

    ${({ align }) => {
      return align === 'left' ? 'left: 0' : 'right: 0';
    }}
  `,
  FileName: styled.div`
    word-wrap: break-word;
    cursor: pointer;
    padding: 10px;
    text-align: left;
    color: ${ExpColors.buttonPrimary};
    width: 92%;

    &:hover,
    a:hover {
      text-decoration: underline;
    }
  `,
  ReceiptItem: styled.div<{ isDisabled: boolean }>`
    ${({ isDisabled }): string =>
      isDisabled
        ? `
        min-height: 35px;
        border-bottom: #e3e3e3 1px solid;
        align-items: center;
        `
        : `
        display: flex;
        padding: 4px 10px 4px 0;
        min-height: 35px;
        border-bottom: #e3e3e3 1px solid;
        align-items: center;
      `}
  `,
};
S.AddButton.displayName = 'ts-expenses__form-report-summary__actions__add_file';
S.DeleteButton.displayName =
  'ts-expenses__form-report-summary__actions__item_delete';
S.FileName.displayName =
  'ts-expenses__form-report-summary__actions__attached_item-name';

const getPreviewInfo = (attachedFileDataType, attachedFileId) => {
  const isPdf = isPDF(attachedFileDataType);
  const downloadUrl =
    isNotImage(attachedFileDataType) && fileDownloadUrl(attachedFileId);
  return { downloadUrl, isPdf };
};

const ReceiptAttachmentModal = ({
  alignFileMenu = 'left',
  attachedFileList,
  isDisableEdit,
  isFileMenuOpen,
  isReadOnlyApexPage,
  isReportHeader,
  deleteFile,
  openApprovalReceiptPreview,
  openReceiptLibraryDialog,
  openRecordAttachmentPreview,
  isFinanceApproval,
}: Props): ReactElement => {
  const [attachmentPreviewDialogId, setAttachmentPreviewDialogId] =
    useState('');
  const [selectedAttachedFileId, setSelectedAttachedFileId] = useState<
    AttachedFile['attachedFileVerId'] | undefined
  >();
  const { enableActiveDialog, activeDialogId, updateActiveDialogId } =
    useAttachmentPreviewDialog();

  const fileCount = attachedFileList.length;

  useEffect(() => {
    if (enableActiveDialog) {
      const uniqueIdStr = uniqueId('BulkEditAttachmentPreviewDialog');
      setAttachmentPreviewDialogId(uniqueIdStr);
    }
  }, []);

  const renderName = (
    attachedFileDataType: string,
    attachedFileName: string,
    attachedFileId: string,
    attachedFileVerId: string,
    attachedFileExtension: string,
    attachedFileCreatedDate?: string
  ) => {
    const { downloadUrl } = getPreviewInfo(
      attachedFileDataType,
      attachedFileId
    );
    const originName =
      FileUtil.getOriginalFileNameWithoutPrefix(attachedFileName);
    const name = `${originName}.${
      attachedFileExtension || attachedFileDataType.toLowerCase()
    }`;
    if (isReadOnlyApexPage) {
      return (
        <S.FileName
          onClick={() => {
            window.open(downloadUrl, '_blank');
          }}
        >
          {name}
        </S.FileName>
      );
    }

    return (
      <S.FileName
        onClick={() => {
          if (openApprovalReceiptPreview) {
            openApprovalReceiptPreview({
              receiptCreatedDate: attachedFileCreatedDate,
              receiptDataType: attachedFileDataType,
              receiptTitle: attachedFileName,
              receiptId: attachedFileId,
              receiptFileId: attachedFileVerId,
            });
            return;
          }
          if (openRecordAttachmentPreview) {
            openRecordAttachmentPreview(attachedFileVerId);
            return;
          }
          enableActiveDialog && updateActiveDialogId(attachmentPreviewDialogId);
          setSelectedAttachedFileId(attachedFileVerId);
        }}
      >
        {name}
      </S.FileName>
    );
  };

  const renderReceiptName = (receipt: AttachedFile | Receipt) => {
    // report and record receipt list have different properties
    if (isReportHeader) {
      const receiptItem = receipt as AttachedFile;
      return renderName(
        receiptItem.attachedFileDataType,
        receiptItem.attachedFileName,
        receiptItem.attachedFileId,
        receiptItem.attachedFileVerId,
        receiptItem.attachedFileExtension
      );
    }
    const receiptItem = receipt as Receipt;
    return renderName(
      receiptItem.receiptDataType,
      receiptItem.receiptTitle,
      receiptItem.receiptId,
      receiptItem.receiptFileId,
      receiptItem.receiptFileExtension,
      receiptItem.receiptCreatedDate
    );
  };

  const renderReceiptItem = (receipt: AttachedFile | Receipt) => {
    const attachedFileId = isReportHeader
      ? (receipt as AttachedFile).attachedFileId
      : (receipt as Receipt).receiptId;
    return (
      <S.ReceiptItem isDisabled={isDisableEdit}>
        {renderReceiptName(receipt)}
        {!isDisableEdit && (
          <S.DeleteButton
            onMouseDown={(e) => {
              e.preventDefault();
              deleteFile(attachedFileId);
            }}
            type="button"
            value={attachedFileId}
          >
            <IconDelete aria-hidden="true" />
          </S.DeleteButton>
        )}
      </S.ReceiptItem>
    );
  };

  const attachmentPreviewDialog = (() => {
    const attachmentList = isReportHeader
      ? (attachedFileList as AttachedFile[])
      : (attachedFileList as Receipt[]).map(
          ({
            receiptId,
            receiptCreatedDate,
            receiptDataType,
            receiptFileId,
            receiptTitle,
          }) => ({
            attachedFileCreatedDate: receiptCreatedDate,
            attachedFileDataType: receiptDataType,
            attachedFileId: receiptId,
            attachedFileName: receiptTitle,
            attachedFileVerId: receiptFileId,
          })
        );

    return (
      <AttachmentPreviewDialog
        isDialogCenter
        attachmentList={attachmentList}
        readOnly={isDisableEdit}
        selectedAttachedFileId={selectedAttachedFileId}
        onClickHideDialogButton={() => {
          enableActiveDialog && updateActiveDialogId('');
          setSelectedAttachedFileId(undefined);
        }}
        onClickDeleteAttachment={(attachedFileId) => {
          setSelectedAttachedFileId(attachmentList[0]?.attachedFileVerId);
          deleteFile(attachedFileId);
        }}
        onClickAttachment={(attachmentIndex) => {
          setSelectedAttachedFileId(
            attachmentList[attachmentIndex]?.attachedFileVerId
          );
        }}
        isFinanceApproval={isFinanceApproval}
      />
    );
  })();

  return (
    <>
      {isFileMenuOpen && (
        <S.FileMenu align={alignFileMenu}>
          {!isDisableEdit && (
            <S.AddButton
              disabled={fileCount === ATTACHMENT_MAX_COUNT}
              onClick={openReceiptLibraryDialog}
              type="button"
            >
              {msg().Exp_Lbl_AddFile}
            </S.AddButton>
          )}
          {attachedFileList.map((receipt: AttachedFile | Receipt) =>
            renderReceiptItem(receipt)
          )}
        </S.FileMenu>
      )}

      {!!selectedAttachedFileId &&
        (!enableActiveDialog ||
          (enableActiveDialog &&
            attachmentPreviewDialogId === activeDialogId)) &&
        attachmentPreviewDialog}
    </>
  );
};

export default ReceiptAttachmentModal;
