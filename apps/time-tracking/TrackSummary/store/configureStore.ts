/* eslint-disable global-require, import/newline-after-import */
import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  Middleware,
  Store,
  StoreEnhancer,
} from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer, { State } from '../modules';

const PRODUCTION = process.env.NODE_ENV === 'production';
const TEST = process.env.NODE_ENV === 'test';

interface ExtendedWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
}
declare let window: ExtendedWindow;

/* eslint-disable no-underscore-dangle */
function composeEnhancers(
  name = 'TrackSummary'
): (enhancer: StoreEnhancer) => StoreEnhancer {
  return !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name })
    : compose;
}

type Params = {
  name?: string;
  initialState?: Partial<State>;
};

export default function configureStore({
  name,
  initialState,
}: Params = {}): Store<typeof initialState, AnyAction> {
  const middlewares: Middleware[] = [thunkMiddleware];
  if (!PRODUCTION && !TEST) {
    middlewares.push(logger);
  }
  const store = createStore(
    rootReducer,
    initialState,
    // Redux DevTools Extension
    composeEnhancers(name)(applyMiddleware(...middlewares))
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
