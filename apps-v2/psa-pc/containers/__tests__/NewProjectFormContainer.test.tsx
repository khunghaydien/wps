import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DialogProvider from './../../../../apps/core/contexts/DialogProvider';

import NewProjectFormContainer from '../NewProjectFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('NewProjectFormContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    const state = {
      userSetting: {
        companyId: 'a0h6D000000jTzOQAU',
        employeeId: 'a0y6D000001H0ZuQAK',
      },
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
    };
    store = mockStore(state);
    await act(() => {
      component = renderer.create(
        <Provider store={store}>
          <DialogProvider>
            <NewProjectFormContainer />
          </DialogProvider>
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
