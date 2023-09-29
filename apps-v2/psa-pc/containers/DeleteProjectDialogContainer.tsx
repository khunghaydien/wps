import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import PsaConfirmDialog from '@apps/commons/components/psa/Dialog/ConfirmDialog';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';

import { deleteProject } from '@psa/action-dispatchers/Project';
import { hideDialog } from '@psa/action-dispatchers/PSA';

const DeleteProjectDialogContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  const onClickOk = () => {
    const { projectId } = selectedProject;
    dispatch(deleteProject(projectId));
  };
  const onClickCancel = () => {
    dispatch(hideDialog());
  };

  const message = msg().Psa_Lbl_DeleteProject;

  return (
    <PsaConfirmDialog
      message={message}
      onClickCancel={onClickCancel}
      onClickOk={onClickOk}
    />
  );
};

export default DeleteProjectDialogContainer;
