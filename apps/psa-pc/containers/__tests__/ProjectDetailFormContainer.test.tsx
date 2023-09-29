import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DialogProvider from '@apps/core/contexts/DialogProvider';

import ProjectDetailFormContainer from '../ProjectDetailFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('ProjectDetailFormContainer Test', () => {
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
  };
  beforeEach(() => {
    store = mockStore(initialState);
    component = renderer.create(
      <Provider store={store}>
        <DialogProvider>
          <ProjectDetailFormContainer />
        </DialogProvider>
      </Provider>
    );
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
