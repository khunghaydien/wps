import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { catchBusinessError } from '@commons/actions/app';
import msg from '@commons/languages';

import { State } from '@psa/modules';

import {
  initializeProjectUpload,
  uploadProject,
} from '@psa/action-dispatchers/ProjectUpload';

import FileUploadView from '@psa/components/ProjectScreen/FileUpload';

const FileUploadContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const projectUploadInfo = useSelector(
    (state: State) => state.entities.psa.projectUploadInfo
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
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
  const processUploadProject = (projectId: string, file: File) => {
    dispatch(uploadProject(projectId, selectedGroup.id, file));
  };

  const Actions = bindActionCreators(
    {
      initializeProjectUpload,
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
      uploadProject={processUploadProject}
    />
  );
};

export default FileUploadContainer;
