// @flow

/* eslint-disable global-require, import/newline-after-import */
import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../modules';

const PRODUCTION = process.env.NODE_ENV === 'production';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore(initialState: *) {
  const middlewares = [thunkMiddleware];
  if (!PRODUCTION) {
    middlewares.push(logger);
  }
  const store = createStore(
    rootReducer,
    initialState,
    // Redux DevTools Extension
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (!PRODUCTION && module.hot) {
    module.hot.accept('../modules', () => {
      const newRootReducer = require('../modules').default;
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
}