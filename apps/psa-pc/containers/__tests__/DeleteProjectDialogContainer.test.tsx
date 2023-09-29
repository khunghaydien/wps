import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DeleteProjectDialogContainer from '../DeleteProjectDialogContainer';

const mockStore = configureStore([thunk]);

const state = {
  entities: {
    psa: {
      project: {
        project: {},
      },
    },
  },
};
describe('DeleteProjectDialogContainer Test', () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore(state);
    component = renderer.create(
      <Provider store={store}>
        <DeleteProjectDialogContainer />
      </Provider>
    );
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  // pass in necessary props
});
