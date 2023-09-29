import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';

import ProjectFinanceContainer from '../ProjectFinanceContainer';

const mockStore = configureStore([thunk]);

const state = {
  userSetting: {
    companyId: 'test-company',
    currencyDecimalPlaces: 2,
    currencySymbol: '$',
  },
  ui: {
    tab: 'test-tab',
    mode: 'test-mode',
    filter: {},
  },
  entities: {
    psa: {
      setting: {
        useExistingJobCode: true,
      },
      project: {
        pageNum: 1,
        project: {
          projectId: 'test-project',
          projectName: 'test-project-name',
          startDate: '2022-06-28',
          endDate: '2022-06-28',
        },
      },
      role: {
        role: {
          roleTitle: 'test-role',
        },
      },
      resource: {
        resourceList: [],
      },
      projectFinance: {
        workingDays: {
          workdays: [],
          total: 0,
        },
        projectFinanceOverview: {
          revenue: {},
          cost: {},
          margin: {
            intervalTotals: [],
          },
        },
        projectInfo: [
          {
            hidden: true,
            key: 'project-id',
            value: 'a2U9D000000Hdp6UAC',
          },
          {
            key: 'project-title',
            label: 'Project Title',
            value: 'TD QA Project',
          },
          {
            key: 'project-code',
            label: 'Project Code',
            value: 'TDJOB001',
          },
          {
            key: 'project-manager',
            label: 'Project Manager',
            value: 'Sista Aadmi',
          },
          {
            key: 'project-duration',
            label: 'Project Duration',
            value: '2022/04/08 - 2023/04/08',
          },
          {
            key: 'project-client-name',
            label: 'Client Name',
            value: '-',
          },
        ],
        calculations: [
          {
            financeCategory: [
              {
                actual: 0,
                dataKey: 'Cost',
                diff: 0,
                label: 'Labour Cost',
                planned: 0,
              },
              {
                actual: 0,
                dataKey: 'CustomCost',
                diff: 0,
                label: 'Custom Cost',
                planned: 0,
              },
            ],
            financeType: 'Cost',
            total: { actual: 0, diff: 0, label: 'Total', planned: 0 },
          },
          {
            financeCategory: [
              {
                actual: 0,
                dataKey: null,
                diff: 0,
                label: 'Project Revenue',
                planned: 0,
              },
            ],
            financeType: 'Revenue',
            total: { actual: 0, diff: 0, label: 'Total', planned: 0 },
          },
        ],
        grossMargin: {
          actualPercent: 0,
          grossActual: 0,
          grossDifference: 0,
          grossPlanned: 0,
          plannedPercent: 0,
        },
      },
    },
  },
  common: {
    app: {
      loadingDepth: 0,
    },
  },
};

describe('ProjectFinanceContainer Test', () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
  });

  afterEach(cleanup);

  it('it renders without crashing', async () => {
    await act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ProjectFinanceContainer />
        </Provider>
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  // it('dispatch event to fetch finance info', () => {
  //   component = mount(
  //     <Provider store={store}>
  //       <ProjectFinanceContainer />
  //     </Provider>
  //   );
  //   component.find('.ts-psa__finance__refresh-btn').first().simulate('click');
  //   expect(store.dispatch).toHaveBeenCalled();
  // });

  // it('dispatch event to open labour page', () => {
  //   component = mount(
  //     <Provider store={store}>
  //       <ProjectFinanceContainer />
  //     </Provider>
  //   );
  //   const financePage = component.find(ProjectFinancePage).props();
  //   financePage.onClickLabourDetail('Cost');
  //   expect(store.dispatch).toHaveBeenCalled();
  // });

  // it('dispatch event to open finance category page', async () => {
  //   component = mount(
  //     <Provider store={store}>
  //       <ProjectFinanceContainer />
  //     </Provider>
  //   );
  //   const financePage = component.find(ProjectFinancePage).props();
  //   financePage.onClickFinanceDetail('CustomCost', 'cost');
  //   expect(store.dispatch).toHaveBeenCalled();
  // });
});
