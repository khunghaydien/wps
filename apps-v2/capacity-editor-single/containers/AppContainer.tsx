import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';
import { actions as availabilityActions } from '../modules/ui/capacityEditorResourceAvailabilities';

import * as appActions from '@apps/capacity-editor-single/action-dispatchers/App';

import App from '@apps/capacity-editor-single/components';

const AppContainer = (availabilityId) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const workSchemeList = useSelector(
    (state: State) => state.ui.psaWorkSchemeList
  );
  const workArrangementList = useSelector(
    (state: State) => state.ui.workArrangementList
  );
  const availabilityList = useSelector(
    (state: State) => state.ui.availabilityList
  );

  useEffect(() => {
    const initialize = async (availabilityId: string) => {
      dispatch(appActions.initialize(availabilityId));
    };
    if (availabilityId) {
      initialize(availabilityId.availabilityId);
    }
  }, [availabilityId]);

  if (availabilityList.length === 0) {
    return null;
  }

  const renderApp = () => {
    return (
      <App
        workSchemeList={workSchemeList}
        workArrangementList={workArrangementList}
        availabilityItem={availabilityList[0]}
        availabilityActions={availabilityActions}
      />
    );
  };

  return renderApp();
};

export default AppContainer;
