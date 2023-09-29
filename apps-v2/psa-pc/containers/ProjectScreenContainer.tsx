import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';
import { modes } from '@psa/modules/ui/mode';

import { switchToSidebar } from '@psa/action-dispatchers/PSA';

import ProjectScreenView from '@psa/components/ProjectScreen';

type Props = {
  permission?: string;
};

const ProjectScreenContainer = (props: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const accessSetting = useSelector(
    (state: State) => state.entities.psa.access
  );
  const activeTab = useSelector((state: State) => state.ui.sidebar);
  const mode = useSelector((state: State) => state.ui.mode);
  const enableProjectFinance = useSelector(
    (state: State) => state.entities.psa.setting.enableProjectFinance
  );

  const switchTo = (component: string) => {
    if (mode === modes.PROJECT_EDIT) {
      dispatch(
        confirm(msg().Psa_Msg_ConfirmDiscardChanges, (yes) => {
          if (yes) {
            dispatch(switchToSidebar(component));
          }
        })
      );
    } else {
      dispatch(switchToSidebar(component));
    }
  };

  return (
    <ProjectScreenView
      permission={props.permission}
      accessSetting={accessSetting}
      activeTab={activeTab}
      enableProjectFinance={enableProjectFinance}
      switchTo={switchTo}
    />
  );
};

export default ProjectScreenContainer;
