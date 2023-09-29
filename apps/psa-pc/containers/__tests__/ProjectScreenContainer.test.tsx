import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import ProjectScreenView from '@psa/components/ProjectScreen';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import ProjectScreenContainer from '../ProjectScreenContainer';

const mockStore = configureStore([thunk]);

// state.common.app.loadingDepth
const state = {
  common: {
    app: {
      loadingDepth: 0,
    },
  },
  userSetting: {
    companyId: '',
  },
  entities: {
    psa: {
      access: {
        canConfirmProjectRoles: true,
        canUploadProjectRoles: true,
      },
      activity: {
        activityList: [],
      },
      project: {
        totalRecords: 24,
        totalPages: 3,
        pageSize: 10,
        pageNum: 1,
        pageData: [
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-01-25',
            projectJobCode: 'TDC',
            projectId: 'a1uN0000002Wj84IAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'TD QA Project',
            endDate: '2023-01-25',
            deptName: null,
            currentDetailId: 'a1qN0000003cg3mIAA',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDC',
            projectId: 'a1uN0000002Wq3gIAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Auto Project 1644212831St',
            endDate: '2022-12-31',
            deptName: null,
            currentDetailId: 'a1qN0000003chZYIAY',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 600,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDC',
            projectId: 'a1uN0000002Wq4tIAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Auto Project 1644214630St',
            endDate: '2022-12-31',
            deptName: null,
            currentDetailId: 'a1qN0000003chbKIAQ',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 600,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDC',
            projectId: 'a1uN0000002Wq5XIAS',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Auto Project 1644215151St',
            endDate: '2022-12-31',
            deptName: null,
            currentDetailId: 'a1qN0000003chc3IAA',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-04',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002WpPFIA0',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Test -2561',
            endDate: '2022-02-28',
            deptName: null,
            currentDetailId: 'a1qN0000003chWkIAI',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002Wq3WIAS',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Project Activity1644212960',
            endDate: '2022-07-07',
            deptName: null,
            currentDetailId: 'a1qN0000003chZEIAY',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002Wq3lIAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Scheduling 1644212999',
            endDate: '2022-03-07',
            deptName: null,
            currentDetailId: 'a1qN0000003chZTIAY',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002Wq3qIAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Rescheduling 1644213008',
            endDate: '2022-12-31',
            deptName: null,
            currentDetailId: 'a1qN0000003chZdIAI',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002Wq40IAC',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'COMMENT 1644213110',
            endDate: '2022-02-21',
            deptName: null,
            currentDetailId: 'a1qN0000003chZnIAI',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 600,
            status: 'InProgress',
            startDate: '2022-02-07',
            projectJobCode: 'TDJOB001',
            projectId: 'a1uN0000002Wq4KIAS',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a0kN000000EeVq5IAF',
            name: 'Edit Schedule 1644213404',
            endDate: '2022-04-07',
            deptName: null,
            currentDetailId: 'a1qN0000003cha7IAA',
            companyId: 'a0YN000000CSVR2MAP',
            clientName: null,
            clientId: null,
          },
        ],
        project: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: 'a0YN000000CSVR2MAP',
          workTimePerDay: 480,
          workingDayWED: true,
          workingDayTUE: true,
          workingDayTHU: true,
          workingDaySUN: false,
          workingDaySAT: false,
          workingDayMON: true,
          workingDayFRI: true,
          status: 'InProgress',
          startDate: '2022-01-25',
          revisionComment: null,
          projectId: 'a1uN0000002Wj84IAC',
          pmName: 'Sista Aadmi',
          pmCode: 'TDEMP000',
          pmBaseId: 'a0kN000000EeVq5IAF',
          name: 'TD QA Project',
          jobId: 'a0xN0000003qVKJIA2',
          jobCode: 'TDC',
          groupName: 'TD Resource Group 01',
          groupId: 'a1lN000000CFCbxIAH',
          endDate: '2023-01-25',
          description: null,
          deptName: null,
          deptId: null,
          deptCode: null,
          currentDetailId: 'a1qN0000003cg3mIAA',
          code: 'TDC',
          closeDate: null,
          clientName: null,
          clientId: null,
          clientCode: null,
          calendarId: 'a0WN000000G6ncxMAB',
        },
        data: null,
      },
      resource: {
        resourceList: [],
      },
      role: {
        role: {
          roleId: '',
        },
      },
      request: {
        pageSize: 0,
      },
      setting: {
        enableProject: false,
      },
      projectFinance: {
        labourFinanceType: '',
      },
      psaGroup: {
        selectedGroup: {
          id: 'test-selected-group',
        },
      },
    },
  },
  ui: {
    sidebar: 'ACTIVITY',
    mode: 'INITIALIZE',
    dialog: {
      activeDialog: [],
    },
    filter: {
      projectTitle: '',
      projectCode: '',
      projectManagerCode: '',
      clientName: '',
      jobId: '',
      deptName: '',
      requester: '',
      requesterCode: '',
      projectManager: 'Sista Aadmi',
      projectStartDate: ['', ''],
      projectEndDate: ['2022-02-15', ''],
      statusList: ['Planning', 'InProgress'],
    },
  },
};

describe('ProjectScreenContainer Test', () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);

    ApiMock.reset();
  });
  afterEach(cleanup);

  it('it renders without crashing', () => {
    ApiMock.setDummyResponse('/psa/activity/list', []);
    ApiMock.setDummyResponse(
      '/psa/jobgrade/search',
      { companyId: '', psaGroupId: 'test-selected-group' },
      {
        jobGrades: [],
      }
    );
    component = renderer.create(
      <Provider store={store}>
        <ProjectScreenContainer />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event to switch screen', () => {
    ApiMock.setDummyResponse('/psa/activity/list', []);
    ApiMock.setDummyResponse(
      '/psa/jobgrade/search',
      { companyId: '', psaGroupId: 'test-selected-group' },
      {
        jobGrades: [],
      }
    );

    component = mount(
      <Provider store={store}>
        <ProjectScreenContainer />
      </Provider>
    );
    const projectPage = component.find(ProjectScreenView).props();
    projectPage.switchTo('');
    expect(store.dispatch).toHaveBeenCalled();
  });
});
