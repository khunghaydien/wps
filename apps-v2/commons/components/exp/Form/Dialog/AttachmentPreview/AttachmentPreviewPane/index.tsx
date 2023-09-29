import React, { useEffect, useRef, useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import styled, { css } from 'styled-components';

import IconButton from '@commons/components/buttons/IconButton';
import IconDownload from '@commons/images/icons/download.svg';
import IconExpand from '@commons/images/icons/expand.svg';
import IconTrash from '@commons/images/icons/iconTrash.svg';
import IconZoomOut from '@commons/images/icons/minus.svg';
import IconZoomIn from '@commons/images/icons/plus.svg';
import IconZoomBack from '@commons/images/icons/zoomOut.svg';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import {
  fileDownloadUrl,
  isNotImage,
  isPDF,
  previewUrl,
  SF_PREVIEW_SIZE,
} from '@apps/domain/models/exp/Receipt';

import msg from '../../../../../../languages';
import FileTypeIcon from '../../../../../File/FileTypeIcon';
import ImageViewer, {
  MAX_ZOOM_SCALE,
  ORIGINAL_SCALE,
  ZOOM_IN_INCREMENT,
  ZOOM_OUT_INCREMENT,
} from './ImageViewer';

export type Props = {
  isFinanceApproval?: boolean;
  readOnly?: boolean;
  selectedAttachment: AttachedFile;
  onClickDeleteAttachment?: (attachedFileId: string) => void;
  onClickFullScreen: () => void;
};

const AttachmentPreviewPane = (props: Props) => {
  const {
    selectedAttachment,
    readOnly,
    isFinanceApproval,
    onClickDeleteAttachment,
    onClickFullScreen,
  } = props;

  const canvasRef = useRef(null);

  const [scale, setScale] = useState(1);

  const [isLoaded, setIsLoaded] = useState(false);

  const { attachedFileId, attachedFileDataType, attachedFileVerId } =
    selectedAttachment || {};
  const isNonImageTypes = isNotImage(attachedFileDataType);
  const isPdf = isPDF(attachedFileDataType);
  const downloadUrl = fileDownloadUrl(attachedFileId);
  const isOriginalScale = scale === ORIGINAL_SCALE;
  const isMaxZoomed = Math.round(scale) >= MAX_ZOOM_SCALE;

  const handleDelete = () => {
    onClickDeleteAttachment(attachedFileId);
  };

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleZoomOut = () => {
    const nextScale = scale * ZOOM_OUT_INCREMENT;
    setScale(nextScale);

    canvasRef?.current?.zoomOut?.();
  };
  const handleZoomBack = () => {
    setScale(ORIGINAL_SCALE);

    canvasRef.current?.resetZoom();
  };
  const handleZoomIn = () => {
    const nextScale = scale * ZOOM_IN_INCREMENT;
    setScale(nextScale);

    canvasRef?.current?.zoomIn?.();
  };

  useEffect(() => {
    setScale(1);
  }, [attachedFileVerId]);

  useEffect(() => {
    setIsLoaded(isPdf);
  }, [downloadUrl]);

  const attachment = (() => {
    if (isNonImageTypes) {
      if (!isPdf) return null;

      return (
        <PDFAttachment
          src={previewUrl(
            attachedFileVerId,
            isNonImageTypes,
            SF_PREVIEW_SIZE.LARGE
          )}
          onLoad={() => {
            setIsLoaded(true);
          }}
          onError={() => {
            setIsLoaded(false);
          }}
        />
      );
    }

    return (
      <ImageAttachment
        imgSrc={previewUrl(attachedFileVerId, false)}
        ref={canvasRef}
        setCurrentScale={(scale) => setScale(scale)}
      />
    );
  })();

  const renderControlPanel = () => {
    if (isEmpty(selectedAttachment)) {
      return null;
    }

    return (
      <ControlPanel>
        <ControlPanelButtonWrapper>
          <ControlPanelButton
            srcType="svg"
            src={IconDownload}
            onClick={handleDownload}
          />
        </ControlPanelButtonWrapper>
        <ControlPanelButtonWrapper>
          <ControlPanelButton
            disabled={isOriginalScale}
            srcType="svg"
            src={IconZoomOut}
            onClick={handleZoomOut}
          />
        </ControlPanelButtonWrapper>
        <ControlPanelButtonWrapper>
          <ControlPanelButton
            disabled={isOriginalScale}
            srcType="svg"
            src={IconZoomBack}
            onClick={handleZoomBack}
          />
        </ControlPanelButtonWrapper>
        <ControlPanelButtonWrapper>
          <ControlPanelButton
            disabled={isMaxZoomed}
            srcType="svg"
            src={IconZoomIn}
            onClick={handleZoomIn}
          />
        </ControlPanelButtonWrapper>
        <ControlPanelButtonWrapper>
          <ControlPanelButton
            srcType="svg"
            src={IconExpand}
            onClick={onClickFullScreen}
          />
        </ControlPanelButtonWrapper>
        {!isFinanceApproval && !readOnly && (
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconTrash}
              onClick={handleDelete}
            />
          </ControlPanelButtonWrapper>
        )}
      </ControlPanel>
    );
  };

  return (
    <AttachmentPreviewPaneContainer>
      <AttachmentWrapper $isNonImageTypes={isNonImageTypes}>
        {attachment}
      </AttachmentWrapper>

      {isNonImageTypes ? (
        <FileFailedPreview>
          <FileFailedPreviewInfo>
            {!isLoaded && (
              <>
                <div>
                  <FileTypeIcon attachedFileDataType={attachedFileDataType} />
                </div>
                <div>{msg().Exp_Msg_CannotLoadPreview}</div>
              </>
            )}
          </FileFailedPreviewInfo>

          <FileFailedPreviewDownloadBtn onClick={handleDownload}>
            {msg().Com_Btn_Download}
          </FileFailedPreviewDownloadBtn>

          {!isFinanceApproval && !readOnly && (
            <FileFailedPreviewDeleteBtn onClick={handleDelete}>
              {msg().Com_Btn_Delete}
            </FileFailedPreviewDeleteBtn>
          )}
        </FileFailedPreview>
      ) : (
        renderControlPanel()
      )}
    </AttachmentPreviewPaneContainer>
  );
};

