import React from 'react';

import { Record } from '@apps/domain/models/exp/Record';

import AttachmentPreviewDialog from '../../Dialog/AttachmentPreview';
import { useAttachmentPreviewDialog } from '../../RecordList/BulkEdit/GridArea/GridProofCell/ActiveDialogProvider';

type Props = {
  expRecord: Record;
  isFinanceApproval: boolean;
  readOnly: boolean;
  onDeleteFile: (receiptId: string) => void;
};

const AttachmentPreview = ({
  expRecord,
  isFinanceApproval,
  readOnly,
  onDeleteFile,
}: Props) => {
  const { receiptList } = expRecord;
  const { selectedAttachedFileId, updateSelectedAttachedFileId } =
    useAttachmentPreviewDialog();

  const attachmentList = receiptList.map(
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

  if (!selectedAttachedFileId) {
    return null;
  }

  return (
    <AttachmentPreviewDialog
      attachmentList={attachmentList}
      readOnly={readOnly}
      selectedAttachedFileId={selectedAttachedFileId}
      onClickHideDialogButton={() => {
        updateSelectedAttachedFileId('');
      }}
      onClickDeleteAttachment={(attachedFileId) => {
        updateSelectedAttachedFileId(
          attachmentList[0]?.attachedFileVerId || ''
        );
        onDeleteFile(attachedFileId);
      }}
      onClickAttachment={(attachmentIndex) => {
        updateSelectedAttachedFileId(
          attachmentList[attachmentIndex]?.attachedFileVerId || ''
        );
      }}
      isFinanceApproval={isFinanceApproval}
    />
  );
};

export default AttachmentPreview;
