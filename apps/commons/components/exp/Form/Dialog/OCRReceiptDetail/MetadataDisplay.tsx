import React, { memo } from 'react';

import TextUtil from '@commons/utils/TextUtil';

import {
  FileMetadata,
  getMetadataDisplay,
  getMetadataWarning,
} from '@apps/domain/models/exp/Receipt';

import Warning from './Warning';

type Props = {
  metadata: FileMetadata;
  useImageQualityCheck: boolean;
};

const PARENT_CLASS = 'ts-expenses-modal-ocr-receipt-detail';

const MetadataDisplay = ({ metadata, useImageQualityCheck }: Props) => {
  if (!useImageQualityCheck) return null;

  const metadataWarning = TextUtil.nl2br(getMetadataWarning(metadata));
  return (
    <>
      <div className={`${PARENT_CLASS}__metadata`}>
        {getMetadataDisplay(metadata)}
      </div>
      {metadataWarning && (
        <Warning labelKey={null} wholeMsg={metadataWarning} />
      )}
    </>
  );
};

export default memo(MetadataDisplay);