export default AttachmentPreviewPane;

const AttachmentPreviewPaneContainer = styled.div`
  @keyframes fadeIn {
    99% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }

  width: 80%;
  height: 100%;
  background-color: #2d2d2e;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  cursor: default;
`;

const FileFailedPreview = styled.div`
  z-index: 99;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100%;
`;

const FileFailedPreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 15px;
  height: 55px;
`;

const FileFailedPreviewDeleteBtn = styled.div`
  color: #c23934;
  background-color: white;
  width: 100%;
  text-align: center;
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 15px;
  cursor: pointer;
`;

const FileFailedPreviewDownloadBtn = styled.div`
  background-color: #2782ed;
  color: white;
  width: 100%;
  text-align: center;
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 15px;
  cursor: pointer;
`;

const PDFAttachment = styled.img`
  margin: auto;
  position: relative;
  filter: brightness(0.5);

  ::after {
    content: '';
    background-color: #2d2d2e;
    margin: auto;
    position: absolute;
  }
`;

const AttachmentWrapper = styled.div<{
  $isNonImageTypes?: boolean;
}>`
  overflow: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  ${({ $isNonImageTypes }) =>
    !$isNonImageTypes &&
    css`
      align-items: center;
    `};
`;

const ImageAttachment = styled(ImageViewer)``;

const ControlPanel = styled.div`
  display: flex;
  position: absolute;
  bottom: 20px;
`;

const ControlPanelButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 60px;
  padding: 0.5em 0.6em;
  background: #1d1d1dd6;
  margin: 10px;
`;

const ControlPanelButton = styled(IconButton)`
  :disabled {
    path {
      fill: #666;
    }
  }

  path {
    fill: #fff;
  }
`;
