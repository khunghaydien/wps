import React, { FocusEvent, ReactElement, useRef, useState } from 'react';

import ReceiptAttachmentModal from '@commons/components/exp/Form/ReceiptAttachmentModal';
import ReceiptVoucherIcon from '@commons/images/icons/iconVoucherReceipt.svg';

import { Receipt, Record } from '@apps/domain/models/exp/Record';

type Props = {
  isOpenReceiptLibraryDialog: boolean;
  parentClass: string;
  record: Record;
  recordIdx: number;
  recordReceiptList: Receipt[];
  onChangeEditingExpReport: (
    field: string,
    value: number | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
  openReceiptLibrary: () => void;
};

const FORMIK_TARGET_FIELD = 'report.records';

const ReceiptModal = ({
  isOpenReceiptLibraryDialog,
  parentClass,
  record,
  recordIdx,
  recordReceiptList,
  onChangeEditingExpReport,
  openReceiptLibrary,
}: Props): ReactElement => {
  const openClickRef = useRef(null);
  const [isFileMenuOpen, setFileMenuOpen] = useState(false);

  const deleteFile = (selectedReceiptId: string) => {
    const newReceiptList = recordReceiptList.filter(
      ({ receiptId }) => receiptId !== selectedReceiptId
    );
    if (newReceiptList.length === 0) {
      onChangeEditingExpReport('ui.bulkRecordIdx', -1);
    }
    onChangeEditingExpReport(`${FORMIK_TARGET_FIELD}.${recordIdx}`, {
      ...record,
      receiptList: newReceiptList,
    });
  };

  const openFileMenu = () => {
    setFileMenuOpen(true);
    onChangeEditingExpReport('ui.bulkRecordIdx', recordIdx);
  };

  const closeFileMenu = (e: FocusEvent<HTMLButtonElement>) => {
    // close if clicked element is not a children of parent button
    if (
      !isOpenReceiptLibraryDialog &&
      !e.currentTarget.contains(e.relatedTarget)
    ) {
      setFileMenuOpen(false);
      onChangeEditingExpReport('ui.bulkRecordIdx', -1);
      // remove focus from button (e.g. when changing browser tab)
      if (openClickRef.current) openClickRef.current.blur();
    } else {
      // set focus back to open button as focused may be set to child element
      if (openClickRef.current) openClickRef.current.focus();
    }
  };

  const ROOT = `${parentClass}__receipt-modal`;
  return (
    <button className={ROOT} onBlur={closeFileMenu} type="button">
      <button
        className={`${ROOT}__uploaded-btn`}
        onClick={openFileMenu}
        ref={openClickRef}
        type="button"
      >
        <ReceiptVoucherIcon />
      </button>

      <ReceiptAttachmentModal
        key={record.recordId}
        alignFileMenu="right"
        attachedFileList={recordReceiptList}
        isDisableEdit={false}
        isFileMenuOpen={isFileMenuOpen}
        isReadOnlyApexPage={false}
        isReportHeader={false}
        openReceiptLibraryDialog={openReceiptLibrary}
        deleteFile={deleteFile}
      />
    </button>
  );
};

export default ReceiptModal;
