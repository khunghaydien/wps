import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DialogProvider from '@apps/core/contexts/DialogProvider';

import NewProjectFormContainer from '../NewProjectFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('NewProjectFormContainer Test', () => {
  let store;
  let component;

  const initialState = {
    entities: {
      departmentList: [],
      psa: {
        project: {
          project: {},
          pageSize: 1,
        },
        activity: {
          activityList: [],
        },
        psaExtendedItem: {},
        resourceGroup: {
          detail: [],
          groups: [],
        },
        psaGroup: {
          selectedGroup: {},
        },
        projectManager: {},
        resourceManager: {},
        setting: {},
        resource: {},
        request: {},
        role: {
          role: {},
        },
        // projectFinance:{}
      },
      clientInfo: {
        opportunity: {},
        client: {},
      },
      employeeList: [],
    },
    ui: {
      filter: {
        project: {},
      },
      mode: '',
      dialog: {
        activeDialog: [],
      },
    },
    userSetting: {
      companyId: '',
    },
    common: {
      app: {
        loadingDepth: 0,
      },
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
    component = renderer.create(
      <Provider store={store}>
        <DialogProvider>
          <NewProjectFormContainer />
        </DialogProvider>
      </Provider>
    );
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
