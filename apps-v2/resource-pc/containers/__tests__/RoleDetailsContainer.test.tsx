import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import RoleDetailsContainer from '../RoleDetailsContainer';

const mockStore = configureStore([thunk]);

const state = {
  entities: {
    psa: {
      access: {},
      activity: {
        activity: {},
      },
      project: {
        pageNum: 1,
        project: {
          name: '',
        },
      },
      projectFinance: {
        labourFinanceType: '',
      },
      psaExtendedItem: {
        project: [],
        role: [],
      },
      resource: {
        resourceList: [],
      },
      role: {
        role: {
          roleId: '',
          roleTitle: '',
        },
      },
    },
  },
  userSetting: {
    companyId: '',
    currencyCode: '',
  },
  ui: {
    mode: '',
    resourceSelection: '',
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
};

describe('RoleDetailsContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    ApiMock.invoke.mockResolvedValue({});
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <RoleDetailsContainer />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
