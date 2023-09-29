import React, { ReactElement } from 'react';

import get from 'lodash/get';

import Button from '@commons/components/buttons/Button';
import CreditCardIcon from '@commons/images/icons/creditCard.svg';
import ICCardIcon from '@commons/images/icons/icCard.svg';
import TransitVoucherIcon from '@commons/images/icons/iconVoucherTransit.svg';
import UploadIcon from '@commons/images/icons/upload.svg';

import {
  isCCRecord,
  isIcRecord,
  isJorudanRecord,
  RECEIPT_TYPE,
  Record,
} from '@apps/domain/models/exp/Record';

import { COLUMNS } from '..';
import ReceiptModal from './ReceiptModal';

import './index.scss';

export type ContainerProps = {
  record: Record;
  recordIdx: number;
  onChangeEditingExpReport: (
    field: string,
    value: number | string | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
};

type Props = ContainerProps & {
  // props from container
  isOpenReceiptLibraryDialog: boolean;
  openReceiptLibrary: () => void;
};

const ROOT = 'ts-expense__bulk-edit__proof-cell';

const GridProofCell = ({
  isOpenReceiptLibraryDialog,
  record,
  recordIdx,
  onChangeEditingExpReport,
  openReceiptLibrary,
}: Props): ReactElement => {
  const { fileAttachment, recordType } = record;

  const onClickUploadButton = () => {
    onChangeEditingExpReport('ui.bulkRecordIdx', recordIdx);
    openReceiptLibrary();
  };

  // render CC/IC/Jorudan/NoReceiptUsed icons
  const isReceiptNotUsed = fileAttachment === RECEIPT_TYPE.NotUsed;
  const isRecordCCNoReceipt = isCCRecord(record) && isReceiptNotUsed;
  const isRecordICCard = isIcRecord(recordType);
  const isRecordJorudan = isJorudanRecord(recordType);
  const disabledClass = `${ROOT}__uploaded-disabled`;

  if (
    isRecordCCNoReceipt ||
    isRecordICCard ||
    isRecordJorudan ||
    isReceiptNotUsed
  ) {
    const iconElement = isRecordCCNoReceipt ? (
      <CreditCardIcon />
    ) : isRecordICCard ? (
      <ICCardIcon />
    ) : isRecordJorudan ? (
      <TransitVoucherIcon />
    ) : null;
    return <div className={disabledClass}>{iconElement}</div>;
  }

  const recordReceiptList = get(record, COLUMNS.receiptList, []);
  const hasReceiptAttached = recordReceiptList.length > 0;
  return (
    <>
      {hasReceiptAttached ? (
        <ReceiptModal
          isOpenReceiptLibraryDialog={isOpenReceiptLibraryDialog}
          parentClass={ROOT}
          record={record}
          recordIdx={recordIdx}
          recordReceiptList={recordReceiptList}
          onChangeEditingExpReport={onChangeEditingExpReport}
          openReceiptLibrary={openReceiptLibrary}
        />
      ) : (
        <Button
          className={`${ROOT}__upload-btn`}
          iconSrc={UploadIcon}
          iconSrcType="svg"
          onClick={onClickUploadButton}
          type="primary"
        />
      )}
    </>
  );
};

export default GridProofCell;
