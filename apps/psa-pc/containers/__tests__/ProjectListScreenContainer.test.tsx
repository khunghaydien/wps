import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectListScreenContainer from '../ProjectListScreenContainer';

const mockStore = configureStore([thunk]);

const state = {
  userSetting: {
    companyId: '',
    employeeName: '',
  },
  entities: {
    departmentList: [],
    psa: {
      psaGroup: {
        selectedGroup: {
          code: 'PSAG001',
          companyId: 'a0Y6D000001oEHEUA2',
          groupType: 'PsaGroup',
          id: 'a1l6D000001lgKtQAI',
          isOwned: null,
          name: 'PSA Group 1',
          name_L0: 'PSA Group 1',
          name_L1: 'PSA Group 1',
        },
      },
      project: {
        pageSize: 1,
        pageNum: 1,
        totalRecords: 24,
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
      },
    },
  },
  ui: {
    filter: {
      project: {
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
        projectEndDate: ['2022-02-10', ''],
        statusList: ['Planning', 'InProgress'],
      },
    },
  },
};

describe('ProjectListHeaderContainer Test', () => {
  let store;
  let component;
  const props = {
    activeDialog: [''],
    overlapProject: () => {},
  };
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ProjectListScreenContainer
            activeDialog={props.activeDialog}
            overlapProject={props.overlapProject}
          />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
