import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ScheduleDetailsContainer from '../ScheduleDetailsContainer';

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
          assignment: {
            bookedTimePerDay: '',
            startDate: '',
            strategy: {
              schedulingStrategy: '',
            },
          },
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

describe('ScheduleDetailsContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ScheduleDetailsContainer />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
