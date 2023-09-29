import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import RoleRequestHeaderContainer from '../RoleRequestHeaderContainer';

const mockStore = configureStore([]);

const state = {
  userSetting: {
    companyId: '',
    currencyCode: '',
    employeeName: '',
  },
  ui: {
    mode: '',
    resourceSelection: {
      resource: {},
    },
    siteRoute: '',
    tab: '',
    filter: {
      project: {},
      requestSelection: {},
      roleRequest: {},
    },
    dialog: {
      activeDialog: [],
    },
  },
  entities: {
    departmentList: [],
    resourceGroupDetail: [],
    resourceGroupList: [],
    psa: {
      project: {
        project: {
          name: '',
        },
        pageNum: 1,
      },
      projectFinance: {
        labourFinanceType: '',
      },
      role: {
        role: {
          roleId: '',
          roleTitle: '',
        },
      },
      request: {
        pageSize: 1,
      },
      resource: {
        resourceList: [],
      },
      resourceGroup: {
        groups: [],
      },
    },
  },
};

describe('RoleRequestHeaderContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <RoleRequestHeaderContainer />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
