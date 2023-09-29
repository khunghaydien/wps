import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import FileTypeIcon from '@apps/commons/components/File/FileTypeIcon';
import Spinner from '@apps/commons/components/Spinner';
import msg from '@apps/commons/languages';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import {
  isNotImage,
  previewUrl,
  SF_PREVIEW_SIZE,
} from '@apps/domain/models/exp/Receipt';

export type Props = {
  attachment: Partial<AttachedFile>;
  height?: number;
  onClick?: () => void;
};

const POLLING_INTERVAL = 4000;
const POLLING_TIMEOUT = 60000;

const AttachmentPreview = ({ attachment, height, onClick }: Props) => {
  const [loading, setLoading] = useState(true);
  const [reloadedTimes, setReloadedTimes] = useState(0);
  const [intervalInstance, setIntervalInstance] =
    useState<ReturnType<typeof setInterval>>();

  const { attachedFileDataType, attachedFileVerId, attachedFileName } =
    attachment || {};
  const isNonImageTypes = isNotImage(attachedFileDataType);
  const isImageTypes = !isNonImageTypes;
  const thumbnailSrc = (() => {
    if (isImageTypes) {
      return previewUrl(attachedFileVerId, false, SF_PREVIEW_SIZE.LARGE);
    }

    if (reloadedTimes > 0) {
      const nonCachedUrlStr = `${previewUrl(
        attachedFileVerId,
        isNonImageTypes,
        SF_PREVIEW_SIZE.SMALL
      )}&${Math.random()}`;

      return nonCachedUrlStr;
    }

    const cachedUrlStr = previewUrl(
      attachedFileVerId,
      isNonImageTypes,
      SF_PREVIEW_SIZE.LARGE
    );

    return cachedUrlStr;
  })();

  useEffect(() => {
    if (isImageTypes) {
      return undefined;
    }

    if (!intervalInstance) {
      const getNewIntervalInstance = () =>
        setInterval(() => {
          setReloadedTimes((reloadedTimes) => reloadedTimes + 1);
        }, POLLING_INTERVAL);

      setIntervalInstance(getNewIntervalInstance());
    }

    return () => {
      clearInterval(intervalInstance);
    };
  }, []);

  useEffect(() => {
    const stopPollingCondition =
      loading === false || reloadedTimes * POLLING_INTERVAL >= POLLING_TIMEOUT;

    if (stopPollingCondition) {
      clearInterval(intervalInstance);
    }
  }, [loading, reloadedTimes]);

  const isLoadingPreview = loading && reloadedTimes < 3;
  const isGeneratingPreview = loading && reloadedTimes >= 3;
  const hintMsg = (() => {
    if (isLoadingPreview) {
      return msg().Exp_Lbl_LoadingPreview;
    }

    if (isGeneratingPreview) {
      return msg().Exp_Msg_GeneratingPreview;
    }
  })();

  return (
    <FileAttachmentPreviewWrapper $height={height}>
      <LoadingPlaceholder loading={loading} priority="low" hintMsg={hintMsg} />

      <FilePreview
        $loading={loading}
        src={thumbnailSrc}
        onLoad={() => {
          setLoading(false);
        }}
        onClick={onClick}
        alt={attachedFileName || ''}
      />

      {!isLoadingPreview && (
        <FileTypeIconWrapper title={attachedFileDataType}>
          <FileTypeIcon attachedFileDataType={attachedFileDataType} />
        </FileTypeIconWrapper>
      )}
    </FileAttachmentPreviewWrapper>
  );
};

export default AttachmentPreview;

const FilePreview = styled.img<{ $loading: boolean }>`
  ${({ $loading }) => $loading && 'width:0px'};
  max-width: 100%;
  max-height: 100%;
  visibility: ${({ $loading }) => ($loading ? 'hidden' : 'visible')};
  cursor: pointer;
  box-shadow: -5px -5px 9px rgb(255 255 255 / 45%),
    5px 5px 9px rgb(94 104 121 / 30%);
  transition: all 0.3s ease-in-out;

  :hover {
    box-shadow: -5px -5px 9px rgb(255 255 255 / 65%),
      5px 5px 9px rgb(94 104 121 / 50%);
  }
`;

const FileAttachmentPreviewWrapper = styled.div<{
  $height?: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ $height }) => ($height > 80 ? `${$height}px` : '80px')};
  position: relative;
  white-space: nowrap;

  .commons-spinner {
    position: absolute;
    z-index: 0;
  }

  .commons-spinner__hint {
    z-index: 0;
  }
`;

const LoadingPlaceholder = styled(Spinner)``;

const FileTypeIconWrapper = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
`;
