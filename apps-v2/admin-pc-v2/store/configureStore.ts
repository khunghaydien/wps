import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers';

const PRODUCTION = process.env.NODE_ENV === 'production';

const composeEnhancers =
  !PRODUCTION && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : compose;

export default function configureStore(initialState: any) {
  const middlewares: Middleware[] = [thunkMiddleware];
  if (!PRODUCTION) {
    middlewares.push(logger);
  }

  const store = createStore(
    rootReducer,
    initialState, // Redux DevTools Extension
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (!PRODUCTION && module.hot) {
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const newRootReducer = require('../reducers').default;
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
}
