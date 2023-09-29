import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import * as appActions from '@apps/capacity-editor-bulk/action-dispatchers/App';

import App from '@apps/capacity-editor-bulk/components';

const AppContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  useEffect(() => {
    const initialize = async () => {
      dispatch(appActions.initialize());
    };
    initialize();
  }, []);

  const renderApp = () => {
    return <App />;
  };

  return renderApp();
};

export default AppContainer;
