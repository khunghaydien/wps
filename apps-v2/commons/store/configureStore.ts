import { AnyAction, applyMiddleware, createStore, Store } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer, { State } from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger
)(createStore);

export default function configureStore(
  initialState?: State
): Store<State, AnyAction> {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      /* eslint-disable  @typescript-eslint/no-var-requires */
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
