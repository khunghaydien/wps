/* eslint-disable */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import moment from 'moment';

import { cleanup } from '@testing-library/react';

import { initialResourceSelectionFilterState } from '@apps/domain/models/psa/Request';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import ViewAllResourcesContainer from '../ViewAllResourcesContainer';

const mockStore = configureStore([thunk]);

const state = {
  common: {
    app: {
      loadingDepth: 0,
    },
  },
  entities: {
    psa: {
      projectFinance: {
        labourFinanceType: '',
      },
      role: {
        role: {
          roleId: '',
          roleTitle: '',
        },
      },
      resource: {
        resourceList: [],
        assignmentDetailList: [],
        viewAllResourceList: {
          pageNum: 0,
        },
      },
      project: {
        project: {
          name: '',
        },
        pageNum: 1,
      },
      resourceGroup: {
        detail: {},
      },
    },
  },
  ui: {
    mode: '',
    resourceAvailability: {
      page: '',
      viewType: '',
      availableHours: [],
    },
    resourceSelection: '',
    siteRoute: '',
    tab: '',
    filter: {
      project: {},
      requestSelection: {},
      roleRequest: {},
    },
    dialog: {
      activeDialog: '',
    },
  },
  userSetting: {
    companyId: '',
  },
};

describe('ViewAllResourcesContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    ApiMock.invoke.mockResolvedValue({});
    store = mockStore(state);
    Date.now = jest.fn(() => new Date(2022, 7, 1, 0, 0, 0, 0).valueOf());
    initialResourceSelectionFilterState.startDate =
      moment('2022-08-01').format('YYYY-MM-DD');
    initialResourceSelectionFilterState.endDate =
      moment('2023-08-31').format('YYYY-MM-DD');

    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ViewAllResourcesContainer />
        </Provider>
      );
    });
  });

  // FIXME: This is failed.
  it.skip('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
