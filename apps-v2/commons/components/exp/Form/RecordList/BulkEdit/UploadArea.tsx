import React, { FC } from 'react';

import Dropzone from '@commons/components/fields/Dropzone';
import withLoadingHOC from '@commons/components/withLoading';
import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  RECEIPT_LIBRARY_MAX_SELECTION_COUNT,
} from '@apps/domain/models/exp/Receipt';
import { BULK_EDIT_UPLOAD_LOADING_AREA } from '@apps/domain/models/exp/Record';

import './UploadArea.scss';

type Props = {
  classRoot: string;
  isExpenseRequest: boolean;
  onDropReceiptFiles: (files: File[]) => void;
  showErrorToast: (message: string) => void;
};

const UploadArea: FC<Props> = ({
  classRoot,
  isExpenseRequest,
  onDropReceiptFiles,
  showErrorToast,
}) => {
  const handleDropAccepted = (files: File[]) => {
    if (files.length > RECEIPT_LIBRARY_MAX_SELECTION_COUNT) {
      const maxSelectionError = TextUtil.template(
        msg().Exp_Lbl_SelectMultipleFiles,
        RECEIPT_LIBRARY_MAX_SELECTION_COUNT
      );
      showErrorToast(maxSelectionError);
      return;
    }
    onDropReceiptFiles(files);
  };

  const handleDropRejected = (rejectedFiles: File[]) => {
    const isMaxFileSize = rejectedFiles.some(
      ({ size }) => size > MAX_FILE_SIZE
    );
    if (isMaxFileSize) showErrorToast(msg().Common_Err_MaxFileSize);
  };

  return (
    <div className={`${classRoot}__upload-area`}>
      <Dropzone
        accept={ALLOWED_MIME_TYPES.join()}
        labeltext={
          <p>
            {isExpenseRequest
              ? msg().Exp_Lbl_DragAndDropQuotationFilesToCreateRecords
              : msg().Exp_Lbl_DragAndDropReceiptFilesToCreateRecords}
          </p>
        }
        onDropAccepted={handleDropAccepted}
        onDropRejected={handleDropRejected}
        multiple={true}
        maxSize={MAX_FILE_SIZE}
      >
        <></>
      </Dropzone>
    </div>
  );
};

UploadArea.displayName = BULK_EDIT_UPLOAD_LOADING_AREA;
export default withLoadingHOC(UploadArea);
