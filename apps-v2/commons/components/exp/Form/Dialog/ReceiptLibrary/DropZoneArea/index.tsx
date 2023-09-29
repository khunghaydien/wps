import React from 'react';
import ReactDropzone from 'react-dropzone';

import {
  ALLOWED_MIME_TYPES,
  BASE_FILE_SIZE,
  IMG_MIME_TYPE,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
  PDF_MIME_TYPE,
} from '@apps/domain/models/exp/Receipt';

import IconReceipt from '../../../../../../images/icons/receipt.svg';
import IconReceiptCircle from '../../../../../../images/icons/receipt-circle.svg';
import msg from '../../../../../../languages';

import './index.scss';

const ROOT = 'ts-expenses-modal-receipt-library-drop-zone';

type Props = {
  errorMsg: string;
  isFullDropZone?: boolean;
  isMultiStep?: boolean;
  multiple: boolean;
  handleDropAccepted: (arg0: File[]) => void;
  handleDropRejected: (arg0: File[]) => void;
};

const displayAreaLabel = (isFullDropZone) => {
  const areaLabelClass = `${ROOT}__button--file ts-button`;

  const receiptIcon = (isFullDropZone && (
    <IconReceiptCircle className={areaLabelClass} />
  )) || <IconReceipt className={areaLabelClass} />;

  const displayMsg =
    (isFullDropZone && msg().Exp_Lbl_DragAndDropOCROverlay) ||
    msg().Exp_Lbl_DragAndDropOCR;

  return (
    (isFullDropZone && (
      <>
        {receiptIcon}
        <p>{displayMsg}</p>
      </>
    )) || (
      <>
        <p>{displayMsg}</p>
        {receiptIcon}
      </>
    )
  );
};

const DropZoneArea = ({
  handleDropAccepted,
  handleDropRejected,
  errorMsg,
  multiple,
  isFullDropZone,
  isMultiStep,
}: Props) => {
  const acceptedFileType = (
    isMultiStep ? [...PDF_MIME_TYPE, ...IMG_MIME_TYPE] : ALLOWED_MIME_TYPES
  ).join();

  const fileClassName = isFullDropZone
    ? `${ROOT}__fullDropZone`
    : `${ROOT}__area`;
  const maxFileSize = isMultiStep ? BASE_FILE_SIZE : MAX_FILE_SIZE;
  return (
    <div className={`${ROOT}`}>
      <ReactDropzone
        className={fileClassName}
        accept={acceptedFileType}
        onDropAccepted={handleDropAccepted}
        onDropRejected={handleDropRejected}
        multiple={multiple}
        maxSize={maxFileSize}
        minSize={MIN_FILE_SIZE}
      >
        <div className={`${fileClassName}-label`}>
          {displayAreaLabel(isFullDropZone)}
        </div>
        {errorMsg && (
          <div className={`${ROOT}__error input-feedback`}>{errorMsg}</div>
        )}
      </ReactDropzone>
    </div>
  );
};

export default DropZoneArea;
