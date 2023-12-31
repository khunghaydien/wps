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
      access: {},
      activity: {
        activityList: [],
        activity: {
          title: 'TD QA Activity',
          status: 'InProgress',
          roles: [],
          projectId: 'a1uN0000002Wj84IAC',
          plannedStartDate: '2022-01-25',
          plannedEndDate: '2022-07-24',
          leadPhotoUrl: null,
          leadName: null,
          leadBaseId: null,
          activityId: 'a1dN0000006Uus5IAC',
          projectStatus: 'InProgress',
          projectStartDate: '2022-01-25',
          projectName: 'TD QA Project',
          projectEndDate: '2023-01-25',
          jobId: 'a0xN0000003qVKOIA2',
          jobCode: 'TDC_TDAC001',
          description: null,
          code: 'TDAC001',
          closeDate: null,
        },
      },
      project: {
        totalRecords: 0,
        totalPages: 0,
        pageSize: 0,
        pageNum: 0,
        pageData: [],
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
      },
      psaExtendedItem: {
        project: [],
        role: [],
      },
      request: {
        totalRecords: 9,
        totalPages: 1,
        pageSize: 10,
        pageNum: 1,
        pageData: [
          {
            status: 'Requested',
            startDate: '2022-01-25',
            roleTitle: 'Copy of Copy of role 1',
            roleId: 'a1cN000000355G8IAI',
            isDirectAssign: false,
            endDate: '2022-02-24',
            assignmentDueDate: '2022-01-25',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000002',
            receivedDate: '2022-01-25',
            projectTitle: 'TD QA Project',
            projectManager: 'Sista Aadmi',
            projectJobCode: 'TDC',
            projectCode: 'TDC',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'Requested role',
            roleId: 'a1cN0000003591dIAA',
            isDirectAssign: false,
            endDate: '2022-09-02',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000020',
            receivedDate: '2022-02-07',
            projectTitle: 'PM- View - EMPTalentProfile1644213126',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644213172319',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022_1644215292',
            roleId: 'a1cN0000003592hIAA',
            isDirectAssign: false,
            endDate: '2022-02-14',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000027',
            receivedDate: '2022-02-07',
            projectTitle: 'Scheduling 1644215292',
            projectManager: 'Sista Aadmi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644215331506',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022_1644215292-1',
            roleId: 'a1cN00000035931IAA',
            isDirectAssign: false,
            endDate: '2022-02-19',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000030',
            receivedDate: '2022-02-07',
            projectTitle: 'Scheduling-2 1644215425',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644215466800',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022_1644215292-2',
            roleId: 'a1cN0000003593BIAQ',
            isDirectAssign: false,
            endDate: '2022-02-21',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000032',
            receivedDate: '2022-02-07',
            projectTitle: 'scheduling-3 1644215561',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644215594919',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 08/24/2021-1629772886',
            roleId: 'a1cN0000003593fIAA',
            isDirectAssign: false,
            endDate: '2022-03-09',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000038',
            receivedDate: '2022-02-07',
            projectTitle: 'Edit Schedule-2 1644216018',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644216054358',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022-1644216043',
            roleId: 'a1cN0000003593kIAA',
            isDirectAssign: false,
            endDate: '2022-02-21',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000039',
            receivedDate: '2022-02-07',
            projectTitle: 'COMMENT 1644216043',
            projectManager: 'Sista Aadmi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644216084857',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022-1644216138',
            roleId: 'a1cN0000003593uIAA',
            isDirectAssign: false,
            endDate: '2022-02-21',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000041',
            receivedDate: '2022-02-07',
            projectTitle: 'Nominate Multipl Res 1644216138',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644216177732',
            clientName: null,
          },
          {
            status: 'Requested',
            startDate: '2022-02-07',
            roleTitle: 'AUT 07/02/2022-1644216043',
            roleId: 'a1cN00000035949IAA',
            isDirectAssign: false,
            endDate: '2022-02-21',
            assignmentDueDate: '2022-02-07',
            resourceGroup: 'TD Resource Group 01',
            requestCode: '0000000044',
            receivedDate: '2022-02-07',
            projectTitle: 'COMMENT 1644216043',
            projectManager: 'Produ Managi',
            projectJobCode: 'TDJOB001',
            projectCode: 'PRO_1644216290034',
            clientName: null,
          },
        ],
        request: {
          status: 'Requested',
          startDate: '2022-01-25',
          roleTitle: 'Copy of Copy of role 1',
          roleId: 'a1cN000000355G8IAI',
          isDirectAssign: false,
          endDate: '2022-02-24',
          assignmentDueDate: '2022-01-25',
          resourceGroup: 'TD Resource Group 01',
          requestCode: '0000000002',
          receivedDate: '2022-01-25',
          projectTitle: 'TD QA Project',
          projectManager: 'Sista Aadmi',
          projectJobCode: 'TDC',
          projectCode: 'TDC',
          clientName: null,
        },
        data: null,
      },
      resource: {
        resourceList: [],
        resource: {
          availableTime: '',
          bookedTime: '',
          departmentName: '',
          name: '',
          position: '',
          totalCapacity: '',
        },
      },
      resourceGroup: {
        groups: [],
      },
      role: {
        role: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: null,
          workingDays: 23,
          useDefaultRate: false,
          status: 'Requested',
          startDate: '2022-01-25',
          roleTitle: 'Copy of Copy of role 1',
          roleId: 'a1cN000000355G8IAI',
          requiredTimePercentage: 10,
          requiredTime: 1080,
          remarks: null,
          maxWorkingTime: 11040,
          isDirectAssign: false,
          isActivityLead: false,
          groupId: 'a1lN000000CFCbxIAH',
          endDate: '2022-02-24',
          costRate: null,
          billRate: null,
          assignmentDueDate: '2022-01-25',
          activityId: 'a1dN0000006Uus5IAC',
          softBookDate: null,
          softBookBy: null,
          skills: [],
          requesterDeptName: 'DEPARTMENT QA',
          requesterDeptCode: 'DEP001',
          requestCode: '0000000002',
          requestByCode: 'TDEMP000',
          requestBy: 'Sista Aadmi',
          projectJobCode: 'TDC',
          projectDept: null,
          projectCode: 'TDC',
          memo: {
            visibleForRM: true,
            visibleForManagers: true,
            memoForRM: null,
            memoForManagers: null,
            memoForAll: null,
            id: 'a1nN00000043qmyIAA',
          },
          jobGrades: [
            {
              name: 'TD Job Grade Level 1',
              id: 'a1mN0000003wWqBIAU',
              costRate: 1000,
            },
          ],
          jobCode: 'JOB_1643092679116',
          groupName: 'TD Resource Group 01',
          confirmDate: null,
          confirmBy: null,
          commentsHistory: [
            {
              status: 'Requested',
              employeeName: 'Sista Aadmi',
              employeeId: 'a0kN000000EeVq5IAF',
              comments: null,
              action: 'Submit Request',
              createdDate: '2022-02-17',
            },
          ],
          clientName: null,
          assignments: null,
        },
      },
      setting: {},
    },
  },
  ui: {
    mode: 'INITIALIZE',
    siteRoute: 'ROLE_DETAILS',
    tab: 'Resource',
    dialog: {
      activeDialog: [],
    },
    resourceSelection: {
      currentState: 'SEARCH_RESOURCE',
      currentIndex: -1,
      currentStrategy: 'AdjustConsiderAvailability',
      currentWorkHoursPerDay: 8,
      currentWorkHoursPercentPerDay: 100,
    },
    filter: {},
  },
  userSetting: {
    companyId: '',
    currencyCode: '',
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
