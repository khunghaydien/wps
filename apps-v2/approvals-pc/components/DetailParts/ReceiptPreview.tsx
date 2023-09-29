import React from 'react';

import Lightbox from '../../../commons/components/Lightbox';
import SFFilePreview from '../../../commons/components/SFFilePreview';
import msg from '../../../commons/languages';

import { isNotImage, previewUrl } from '../../../domain/models/exp/Receipt';

import './ReceiptPreview.scss';

type Props = {
  fileId?: string;
  fileType?: string;
  fileName?: string;
  fileVerId?: string;
  uploadedDate?: string;
  noLabel?: boolean;
};

const ROOT = 'approvals-pc-detail-parts-receipt-preview';

const ReceiptPreview = (props: Props) => {
  const { fileId, fileName, fileType, fileVerId, uploadedDate, noLabel } =
    props;
  const isNotImageType = isNotImage(fileType);
  const fileUrl = previewUrl(fileVerId, isNotImageType);

  let attachmentContainer = null;

  if (fileId) {
    attachmentContainer = (
      <div className={`${ROOT}`}>
        {!noLabel && (
          <div className={`${ROOT}-label`}>{msg().Exp_Lbl_AttachedFile}</div>
        )}
        <div className={`${ROOT}-body`}>
          {isNotImageType ? (
            <SFFilePreview
              fileType={fileType}
              receiptId={fileId || ''}
              receiptFileId={fileVerId || ''}
              uploadedDate={uploadedDate || ''}
              fileName={fileName || ''}
              withDownloadLink
            />
          ) : (
            <Lightbox>
              <img
                alt={msg().Exp_Lbl_Receipt}
                className="lightbox-img-thumbnail"
                src={fileUrl}
              />
            </Lightbox>
          )}
        </div>
      </div>
    );
  }
  return attachmentContainer;
};

export default ReceiptPreview;
