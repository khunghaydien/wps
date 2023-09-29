import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@resource/modules';

import * as appActions from '@resource/action-dispatchers/App';

import App from '@resource/components';

const AppContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeRoute = useSelector((state: State) => state.ui.siteRoute);

  useEffect(() => {
    dispatch(appActions.initialize());
  }, []);

  return <App activeRoute={activeRoute} />;
};

export default AppContainer;
