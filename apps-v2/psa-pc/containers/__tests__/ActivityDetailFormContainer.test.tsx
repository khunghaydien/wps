import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ActivityDetailFormContainer from '../ActivityDetailFormContainer';

const mockStore = configureStore([thunk]);

const state = {
  entities: {
    psa: {
      activity: {
        activity: {},
        activityList: [],
      },
      project: {
        project: {},
      },
      setting: {
        useExistingJobCode: '',
      },
    },
  },
  userSetting: {
    companyId: '',
  },
};

// FIXME: Thrown 'Attempt to call useDialog out of dialog context. Make sure your app is rendered in DialogProvider.'
describe.skip('ActivityDetailFormContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ActivityDetailFormContainer />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
