import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import IconButton from '@commons/components/buttons/IconButton';
import LightboxModal from '@commons/components/LightboxModal';
import btnCloseZoom from '@commons/images/btnCloseZoom.png';
import IconDownload from '@commons/images/icons/download.svg';
import IconExpand from '@commons/images/icons/expand.svg';
import IconZoomOut from '@commons/images/icons/minus.svg';
import IconZoomIn from '@commons/images/icons/plus.svg';
import IconZoomBack from '@commons/images/icons/zoomOut.svg';
import msg from '@commons/languages';

import { fileDownloadUrl, isPDF } from '@apps/domain/models/exp/Receipt';

import { State } from '../../../../modules';

import './index.scss';

const ROOT = 'approvals-pc-expenses-pre-approval-pane-detail-side-file-preview';
const MAX_SCALE = 2;
const MIN_SCALE = 1;
const SCALE_INCREMENT = 0.25;

type Props = {
  hideSideFile: () => void;
};

const SideFilePreview = (props: Props) => {
  const [scale, setScale] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false);

  const file = useSelector(
    (state: State) => state.ui.expenses.detail.sideFilePreview
  );

  useEffect(() => {
    setScale(1);
  }, [file.id]);

  const isPdf = isPDF(file.dataType);
  const downloadUrl = fileDownloadUrl(file.id);

  if (!downloadUrl) {
    return null;
  }

  let img;
  if (isPdf) {
    const pdfScaleCss = {
      transformOrigin: '0 0',
      width: `${100 * scale}%`,
      height: `${100 * scale}%`,
    };
    const attrHideTools = '#toolbar=0&view=FitH';
    img = (
      <div className={`${ROOT}-pdf`}>
        <object
          data={`${downloadUrl}${attrHideTools}`}
          type="application/pdf"
          style={pdfScaleCss}
        >
          <p>{msg().Exp_Lbl_Receipt}</p>
        </object>
      </div>
    );
  } else {
    const imgScaleCss = {
      transform: `scale(${scale})`,
      transformOrigin: '0 0',
    };
    img = (
      <img
        alt={msg().Exp_Lbl_Receipt}
        className={`${ROOT}-img`}
        src={downloadUrl}
        style={imgScaleCss}
      />
    );
  }

  const closeBtn = (
    <IconButton
      src={btnCloseZoom}
      onClick={props.hideSideFile}
      alt="close"
      className={`${ROOT}-hide`}
    />
  );

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };
  const download = (
    <IconButton
      srcType="svg"
      src={IconDownload}
      onClick={handleDownload}
      className={`${ROOT}-download`}
    />
  );

  const isZoomInDisabled = scale >= MAX_SCALE;
  const isZoomOutDisabled = scale <= MIN_SCALE;
  const handleZoomOut = () => {
    const nextScale = scale - SCALE_INCREMENT;
    setScale(nextScale);
  };
  const handleZoomBack = () => {
    setScale(MIN_SCALE);
  };
  const handleZoomIn = () => {
    const nextScale = scale + SCALE_INCREMENT;
    setScale(nextScale);
  };

  const zoomOut = (
    <IconButton
      srcType="svg"
      src={IconZoomOut}
      onClick={handleZoomOut}
      className={`${ROOT}-controls-btn`}
      disabled={isZoomOutDisabled}
    />
  );
  const zoomBack = (
    <IconButton
      srcType="svg"
      src={IconZoomBack}
      onClick={handleZoomBack}
      className={`${ROOT}-controls-btn`}
      disabled={isZoomOutDisabled}
    />
  );
  const zoomIn = (
    <IconButton
      srcType="svg"
      src={IconZoomIn}
      onClick={handleZoomIn}
      className={`${ROOT}-controls-btn`}
      disabled={isZoomInDisabled}
    />
  );

  const toggleModal = (e?: React.SyntheticEvent<HTMLButtonElement, Event>) => {
    if (e) {
      e.stopPropagation();
    }
    setIsShowModal(!isShowModal);
  };
  const expand = (
    <IconButton
      srcType="svg"
      src={IconExpand}
      onClick={toggleModal}
      className={`${ROOT}-controls-btn`}
    />
  );

  const controlPanel = (
    <div className={`${ROOT}-controls`}>
      {download}
      {zoomOut}
      {zoomBack}
      {zoomIn}
      {expand}
    </div>
  );

  const alt = (
    <div className={`${ROOT}-alt`}>{msg().Exp_Msg_CannotLoadPreview}</div>
  );

  return (
    <>
      <div className={ROOT}>
        {isPdf && alt}
        {img}
        {closeBtn}
        {controlPanel}
      </div>

      <CSSTransition
        in={isShowModal}
        timeout={500}
        classNames={`${ROOT}__modal-container`}
        unmountOnExit
      >
        <LightboxModal
          src={downloadUrl}
          toggleLightbox={toggleModal}
          fileType={file.dataType}
        />
      </CSSTransition>
    </>
  );
};

export default SideFilePreview;
