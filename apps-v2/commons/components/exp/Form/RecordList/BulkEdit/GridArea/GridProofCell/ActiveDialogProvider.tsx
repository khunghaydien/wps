import React, { createContext, useContext, useState } from 'react';

const AttachmentPreviewDialogContext = createContext({
  activeDialogId: '',
  enableActiveDialog: false,
  selectedAttachedFileId: '',
  updateActiveDialogId: (_activeDialogId) => {},
  updateSelectedAttachedFileId: (_attachFileId) => {},
});

export const useAttachmentPreviewDialog = () => {
  const {
    enableActiveDialog,
    activeDialogId,
    selectedAttachedFileId,
    updateActiveDialogId,
    updateSelectedAttachedFileId,
  } = useContext(AttachmentPreviewDialogContext);
  return {
    enableActiveDialog,
    activeDialogId,
    selectedAttachedFileId,
    updateActiveDialogId,
    updateSelectedAttachedFileId,
  };
};

const AttachmentPreviewProvider = ({
  children,
  enableActiveDialog = false,
}) => {
  const [activeDialogId, setActiveDialogId] = useState('');
  const [selectedAttachedFileId, setSelectedAttachedFileId] = useState('');

  return (
    <AttachmentPreviewDialogContext.Provider
      value={{
        enableActiveDialog,
        activeDialogId,
        selectedAttachedFileId,
        updateActiveDialogId: (activeDialogId) => {
          setActiveDialogId(activeDialogId);
        },
        updateSelectedAttachedFileId: (selectedAttachedFileId) => {
          setSelectedAttachedFileId(selectedAttachedFileId);
        },
      }}
    >
      {children}
    </AttachmentPreviewDialogContext.Provider>
  );
};

export default AttachmentPreviewProvider;
