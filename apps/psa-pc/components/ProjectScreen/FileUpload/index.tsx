import React from 'react';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';

import { Project } from '@apps/domain/models/psa/Project';
import {
  MAX_ERROR_LOG_LINE,
  ProjectUploadInfo,
} from '@apps/domain/models/psa/ProjectUpload';

import ProjectUpload from './ProjectUpload';
import ErrorIcon from '@psa/images/icons/exclamation.svg';
import MarkIcon from '@psa/images/icons/mark.svg';

import './index.scss';

export const ROOT = 'ts-psa__file-upload';

type Props = {
  initializeProjectUpload: () => void;
  isLoading: boolean;
  projectUploadInfo: ProjectUploadInfo;
  selectedProject: Project;
  showErrorDialog: (err: string) => void;
  uploadProject: (projectId: string, file: File) => void;
};

const FileUpload = (props: Props) => {
  const { uploadSuccess, allowUpload, errorLog } = props.projectUploadInfo;

  const showUploadSuccess = uploadSuccess && allowUpload && errorLog === '';
  const showUploadError = !uploadSuccess && errorLog !== '';
  const showUploadDropzone = !uploadSuccess && !allowUpload && errorLog === '';

  const errorLogList = errorLog.split(',');

  const onClickDownloadErrorLog = () => {
    const dataContent =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(errorLogList.map((e) => e).join('\n'));

    const link = document.createElement('a');
    link.setAttribute('href', dataContent);
    link.setAttribute('download', 'error.log');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`${ROOT}`}>
      <PSACommonHeader
        title={msg().Psa_Lbl_ProjectFileUpload}
      ></PSACommonHeader>

      {!props.isLoading && (
        <div className={`${ROOT}__content`}>
          {showUploadSuccess && (
            <div className={`${ROOT}__message-container`}>
              <MarkIcon className={`${ROOT}__success-icon`} />
              <span className={`${ROOT}__message-header`}>
                {msg().Psa_Msg_SuccessfulProjectUploadHeader}
              </span>
              <span className={`${ROOT}__message-body`}>
                {msg().Psa_Msg_SuccessfulProjectUploadMessage1}
              </span>
              <span className={`${ROOT}__message-body`}>
                {msg().Psa_Msg_SuccessfulProjectUploadMessage2}
              </span>
            </div>
          )}
          {showUploadError && (
            <div className={`${ROOT}__message-container`}>
              <ErrorIcon />
              <span className={`${ROOT}__message-header`}>
                {msg().Psa_Msg_ErrorHeader}
              </span>
              <span className={`${ROOT}__message-body`}>
                {msg().Psa_Msg_ErrorMessage}
              </span>
              <Button
                className={`${ROOT}__refresh-btn`}
                data-testid={`${ROOT}__refresh-btn`}
                onClick={props.initializeProjectUpload}
              >
                <RefreshIcon />
              </Button>
              <div className={`${ROOT}__table-container`}>
                <table className={`${ROOT}__table`}>
                  <tr className={`${ROOT}__table-header-row`}>
                    <th>#</th>
                    <th>Error logs</th>
                  </tr>
                  {errorLogList
                    .slice(0, MAX_ERROR_LOG_LINE)
                    .map((log, index) => (
                      <tr className={`${ROOT}__table-body-row`}>
                        <td>{index + 1}</td>
                        <td className={`${ROOT}__table-body-row-item`}>
                          {log}
                        </td>
                      </tr>
                    ))}
                </table>
                <span className={`${ROOT}_download-message`}>
                  {msg().Psa_Lbl_ProjectUploadErrorLogMessage}
                </span>
                <span className={`${ROOT}_download-link-container`}>
                  <a onClick={onClickDownloadErrorLog}>Download Error Log</a>
                </span>
              </div>
            </div>
          )}

          {showUploadDropzone && (
            <ProjectUpload
              projectId={props.selectedProject.projectId}
              showErrorDialog={props.showErrorDialog}
              uploadProject={props.uploadProject}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
