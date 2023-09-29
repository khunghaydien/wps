import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RoleDetailsContainer from '../RoleDetailsContainer';

const mockStore = configureStore([thunk]);

const state = {
  common: {
    app: { loadingDepth: 0 },
  },
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
      access: {
        canConfirmProjectRoles: true,
        canUploadProjectRoles: true,
      },
      activity: {
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
        pageNum: 1,
        project: {
          calendarId: 'a0WN000000G6ncxMAB',
          clientCode: null,
          clientId: null,
          clientName: null,
          closeDate: null,
          code: 'TDC',
          companyId: 'a0YN000000CSVR2MAP',
          currentDetailId: 'a1qN0000003cg3mIAA',
          deptCode: null,
          deptId: null,
          deptName: null,
          description: null,
          endDate: '2023-01-25',
          extendedItems: [],
          extendedItemValueId: null,
          groupId: 'a1lN000000CFCbxIAH',
          groupName: 'TD Resource Group 01',
          jobCode: 'TDC',
          jobId: 'a0xN0000003qVKJIA2',
          name: 'TD QA Project',
          pmBaseId: 'a0kN000000EeVq5IAF',
          pmCode: 'TDEMP000',
          pmName: 'Sista Aadmi',
          projectId: 'a1uN0000002Wj84IAC',
          revisionComment: null,
          startDate: '2022-01-25',
          status: 'InProgress',
          workingDayFRI: true,
          workingDayMON: true,
          workingDaySAT: false,
          workingDaySUN: false,
          workingDayTHU: true,
          workingDayTUE: true,
          workingDayWED: true,
          workTimePerDay: 480,
        },
      },
      psaExtendedItem: {
        project: [],
        role: [],
      },
      resourceGroup: { groups: [] },
      role: {
        role: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: null,
          workingDays: 23,
          useDefaultRate: false,
          status: 'Planning',
          startDate: '2022-02-04',
          roleTitle: 'Copy of role 1',
          roleId: 'a1cN000000356TzIAI',
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
          assignmentDueDate: '2022-02-04',
          activityId: 'a1dN0000006Uus5IAC',
          softBookDate: null,
          softBookBy: null,
          skills: [
            {
              required: true,
              ratingType: 'Score',
              name: 'Physical Exam',
              min: 8,
              max: 9,
              id: 'a1zN0000002SptBIAS',
              grades: null,
              deleted: false,
            },
          ],
          requesterDeptName: null,
          requesterDeptCode: null,
          requestDateTime: null,
          requestCode: '0000000003',
          requestByCode: null,
          requestBy: null,
          projectJobCode: 'TDC',
          projectDept: null,
          projectCode: 'TDC',
          memo: {
            visibleForRM: true,
            visibleForManagers: true,
            memoForRM: null,
            memoForManagers: null,
            memoForAll: null,
            id: 'a1nN00000043vApIAI',
          },
          jobGrades: [
            {
              name: 'TD Job Grade Level 1',
              id: 'a1mN0000003wWqBIAU',
              costRate: 1000,
            },
          ],
          jobCode: 'TDC_TDAC001',
          groupName: 'TD Resource Group 01',
          confirmDate: null,
          confirmBy: null,
          commentsHistory: null,
          clientName: null,
          assignments: null,
        },
      },
      request: {
        pageSize: 0,
        pageNum: 0,
      },
      resource: {
        resourceList: [],
      },
    },
  },
  ui: {
    mode: 'INITIALIZE',
    tab: 'Projects',
    dialog: {
      activeDialog: [],
    },
    siteRoute: 'ROLE_DETAILS',
    resourceSelection: {
      currentState: 'SEARCH_RESOURCE',
      currentIndex: -1,
      currentStrategy: 'AdjustConsiderAvailability',
      currentWorkHoursPerDay: 8,
      currentWorkHoursPercentPerDay: 100,
    },
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
        projectEndDate: ['2022-02-09', ''],
        statusList: ['Planning', 'InProgress'],
      },
      requestSelection: {
        assignmentDueDate: ['', ''],
        clientName: '',
        deptId: '',
        jobGradeIds: [],
        pmName: '',
        pmCode: '',
        projectCode: '',
        projectJobId: '',
        projectTitle: '',
        receivedDate: ['', ''],
        requestCode: '',
        requesterName: '',
        requesterCode: '',
        resourceGroup: '',
        rmName: '',
        roleStartDate: ['', ''],
        roleTitle: '',
        statusList: ['Requested', 'Scheduling'],
      },
      roleRequest: {
        assignmentDueDate: ['', ''],
        clientName: '',
        deptId: '',
        jobGradeIds: [],
        pmName: '',
        pmCode: '',
        projectCode: '',
        projectJobId: '',
        projectTitle: '',
        receivedDate: ['', ''],
        requestCode: '',
        requesterName: '',
        requesterCode: '',
        resourceGroup: '',
        rmName: '',
        roleStartDate: ['', ''],
        roleTitle: '',
        statusList: ['Requested', 'Scheduling'],
      },
    },
  },
  userSetting: {
    companyId: 'a0YN000000CSVR2MAP',
    currencyCode: 'JPY',
  },
};
describe('RoleDetailsContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
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

  // pass in necessary props
});
