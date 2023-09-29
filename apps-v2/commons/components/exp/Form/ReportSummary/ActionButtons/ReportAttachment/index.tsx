import React, { useState } from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import ReceiptAttachmentModal from '@commons/components/exp/Form/ReceiptAttachmentModal';
import msg from '@commons/languages';

import { Report } from '../../../../../../../domain/models/exp/Report';

import IconAttach from '../../../../../../images/icons/attach.svg';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__actions';

export type ReportAttachmentProps = {
  openReceiptLibraryDialog?: () => void;
  updateReport?: (Object: Record<string, any>) => void;
};

type Props = ReportAttachmentProps & {
  errors?: any;
  expReport: Report;
  isBulkEditMode?: boolean;
  isExpense?: boolean;
  isFinanceApproval?: boolean;
  isReadOnlyApexPage?: boolean;
  isReportAttachmentRequired?: boolean;
  readOnly?: boolean;
};

const pinIcon = <IconAttach className={`${ROOT}__attach-icon`} />;

const ReportAttachment = (props: Props) => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  const {
    expReport,
    openReceiptLibraryDialog,
    isBulkEditMode,
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

  if (hideAllBtn) {
    return null;
  }

  const errorKey = get(props.errors, 'attachedFileList');

  const deleteFile = (targetedFileId: string) => {
    const updateObj = attachedFileList.filter(
      ({ attachedFileId }) => attachedFileId !== targetedFileId
    );
    updateReport({ attachedFileList: updateObj });
  };

  return (
    <>
      {isReportAttachmentRequired && isExpense && (
        <span className="is-required">*&nbsp;</span>
      )}
      <div className={`${ROOT}__attachment`}>
        <button
          type="button"
          className={`slds-button slds-button--icon ${ROOT}__attach attached`}
          disabled={isBulkEditMode}
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

        <ReceiptAttachmentModal
          attachedFileList={attachedFileList}
          isDisableEdit={readOnly || isFinanceApproval || isBulkEditMode}
          isFileMenuOpen={isFileMenuOpen}
          isReadOnlyApexPage={isReadOnlyApexPage}
          isReportHeader
          deleteFile={deleteFile}
          openReceiptLibraryDialog={openReceiptLibraryDialog}
          isFinanceApproval={isFinanceApproval}
        />
      </div>
    </>
  );
};

export default ReportAttachment;
