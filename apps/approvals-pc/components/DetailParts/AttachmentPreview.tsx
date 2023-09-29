import React from 'react';

import Attachment from '@commons/components/Attachment';

import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';

import { SideFile } from '../../modules/ui/expenses/detail/sideFilePreview';

import './AttachmentPreview.scss';

type Props = {
  isApexView?: boolean;
  setSideFile: (sideFile: SideFile) => void;
  hideSideFile: () => void;
  attachedFileList: AttachedFiles | null | undefined;
};

const ROOT = 'approvals-pc-detail-parts-attachment-preview';

const AttachmentPreview = (props: Props) => {
  const attachedFileList = props.attachedFileList || [];

  const onOpenSideFile = (file) => (_fileVerId) => {
    const {
      attachedFileCreatedDate: createdDate,
      attachedFileDataType: dataType,
      attachedFileId: id,
      attachedFileName: name,
      attachedFileVerId: verId,
    } = file;

    // click the same pdf should trigger download popup
    props.hideSideFile();
    setTimeout(() => {
      props.setSideFile({ createdDate, dataType, id, name, verId });
    }, 1);
  };

  const renderAttachment = () => {
    const items = attachedFileList.map((receipt) => (
      <Attachment
        key={receipt.attachedFileId}
        className={`${ROOT}__attachment-item`}
        {...receipt}
        handlePreview={onOpenSideFile(receipt)}
        isPreview
        allowPdfPreview
      />
    ));
    return <div className={`${ROOT}__attachment-items`}>{items}</div>;
  };

  return <>{renderAttachment()}</>;
};

export default AttachmentPreview;
