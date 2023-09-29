import React from 'react';

import styled from 'styled-components';

import {
  AttachedFile,
  AttachedFiles,
} from '@apps/domain/models/common/AttachedFile';

import AttachmentPreview from './AttachmentPreview';

export type Props = {
  attachmentList: AttachedFiles;
  selectedAttachment: AttachedFile;
  onClickAttachment: (attachmentIndex: number) => void;
};

const AttachmentGalleryPane = ({
  attachmentList = [],
  selectedAttachment,
  onClickAttachment,
}: Props) => {
  const { attachedFileVerId: selectedAttachedFileId = '' } =
    selectedAttachment || {};

  return (
    <AttachmentGalleryPaneContainer>
      {attachmentList.map((attachment, index) => {
        const {
          attachedFileVerId,
          attachedFileName,
          attachedFileExtension,
          attachedFileDataType,
        } = attachment;

        return (
          <GalleryItem
            key={attachedFileVerId}
            onClick={() => onClickAttachment(index)}
            onDragStart={(e) => e.preventDefault()}
          >
            <SelectionWrapper
              $isSelected={attachedFileVerId === selectedAttachedFileId}
            >
              <AttachmentPreview attachment={attachment} height={120} />
            </SelectionWrapper>
            <AttachmentName>{`${attachedFileName}.${
              attachedFileExtension || attachedFileDataType
            }`}</AttachmentName>
          </GalleryItem>
        );
      })}
    </AttachmentGalleryPaneContainer>
  );
};

export default AttachmentGalleryPane;

const AttachmentGalleryPaneContainer = styled.div`
  width: 20%;
  min-width: 150px;
  height: 100%;
  background-color: #efefef;
  padding: 10px;
  cursor: default;
  overflow: scroll;
`;

const GalleryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const AttachmentName = styled.div`
  text-align: center;
  word-break: break-all;
  font-size: 12px;
`;

const SelectionWrapper = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  border: ${({ $isSelected }) =>
    $isSelected ? '3px solid #3f90ee' : '3px solid transparent'};
  border-radius: 8px;
  padding: 8px;
  overflow: hidden;
`;
