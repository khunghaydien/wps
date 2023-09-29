/* eslint-disable global-require, import/newline-after-import */
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import logger from 'redux-logger';
// 本来は使いたくないが
// Global Container の社員切替が使用しているので
// しかたなく導入している
import thunkMiddleware from 'redux-thunk';

import rootReducer, { State } from '../modules';

const PRODUCTION = process.env.NODE_ENV === 'production';
const TEST = process.env.TEST === 'test';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore(initialState?: State) {
  const middleWares: Middleware[] = [
    // 本来は使いたくないが
    // Global Container の社員切替が使用しているので
    // しかたなく導入している
    thunkMiddleware,
  ];
  if (!PRODUCTION && !TEST) {
    middleWares.push(logger);
  }
  const store = createStore(
    rootReducer,
    initialState, // Redux DevTools Extension
    composeEnhancers(applyMiddleware(...middleWares))
  );

  if (!PRODUCTION && module.hot) {
    module.hot.accept('../modules', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const newRootReducer = require('../modules').default;
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
}
