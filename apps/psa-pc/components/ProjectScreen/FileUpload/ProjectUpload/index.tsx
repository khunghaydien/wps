import React, { useState } from 'react';

import Dropzone from '@apps/commons/components/fields/Dropzone';
import FileIcon from '@apps/commons/images/icons/file.svg';
import TrashIcon from '@apps/commons/images/icons/trash.svg';
import UploadIcon from '@apps/commons/images/icons/upload.svg';
import msg from '@apps/commons/languages';

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@apps/domain/models/psa/ProjectUpload';

import { downloadCsvTemplate } from '@apps/admin-pc/utils/ProjectUploadUtil';

import './index.scss';

const ROOT = 'ts-psa__project-upload';

type Props = {
  projectId: string;
  showErrorDialog: (err: string) => void;
  uploadProject: (projectId: string, file: File) => void;
};

const ProjectUpload = (props: Props) => {
  const [uploadFile, setUploadFile] = useState(null);
  const renderLabelText = () => (
    <div className={`${ROOT}__label-text-container`}>
      <p className={`${ROOT}__label-logo`}>
        <UploadIcon />
      </p>
    </div>
  );

  const handleDropAccepted = (files: File[]) => {
    setUploadFile(files[0]);
  };

  const handleDropRejected = (files: File[]) => {
    const file = files[0];
    const size = file.size;
    const splitNameEtxn = file.name.split('.');
    const extension = splitNameEtxn[splitNameEtxn.length - 1];
    if (!ALLOWED_MIME_TYPES.includes(`.${extension}`)) {
      props.showErrorDialog(msg().Psa_Err_AllowOnlyCsvFileType);
    } else if (size > MAX_FILE_SIZE) {
      props.showErrorDialog(msg().Common_Err_MaxPSAFileSize);
    }
  };

  const onClickRemoveFile = () => {
    setUploadFile(null);
  };

  const onClickDownloadTemplate = () => {
    downloadCsvTemplate();
  };

  const onClickUpload = () => {
    props.uploadProject(props.projectId, uploadFile);
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__drop-zone-container`}>
        <div className={`${ROOT}__drop-zone-header`}></div>

        <div
          className={`${ROOT}__dropped-content`}
          style={{ display: uploadFile ? 'flex' : 'none' }}
        >
          <div className={`${ROOT}__file-name`}>
            <FileIcon />
            {uploadFile && uploadFile.name}
          </div>
          <div
            className={`${ROOT}__file-remove-btn`}
            onClick={onClickRemoveFile}
          >
            <TrashIcon />
            <span>{msg().Psa_Lbl_Remove}</span>
          </div>
          <div className={`${ROOT}__file-upload-btn`}>
            <button onClick={onClickUpload}>
              {msg().Psa_Lbl_ProjectUpload}
            </button>
          </div>
        </div>
        <div style={{ display: uploadFile ? 'none' : 'block' }}>
          <Dropzone
            accept={ALLOWED_MIME_TYPES.join()}
            buttontext={msg().Psa_Lbl_ProjectUploadBrowseFile}
            className={`${ROOT}__drop-zone`}
            disabled={false}
            labeltext={renderLabelText()}
            maxSize={MAX_FILE_SIZE}
            multiple={false}
            onDropAccepted={handleDropAccepted}
            onDropRejected={handleDropRejected}
          >
            <div></div>
          </Dropzone>
        </div>
        <div className={`${ROOT}__drop-zone-footer`}>
          <p>
            {msg().Psa_Lbl_ProjectUploadDownloadTemplate}
            <a onClick={onClickDownloadTemplate}>{msg().Psa_Lbl_Here}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectUpload;
