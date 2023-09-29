import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import EmptyScreenPlaceholder from '@apps/commons/components/psa/EmptyScreenPlaceholder';
import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';
import { actions as modeActions, modes } from '@psa/modules/ui/mode';

import * as appActions from '@psa/action-dispatchers/App';
import {
  nonOverlapProject,
  openNewProjectDialog,
  overlapProject,
} from '@psa/action-dispatchers/PSA';
import { openViewAllResources } from '@psa/action-dispatchers/Resource';

import App from '@psa/components';

type Props = {
  projectId: string;
  permission: string;
};

const AppContainer = (props: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const isPM = useSelector((state: State) => state.userSetting.isPM);
  const activeRoute = useSelector((state: State) => state.ui.siteRoute);
  const mode = useSelector((state: State) => state.ui.mode);
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  useEffect(() => {
    const initialize = async () => {
      dispatch(appActions.initialize(props.projectId));
    };
    initialize();
  }, []);

  const onClickBackToProjectList = () => {
    const isEditMode = mode === modes.PROJECT_EDIT;

    if (isEditMode) {
      dispatch(
        confirm(msg().Psa_Msg_ConfirmDiscardChanges, (yes) => {
          if (yes) {
            dispatch(nonOverlapProject());
            dispatch(modeActions.initialize());
          }
        })
      );
    } else {
      dispatch(nonOverlapProject());
      dispatch(modeActions.initialize());
    }
  };

  const Actions = bindActionCreators(
    {
      nonOverlapProject,
      openNewProjectDialog,
      openViewAllResources,
      overlapProject,
    },
    dispatch
  );

  const renderApp = () => {
    if (isPM) {
      return (
        <App
          activeDialog={activeDialog}
          activeRoute={activeRoute}
          onClickBackToProjectList={onClickBackToProjectList}
          openNewProjectDialog={Actions.openNewProjectDialog}
          openViewAllResources={Actions.openViewAllResources}
          overlapProject={Actions.overlapProject}
          selectedProject={selectedProject}
          permission={props.permission}
        />
      );
    } else {
      return (
        <EmptyScreenPlaceholder
          headerMessage={msg().Psa_Lbl_RestrictedAccess}
          bodyMessage={msg().Psa_Lbl_RestrictedAccessBody}
          showEmptyScreen={true}
        />
      );
    }
  };

  return renderApp();
};

export default AppContainer;
