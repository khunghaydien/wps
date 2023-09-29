import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import styled, { css } from 'styled-components';

import ImageViewer, {
  INITIAL_VIEW_OPTIONS,
  MAX_ZOOM_SCALE,
  ORIGINAL_SCALE,
  ZOOM_IN_INCREMENT,
  ZOOM_OUT_INCREMENT,
} from '@apps/commons/components/exp/Form/Dialog/AttachmentPreview/AttachmentPreviewPane/ImageViewer';
import IconButton from '@commons/components/buttons/IconButton';
import LightboxModal from '@commons/components/LightboxModal';
import btnCloseZoom from '@commons/images/btnCloseZoom.png';
import IconDownload from '@commons/images/icons/download.svg';
import IconExpand from '@commons/images/icons/expand.svg';
import IconZoomOut from '@commons/images/icons/minus.svg';
import IconZoomIn from '@commons/images/icons/plus.svg';
import IconZoomBack from '@commons/images/icons/zoomOut.svg';
import msg from '@commons/languages';

import {
  fileDownloadUrl,
  isNotImage,
  isPDF,
} from '@apps/domain/models/exp/Receipt';

import { State } from '../../modules';

const ROOT = 'approvals-pc-expenses-pre-approval-pane-detail-side-file-preview';

type Props = {
  hideSideFile: () => void;
};

const SideFilePreview = ({ hideSideFile }: Props) => {
  const [scale, setScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState([0, 0]);
  const [isShowModal, setIsShowModal] = useState(false);

  const canvasRef = useRef(null);

  const file = useSelector((state: State) => state.ui.sideFilePreview);
  const { id: fileId, dataType: fileDataType } = file || {};

  useEffect(() => {
    setScale(ORIGINAL_SCALE);
  }, [fileId]);

  const isPdf = isPDF(fileDataType);
  const isNotImg = isNotImage(fileDataType);
  const downloadUrl = fileDownloadUrl(fileId);
  const [transformOriginX = 0, transformOriginY = 0] = transformOrigin;
  const isOriginalScale = scale === ORIGINAL_SCALE;
  const isMaxZoomed = Math.round(scale) >= MAX_ZOOM_SCALE;

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleZoomOut = () => {
    const nextScale = scale * ZOOM_OUT_INCREMENT;
    setScale(nextScale);

    canvasRef?.current?.zoomOut?.();
  };
  const handleZoomBack = () => {
    setTransformOrigin([0, 0]);
    setScale(ORIGINAL_SCALE);

    canvasRef.current?.resetZoom();
  };
  const handleZoomIn = () => {
    const nextScale = scale * ZOOM_IN_INCREMENT;
    setScale(nextScale);

    canvasRef?.current?.zoomIn?.();
  };

  const toggleModal = (e?: React.SyntheticEvent<HTMLButtonElement, Event>) => {
    if (e) {
      e.stopPropagation();
    }
    setIsShowModal(!isShowModal);
  };

  const attachment = (() => {
    const commonProps = {
      $scale: scale,
      $transformOriginX: transformOriginX,
      $transformOriginY: transformOriginY,
    };

    if (isPdf) {
      const attrHideTools = '#toolbar=0&view=FitH';

      return (
        <PDFAttachment
          data={`${downloadUrl}${attrHideTools}`}
          type="application/pdf"
          {...commonProps}
        >
          <p>{msg().Exp_Lbl_Receipt}</p>
        </PDFAttachment>
      );
    }

    return (
      <ImageViewer
        imgSrc={downloadUrl}
        ref={canvasRef}
        setCurrentScale={(scale) => setScale(scale)}
        initialView={INITIAL_VIEW_OPTIONS.FIT_WIDTH}
      />
    );
  })();

  if (!downloadUrl) {
    return null;
  }

  return (
    <>
      <SideFilePreviewContainer>
        {isNotImg && (
          <PDFAttachmentAltText>
            {msg().Exp_Msg_CannotLoadPreview}
          </PDFAttachmentAltText>
        )}

        <AttachmentWrapper $isPdf={isPdf}>{attachment}</AttachmentWrapper>

        <ControlPanel>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              src={btnCloseZoom}
              onClick={hideSideFile}
              alt="close"
            />
          </ControlPanelButtonWrapper>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconDownload}
              onClick={handleDownload}
            />
          </ControlPanelButtonWrapper>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconZoomOut}
              onClick={handleZoomOut}
              disabled={isOriginalScale}
            />
          </ControlPanelButtonWrapper>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconZoomBack}
              onClick={handleZoomBack}
              disabled={isOriginalScale}
            />
          </ControlPanelButtonWrapper>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconZoomIn}
              onClick={handleZoomIn}
              disabled={isMaxZoomed}
            />
          </ControlPanelButtonWrapper>
          <ControlPanelButtonWrapper>
            <ControlPanelButton
              srcType="svg"
              src={IconExpand}
              onClick={toggleModal}
            />
          </ControlPanelButtonWrapper>
        </ControlPanel>
      </SideFilePreviewContainer>

      <CSSTransition
        in={isShowModal}
        timeout={500}
        classNames={`${ROOT}__modal-container`}
        unmountOnExit
      >
        <LightboxModal
          src={downloadUrl}
          toggleLightbox={toggleModal}
          fileType={fileDataType}
        />
      </CSSTransition>
    </>
  );
};

export default SideFilePreview;

const SideFilePreviewContainer = styled.div`
  @keyframes fadeIn {
    99% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }

  overflow: auto;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  flex: 1;
  position: relative;
`;

const AttachmentWrapper = styled.div<{
  $isPdf?: boolean;
}>`
  overflow: scroll;
  width: 100%;
  height: 100%;

  ${({ $isPdf }) =>
    $isPdf &&
    css`
      z-index: 0;
    `};
`;

const PDFAttachment = styled.object<{
  $scale?: number;
  $transformOriginX?: number;
  $transformOriginY?: number;
}>`
  width: ${({ $scale = 1 }) => `${$scale * 100}%`};
  height: ${({ $scale = 1 }) => `${$scale * 100}%`};
  transform-origin: ${({ $transformOriginX = 0, $transformOriginY = 0 }) =>
    `${$transformOriginX}px ${$transformOriginY}px`};
  transition: all 0.2s ease-in-out;
  z-index: 0;
`;

const PDFAttachmentAltText = styled.div`
  position: absolute;
  text-align: center;
  bottom: 200px;
  width: 200px;
  color: #fff;
  animation: 2s fadeIn;
  animation-fill-mode: forwards;
  visibility: hidden;
`;

const ControlPanel = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
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
`;
