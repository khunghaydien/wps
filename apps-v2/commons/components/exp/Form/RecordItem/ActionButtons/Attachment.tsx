import React, { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import ReceiptAttachmentModal from '@commons/components/exp/Form/ReceiptAttachmentModal';
import { useAttachmentPreviewDialog } from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea/GridProofCell/ActiveDialogProvider';
import IconAttach from '@commons/images/icons/attach.svg';
import ExpColor from '@commons/styles/exp/variables/_colors.scss';

import { Receipt, RECEIPT_TYPE, Record } from '@apps/domain/models/exp/Record';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

type ApprovalRecord = ExpRequestRecord & {
  fileAttachment?: string;
};

type Props = {
  isExpense: boolean;
  isFinanceApproval: boolean;
  readOnly: boolean;
  record: Record | ApprovalRecord;
  onDeleteFile: (receiptId: string) => void;
  openApprovalReceiptPreview?: (receipt: Receipt) => void;
  openReceiptLibraryDialog: () => void;
};

const Attachment = ({
  isExpense,
  isFinanceApproval,
  readOnly,
  record,
  onDeleteFile,
  openApprovalReceiptPreview,
  openReceiptLibraryDialog,
}: Props) => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const { updateSelectedAttachedFileId } = useAttachmentPreviewDialog();

  const { fileAttachment, receiptList } = record;
  const fileCount = receiptList.length;
  const hasNoAttachment = isEmpty(receiptList);
  const hasOneAttachment = receiptList.length === 1;

  const isFANoAttachment = isFinanceApproval && hasNoAttachment;
  const isReadOnlyNoAttachment = readOnly && hasNoAttachment;
  const isAttachmentRequired = fileAttachment === RECEIPT_TYPE.Required;
  const isAttachmentNotUsed = fileAttachment === RECEIPT_TYPE.NotUsed;

  if (isAttachmentNotUsed || isFANoAttachment || isReadOnlyNoAttachment) {
    return null;
  }

  const deleteFile = (receiptId: string) => {
    onDeleteFile(receiptId);
  };

  const openApprovalAttachmentPreview = () => {
    const receipt = receiptList[0];
    if (receipt) {
      openApprovalReceiptPreview(receipt);
    }
  };

  const openRecordAttachmentPreview = (attachedFileId: string) => {
    updateSelectedAttachedFileId(attachedFileId);
  };

  return (
    <>
      {isAttachmentRequired && isExpense && (
        <span className="is-required">*&nbsp;</span>
      )}
      <AttachmentGroup>
        <AttachButton>
          <button
            type="button"
            className={`slds-button slds-button--icon attached`}
            onClick={() => {
              if (hasOneAttachment && openApprovalReceiptPreview) {
                openApprovalAttachmentPreview();
                return;
              }
              setIsFileMenuOpen((prevIsOpen) => !prevIsOpen);
            }}
            onBlur={() => {
              // use time out otherwise will block onClick dropdown item
              setTimeout(() => setIsFileMenuOpen(false), 300);
            }}
          >
            <IconAttach />
            {!!fileCount && <AttachCount>{fileCount}</AttachCount>}
          </button>
        </AttachButton>

        <ReceiptAttachmentModal
          alignFileMenu="right"
          attachedFileList={receiptList}
          isDisableEdit={readOnly || isFinanceApproval}
          isFileMenuOpen={isFileMenuOpen}
          isFinanceApproval={isFinanceApproval}
          deleteFile={deleteFile}
          openReceiptLibraryDialog={openReceiptLibraryDialog}
          openApprovalReceiptPreview={openApprovalReceiptPreview}
          openRecordAttachmentPreview={openRecordAttachmentPreview}
        />
      </AttachmentGroup>
    </>
  );
};

export default Attachment;

const AttachmentGroup = styled.div`
  position: relative;
`;

const AttachButton = styled.div`
  .slds-button {
    width: 32px;
    min-width: 32px;
    height: 32px;
    margin-right: 16px;
    border: 1px solid #dddbda;
    border-radius: 5px;
    background-color: #fff;
  }

  :disabled {
    svg {
      path {
        fill: ${ExpColor.backgroundGray};
      }
    }
  }
`;

const AttachCount = styled.div`
  position: absolute;
  top: -5px;
  width: 15px;
  height: 15px;
  line-height: 15px;
  margin-left: 23px;
  background-color: ${ExpColor.backgroundNotice};
  color: ${ExpColor.backgroundLighter};
  border-radius: 50%;
  font-size: 10px;
  padding-top: 1px;
`;
