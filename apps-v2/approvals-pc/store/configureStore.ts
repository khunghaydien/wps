/* eslint-disable global-require, import/newline-after-import */
import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  Middleware,
  Store,
} from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer, { State } from '../modules';
import { middlewares as requestCountsMiddlewares } from '../modules/ui/requestCounts';

const PRODUCTION = process.env.NODE_ENV === 'production';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default function configureStore(
  initialState?: State
): Store<State, AnyAction> {
  let middlewares: Middleware[] = [thunkMiddleware];
  if (!PRODUCTION) {
    middlewares.push(logger);
  }

  middlewares = [...middlewares, ...requestCountsMiddlewares];

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
