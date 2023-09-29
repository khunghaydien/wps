import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ScheduleDetailsContainer from '../ScheduleDetailsContainer';

const mockStore = configureStore([thunk]);

const state = {
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
      },
      project: {
        project: {
          name: '',
        },
        pageNum: 1,
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
