import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import RoleDetailsContainer from '../RoleDetailsContainer';

const mockStore = configureStore([thunk]);

const state = {
  common: {
    app: { loadingDepth: 0 },
  },
  entities: {
    psa: {
      access: {
        canConfirmProjectRoles: true,
        canUploadProjectRoles: true,
      },
      activity: {
        activity: {
          title: 'Act -Upload',
          status: 'InProgress',
          roles: [],
          projectId: 'a2J6D00000A8uHfUAJ',
          plannedStartDate: '2022-02-04',
          plannedEndDate: '2022-02-28',
          leadPhotoUrl: null,
          leadName: null,
          leadBaseId: null,
          activityId: 'a226D000000tKZGQA2',
          projectStatus: 'InProgress',
          projectStartDate: '2022-02-04',
          projectName: 'Test -2540',
          projectEndDate: '2022-02-28',
          jobId: 'a1A6D000004PQcUUAW',
          jobCode: 'FIL_UPLOAD_COM01_ACt_COM_01',
          description: null,
          code: 'ACt_COM_01',
          closeDate: null,
        },
      },
      project: {
        pageNum: 1,
        project: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: 'a0e6D000001qQ7cQAE',
          workTimePerDay: 480,
          workingDayWED: true,
          workingDayTUE: true,
          workingDayTHU: true,
          workingDaySUN: false,
          workingDaySAT: false,
          workingDayMON: true,
          workingDayFRI: true,
          status: 'InProgress',
          startDate: '2022-02-04',
          revisionComment: null,
          projectId: 'a2J6D00000A8uHfUAJ',
          pmName: 'Sista Aadmi',
          pmCode: 'TDEMP000',
          pmBaseId: 'a0v6D000000u7L6QAI',
          name: 'Test -2540',
          jobId: 'a1A6D000004PQcPUAW',
          jobCode: 'FIL_UPLOAD_COM01',
          groupName: 'TD Resource Group 01',
          groupId: 'a2A6D000000qxROUAY',
          endDate: '2022-02-28',
          description: null,
          deptName: null,
          deptId: null,
          deptCode: null,
          currentDetailId: 'a2F6D000000UCuPUAW',
          code: 'FIL_UPLOAD_COM01',
          closeDate: null,
          clientName: null,
          clientId: null,
          clientCode: null,
          calendarId: 'a0d6D0000019mA6QAI',
        },
      },
      psaExtendedItem: {
        project: [],
        role: [],
      },
      projectFinance: {
        labourFinanceType: '',
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
          assignments: [],
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
    ApiMock.invoke.mockResolvedValue({});
    store = mockStore(state);
    await renderer.act(async () => {
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
