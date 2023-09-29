import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { catchBusinessError } from '@commons/actions/app';
import msg from '@commons/languages';

import { State } from '@psa/modules';

import {
  initializeProjectUpload,
  uploadProject,
} from '@psa/action-dispatchers/ProjectUpload';

import FileUploadView from '@psa/components/ProjectScreen/FileUpload';

const FileUploadContainer = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const projectUploadInfo = useSelector(
    (state: State) => state.entities.psa.projectUploadInfo
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  const showErrorDialog = (err: string) => {
    dispatch(
      catchBusinessError(
        msg().Admin_Lbl_ValidationCheck,
        msg().Psa_Lbl_ProjectUpload,
        err
      )
    );
  };

  const Actions = bindActionCreators(
    {
      initializeProjectUpload,
      uploadProject,
    },
    dispatch
  );

  return (
    <FileUploadView
      initializeProjectUpload={Actions.initializeProjectUpload}
      isLoading={isLoading}
      projectUploadInfo={projectUploadInfo}
      selectedProject={selectedProject}
      showErrorDialog={showErrorDialog}
      uploadProject={Actions.uploadProject}
    />
  );
};

export default FileUploadContainer;
