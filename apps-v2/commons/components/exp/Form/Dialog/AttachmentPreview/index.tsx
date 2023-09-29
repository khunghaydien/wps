import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { CSSTransition } from 'react-transition-group';

import get from 'lodash/get';

import styled from 'styled-components';

import LightboxModal from '@apps/commons/components/LightboxModal';
import imgBtnCloseDialog from '@commons/images/btnCloseDialog.png';

import {
  AttachedFile,
  AttachedFiles,
} from '@apps/domain/models/common/AttachedFile';
import { fileDownloadUrl } from '@apps/domain/models/exp/Receipt';

import msg from '../../../../../languages';
import AttachmentGalleryPane from './AttachmentGalleryPane';
import AttachmentPreviewPane from './AttachmentPreviewPane';

const ROOT = 'ts-expenses-modal-attachment-preview';

export type Props = {
  attachmentList: AttachedFiles;
  dialogTitle?: string;
  isDialogCenter?: boolean;
  isFinanceApproval?: boolean;
  readOnly?: boolean;
  selectedAttachedFileId?: AttachedFile['attachedFileVerId'];
  onClickAttachment?: (attachmentIndex) => void;
  onClickDeleteAttachment?: (attachedFileId: string) => void;
  onClickHideDialogButton: () => void;
};

const AttachmentPreviewDialog = ({
  attachmentList = [],
  dialogTitle = msg().Com_Lbl_Attachments,
  selectedAttachedFileId,
  isDialogCenter = false,
  readOnly,
  isFinanceApproval,
  onClickHideDialogButton,
  onClickDeleteAttachment,
  onClickAttachment,
}: Props) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const selectedAttachmentIndex = (() => {
    const index = attachmentList.findIndex(
      ({ attachedFileVerId }) => attachedFileVerId === selectedAttachedFileId
    );

    return index === -1 ? 0 : index;
  })();
  const selectedAttachment =
    attachmentList?.[selectedAttachmentIndex] || undefined;
  const rndRef = useRef(null);
  const rndInitDefaultValues = {
    width: isDialogCenter ? 1000 : 800,
    height: 'auto',
    x: 0,
    y: 0,
  };

  const toggleModal = (e?: SyntheticEvent<HTMLButtonElement, Event>) => {
    if (e) {
      e.stopPropagation();
    }

    setIsShowModal(!isShowModal);
  };

  useEffect(() => {
    if (rndRef) {
      // if rnd component initialized, set component to specific position
      // if right side panel is open, position to left, otherwise center
      const rndEl = rndRef.current.getSelfElement();
      const { left, top, width } = rndEl.getBoundingClientRect();
      const attrStyles = rndEl.attributeStyleMap.get('transform');
      const cssTransformTranslateStyle = Array.from(attrStyles.values()).find(
        (attr) => attr
      );
      const x = get(cssTransformTranslateStyle, 'x');
      const y = get(cssTransformTranslateStyle, 'y');
      const offsetHeaderHeight = 75;

      const newPosition = isDialogCenter
        ? {
            x: -(left - (window.innerWidth - width) / 2),
            y: -(top - y.value - offsetHeaderHeight),
          }
        : {
            x: -(left - x.value),
            y: -(top - y.value - offsetHeaderHeight),
          };
      rndRef.current.updatePosition(newPosition);
    }
  }, [rndRef, isDialogCenter]);

  const renderFullScreen = () => {
    if (!selectedAttachment) {
      return null;
    }

    const { attachedFileId, attachedFileDataType } = selectedAttachment;
    const downloadUrl = fileDownloadUrl(attachedFileId);

    return (
      <CSSTransition
        in={isShowModal}
        classNames={`${ROOT}__modal-container`}
        timeout={500}
        unmountOnExit
      >
        <LightboxModal
          src={downloadUrl}
          toggleLightbox={toggleModal}
          fileType={attachedFileDataType}
        />
      </CSSTransition>
    );
  };

  return (
    <>
      <DraggableDialog
        ref={rndRef}
        className={ROOT}
        bounds=".ts-expenses__form"
        default={rndInitDefaultValues}
        cancel={`.${ROOT}__contents`}
        enableResizing={false}
      >
        <DialogWrapper className={ROOT}>
          <DialogHeader>
            <DialogHeaderTitle>{dialogTitle}</DialogHeaderTitle>

            <DialogHeaderCloseBtn
              onClick={onClickHideDialogButton}
              src={imgBtnCloseDialog}
              alt={msg().Com_Btn_Close}
              aria-hidden="true"
            />
          </DialogHeader>
          <DialogContents className={`${ROOT}__contents`}>
            <AttachmentGalleryPane
              attachmentList={attachmentList}
              selectedAttachment={selectedAttachment}
              onClickAttachment={(attachmentIndex) =>
                onClickAttachment(attachmentIndex)
              }
            />

            <AttachmentPreviewPane
              selectedAttachment={selectedAttachment}
              onClickDeleteAttachment={onClickDeleteAttachment}
              onClickFullScreen={toggleModal}
              isFinanceApproval={isFinanceApproval}
              readOnly={readOnly}
            />
          </DialogContents>
        </DialogWrapper>
      </DraggableDialog>

      {renderFullScreen()}
    </>
  );
};

export default AttachmentPreviewDialog;

const DraggableDialog = styled(Rnd)`
  width: 50vw !important;
  height: 80vh !important;
  box-shadow: 15px 15px 15px 15px rgb(0 0 0 / 30%);
  transition: width 0.5s, height 0.5s;
`;

const DialogWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const DialogHeader = styled.div`
  height: 45px;
  padding: 0 16px;
  border-bottom: solid 1px #d8dde6;
  background: #f4f6f9;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DialogHeaderTitle = styled.div`
  color: #53688c;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
`;

const DialogHeaderCloseBtn = styled.img`
  filter: invert(100%);
  cursor: pointer;
`;

const DialogContents = styled.div`
  display: flex;
  height: 100%;
`;
