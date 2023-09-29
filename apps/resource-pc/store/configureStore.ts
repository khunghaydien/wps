/* eslint-disable global-require, import/newline-after-import */
import { AnyAction, applyMiddleware, compose, createStore, Store } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer, { State } from '@resource/modules';

const PRODUCTION = process.env.NODE_ENV === 'production';
const TEST = process.env.NODE_ENV === 'test';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore(
  initialState?: State
): Store<State, AnyAction> {
  const middlewares = [thunkMiddleware];
  if (!PRODUCTION && !TEST) {
    // @ts-ignore
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const newRootReducer = require('../modules').default;
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
}
