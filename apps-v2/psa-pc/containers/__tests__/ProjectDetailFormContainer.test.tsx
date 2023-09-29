import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DialogProvider from './../../../../apps/core/contexts/DialogProvider';

import ProjectDetailFormContainer from '../ProjectDetailFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('ProjectDetailFormContainer Test', () => {
  let store;
  let component;

  const initialState = {
    common: {
      app: {
        loadingDepth: 0,
      },
    },
    entities: {
      departmentList: [],
      psa: {
        project: {
          project: [],
          pageSize: 1,
        },
        activity: {
          activityList: [],
        },
        psaExtendedItem: {},
        resourceGroup: {
          detail: [],
        },
        projectManager: {},
        resourceManager: {},
        setting: {},
        resource: {},
        role: {
          role: {},
        },
        projectFinance: {},
      },
      clientInfo: {
        opportunity: {},
        client: {},
      },
      employeeList: [],
      customHint: {},
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
  beforeEach(async () => {
    store = mockStore(initialState);
    await act(() => {
      component = renderer.create(
        <Provider store={store}>
          <DialogProvider>
            <ProjectDetailFormContainer permission={''} />
          </DialogProvider>
        </Provider>
      );
    });
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
