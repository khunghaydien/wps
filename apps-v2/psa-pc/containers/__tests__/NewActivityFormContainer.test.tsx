import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DialogProvider from './../../../../apps/core/contexts/DialogProvider';

import NewActivityFormContainer from '../NewActivityFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('NewActivityFormContainer renders without crashing', () => {
  let store;
  let component;

  const initialState = {
    userSetting: {
      companyId: '',
    },
    entities: {
      psa: {
        setting: {},
        project: {
          project: {},
        },
        activity: {},
      },
    },
  };
  beforeEach(async () => {
    store = mockStore(initialState);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <DialogProvider>
            <NewActivityFormContainer />
          </DialogProvider>
        </Provider>
      );
    });
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
