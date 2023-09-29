import React from 'react';
import { Provider } from 'react-redux';
import { AnyAction, CombinedState, Store } from 'redux';

import { State } from './modules';

import Component from './containers/WorkCategoryDropdownContainer';

import configureStore from './store/configureStore';

const configuredStore: Store<
  CombinedState<State>,
  AnyAction
> = configureStore();

type Props = React.ComponentProps<typeof Component>;

const App: React.FC<Props> = (props: Props) => {
  return (
    <Provider store={configuredStore}>
      <Component {...props} />
    </Provider>
  );
};

export default App;
