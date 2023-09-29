import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { cleanup } from '@testing-library/react';

import RescheduleContainer from '../RescheduleContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const state = {
  common: {
    app: {
      loadingDepth: 0,
      loadingHint: '',
      error: null,
      unexpectedError: null,
      confirmDialog: null,
      loadingAreas: [],
    },
    userSetting: {
      usePsa: true,
      photoUrl: '',
      organizationSetting: {
        language2: null,
        language1: 'ja',
        language0: 'en_US',
      },
      organization: {
        isSandbox: true,
        id: '00D9D0000001Z3YUAU',
        enableErrorTracking: false,
      },
      name: 'User User',
      managerName: 'Sista Aadmi',
      locale: 'en-US',
      language: 'en-US',
      id: '0059D000003e0t6QAA',
      employeeName: 'Sista Aadmi',
      employeeId: 'a129D000000gyMtQAI',
      employeeCode: 'TDEMP000',
      currencySymbol: '',
      currencyName: null,
      currencyId: null,
      currencyDecimalPlaces: null,
      currencyCode: null,
      companyName: 'WSP AUTO API',
      companyId: 'a0l9D000002RTuvQAG',
    },
  },
  userSetting: {
    usePsa: true,
    photoUrl: '',
    organizationSetting: {
      language2: null,
      language1: 'ja',
      language0: 'en_US',
    },
    organization: {
      isSandbox: true,
      id: '00D9D0000001Z3YUAU',
      enableErrorTracking: false,
    },
    name: 'User User',
    managerName: 'Sista Aadmi',
    locale: 'en-US',
    language: 'en-US',
    id: '0059D000003e0t6QAA',
    employeeName: 'Sista Aadmi',
    employeeId: 'a129D000000gyMtQAI',
    employeeCode: 'TDEMP000',
    currencySymbol: '',
    companyName: 'WSP AUTO API',
    companyId: 'a0l9D000002RTuvQAG',
    belongsToResourceGroup: true,
  },
  ui: {
    siteRoute: 'RESCHEDULE',
    sidebar: 'ACTIVITY',
    mode: 'INITIALIZE',
    tab: 'Projects',
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
        projectEndDate: ['2022-04-29', ''],
        statusList: ['Planning', 'InProgress'],
      },
      viewAllResources: {},
      resourceSelection: {
        startDate: '2022-04-01',
        endDate: '2023-04-30',
        code: '',
        departmentName: '',
        isDateFilterNotApplied: true,
        jobGradeIds: null,
        name: '',
        position: '',
        requiredTime: 0,
        resourceGroups: null,
        resourceManager: null,
        rmId: '',
        skills: [],
      },
      requestSelection: {},
      roleRequest: {},
    },
    dialog: {
      activeDialog: [],
    },
    resourceAvailability: {
      availableHours: [[-150, 348, 348, 468, 468, 0, 0, 480, 480, 480, 480, 0]],
      endDate: '',
      limit: 12,
      page: 0,
      startDate: '',
      viewType: 'day',
    },
    resourceAssignmentDetail: {
      bookedTimePerDay: [],
    },
    resourceSelection: {
      currentState: 'CUSTOM_SCHEDULE',
      currentIndex: -1,
      currentStrategy: 'AdjustConsiderAvailability',
      currentWorkHoursPerDay: 8,
      currentWorkHoursPercentPerDay: 100,
      resource: {
        position: null,
        photoUrl:
          'https://saas-customer-8469-dev-ed--c.documentforce.com/profilephoto/005/T',
        name: 'Sista Aadmi',
        matchedSkills: 0,
        jobGradeName: '',
        jobGradeCode: '',
        id: 'a129D000000gyMtQAI',
        historyId: 'a139D0000016fCiQAI',
        departmentName: '',
        departmentCode: '',
        code: 'TDEMP000',
        capacity: [480, 480, 480, 480, 480, 0, 0],
        availableTime: 117792,
        availability: [-150, 348, 348, 468, 468, 0, 0],
      },
      scheduledAvailableHours: [[-150, 348, 348, 468, 468, 0, 0]],
      scheduledBookedHours: [[6, 6, 6, 6, 6, -1, -1]],
      scheduledRemainingHours: [[-150, 348, 348, 468, 468, 0, 0]],
      scheduledCustomHours: [[6, 6, 6, 6, 6, -1, -1]],
    },
    isLoading: false,
  },
  entities: {
    psa: {
      access: {
        canConfirmProjectRoles: true,
        canUploadProjectRoles: true,
        canAssignProjectRoles: true,
        canCancelProjectRoles: true,
        canRescheduleProjectRoles: true,
        canWithdrawProjectRoles: true,
      },
      activity: {
        activityList: [],
        activity: {},
      },
      assignment: {
        assignment: {
          activityId: '',
          assigneeBaseId: '',
          assigneeName: '',
          assigneePhotoUrl: '',
          assignmentId: '',
          description: '',
          endDate: '',
          eventId: '',
          numOfWorkDays: '0',
          projectId: '',
          role: '',
          startDate: '',
          totalWorkHours: '0',
          workTimePerDay: '0',
        },
      },
      capabilityInfo: {
        activitiesNum: 0,
        assignments: [],
        empCode: '',
        empDeptName: '',
        empEmail: '',
        empGrade: '',
        empHiredDate: '',
        empId: '',
        empName_L0: '',
        empName_L1: '',
        empNameL: '',
        empPhotoUrl: '',
        empPosition: '',
        id: '',
        links: [],
        personalInfoId: '',
        personalInfoUrl: '',
        projectNum: 0,
        remarks: '',
        skills: [],
      },
      project: {
        totalRecords: 2,
        totalPages: 1,
        pageSize: 1,
        pageNum: 1,
        pageData: [
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-04-14',
            projectJobCode: 'TDJOB001',
            projectId: 'a2U9D000000HeJbUAK',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a129D000000gyMtQAI',
            name: 'Project Activity1649892170',
            endDate: '2022-09-14',
            deptName: null,
            currentDetailId: 'a2Q9D000000C7DhUAK',
            companyId: 'a0l9D000002RTuvQAG',
            clientName: null,
            clientId: null,
          },
          {
            workTimePerDay: 480,
            status: 'InProgress',
            startDate: '2022-04-14',
            projectJobCode: 'TDJOB001',
            projectId: 'a2U9D000000HeJgUAK',
            pmName: 'Sista Aadmi',
            pmBaseId: 'a129D000000gyMtQAI',
            name: 'Project Activity1649892480',
            endDate: '2022-09-14',
            deptName: null,
            currentDetailId: 'a2Q9D000000C7CAUA0',
            companyId: 'a0l9D000002RTuvQAG',
            clientName: null,
            clientId: null,
          },
        ],
        project: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: 'a0l9D000002RTuvQAG',
          workTimePerDay: 240,
          workingDayWED: true,
          workingDayTUE: true,
          workingDayTHU: true,
          workingDaySUN: false,
          workingDaySAT: false,
          workingDayMON: true,
          workingDayFRI: true,
          status: 'InProgress',
          startDate: '2022-04-18',
          revisionComment: null,
          projectId: 'a2U9D000000HebQUAS',
          progressCheckFrequency: 'Weekly',
          pmName: 'Sista Aadmi',
          pmCode: 'TDEMP000',
          pmBaseId: 'a129D000000gyMtQAI',
          opportunityName: null,
          opportunityId: null,
          name: 'TD QA Project',
          jobId: 'a1H9D000003FjSlUAK',
          jobCode: 'TDJOB001',
          groupName: 'TD Resource Group 01',
          groupId: 'a2L9D000000O0cRUAS',
          firstCheckDate: '2022-04-24',
          endDate: '2023-04-18',
          description: null,
          deptName: null,
          deptId: null,
          deptCode: null,
          currentDetailId: 'a2Q9D000000C7GqUAK',
          code: 'PRO_1650211637985',
          closeDate: null,
          clientName: null,
          clientId: null,
          clientCode: null,
          calendarId: 'a0k9D0000034G3KQAU',
        },
        data: null,
      },
      projectFinance: {
        projectInfo: [],
        calculations: [],
        labourFinanceType: '',
        labourTotal: [],
        labourDetail: [],
        selectedLabourdetail: {},
        monthlyFinanceDetail: {},
      },
      projectManager: {
        projectManagerId: '',
      },
      projectUploadInfo: {
        jobId: '',
        allowUpload: false,
        uploadSuccess: false,
        errorLog: '',
      },
      psaExtendedItem: {
        project: [],
        role: [],
      },
      request: {
        totalRecords: 0,
        totalPages: 0,
        pageSize: 0,
        pageNum: 0,
        pageData: [],
        request: {
          assignmentDueDate: '',
          clientName: '',
          endDate: '',
          firstName: '',
          lastName: '',
          projectCode: '',
          projectJobCode: '',
          projectTitle: '',
          receivedDate: '',
          requestCode: '',
          roleId: '',
          roleTitle: '',
          startDate: '',
          status: '',
        },
      },
      resource: {
        resourceList: [
          {
            position: null,
            photoUrl:
              'https://saas-customer-8469-dev-ed--c.documentforce.com/profilephoto/005/T',
            name: 'Sista Aadmi',
            matchedSkills: 0,
            jobGradeName: '',
            jobGradeCode: '',
            id: 'a129D000000gyMtQAI',
            historyId: 'a139D0000016fCiQAI',
            departmentName: '',
            departmentCode: '',
            code: 'TDEMP000',
            capacity: [480, 480, 480, 480, 480, 0, 0],
            availableTime: 117792,
            availability: [-150, 348, 348, 468, 468, 0, 0],
            hasAssignment: true,
          },
        ],
        resource: {
          availableTime: '',
          bookedTime: '',
          departmentName: '',
          name: '',
          position: '',
          totalCapacity: '',
        },
        viewAllResourceList: {
          pageData: [],
          pageNum: 0,
          pageSize: 0,
          totalPages: 0,
          totalRecords: 0,
        },
        resourceIdList: {
          totalRecords: 0,
          ids: [],
        },
        assignmentDetailList: {
          assignments: [],
          employeeBaseId: '',
        },
      },
      resourceGroup: {
        groups: [],
        detail: [],
      },
      resourceManager: {
        resourceManagerList: [],
      },
      role: {
        role: {
          extendedItemValueId: null,
          extendedItems: [],
          companyId: null,
          workingDays: 87,
          useDefaultRate: false,
          status: 'InProgress',
          startDate: '2022-04-18',
          roleTitle: 'AUT 04/18/2022-1650236699RM',
          roleId: 'a299D000000PnVbQAK',
          requiredTimePercentage: 1,
          requiredTime: 30,
          remarks: null,
          maxWorkingTime: 20880,
          isDirectAssign: false,
          isActivityLead: false,
          groupId: 'a2L9D000000O0cRUAS',
          endDate: '2022-08-16',
          costRate: 1000,
          billRate: 2000,
          assignmentDueDate: '2022-04-18',
          activityId: 'a2A9D000000jCxjUAE',
          softBookDate: '2022-04-18',
          softBookBy: 'Sista Aadmi',
          skills: [],
          requesterDeptName: 'Dept CEO',
          requesterDeptCode: 'D01',
          requestDateTime: '2022-04-17T23:08:54.000Z',
          requestCode: '0000000036',
          requestByCode: 'TDEMP000',
          requestBy: 'Sista Aadmi',
          projectJobCode: 'TDJOB001',
          projectDept: null,
          projectCode: 'PRO_1650211637985',
          memo: {
            visibleForRM: false,
            visibleForManagers: true,
            memoForRM: null,
            memoForManagers: null,
            memoForAll: null,
            id: 'a2N9D000000omN3UAI',
          },
          jobGrades: [],
          jobCode: 'TDJOB001',
          groupName: 'TD Resource Group 01',
          confirmDate: '2022-04-18',
          confirmBy: 'Sista Aadmi',
          commentsHistory: [],
          clientName: null,
          assignments: [
            {
              strategy: {
                schedulingStrategy: 'AdjustIgnoreAvailability',
                scheduledTimePerDay: 6,
                bookedEffort: 30,
              },
              startDate: '2022-04-18',
              projectTitle: 'TD QA Project',
              endDate: '2022-04-22',
              employeePhotoUrl:
                'https://saas-customer-8469-dev-ed--c.documentforce.com/profilephoto/005/T',
              employeeName: 'Sista Aadmi',
              employeeId: 'a129D000000gyMtQAI',
              employeeCode: 'TDEMP000',
              bookedTimePerDay: [6, 6, 6, 6, 6],
              assignmentId: 'a289D000000VtqTQAS',
              assignBy: 'Sista Aadmi',
              activityTitle: 'TD QA Activity',
            },
          ],
          assignment: {
            strategy: {
              schedulingStrategy: 'AdjustIgnoreAvailability',
              scheduledTimePerDay: 6,
              bookedEffort: 30,
            },
            startDate: '2022-04-18',
            projectTitle: 'TD QA Project',
            endDate: '2022-04-22',
            employeePhotoUrl:
              'https://saas-customer-8469-dev-ed--c.documentforce.com/profilephoto/005/T',
            employeeName: 'Sista Aadmi',
            employeeId: 'a129D000000gyMtQAI',
            employeeCode: 'TDEMP000',
            bookedTimePerDay: [6, 6, 6, 6, 6],
            assignmentId: 'a289D000000VtqTQAS',
            assignBy: 'Sista Aadmi',
            activityTitle: 'TD QA Activity',
          },
        },
        scheduleResult: {
          startDate: '2022-04-18',
          endDate: '2023-04-18',
          availableTime: [-150, 348, 348, 468, 468, 0, 0],
          bookedTime: [6, 6, 6, 6, 6],
          capacity: [480, 480, 480, 480, 480, 0, 0],
          remainingHours: [-150, 348, 348, 468, 468, 0, 0],
          customHours: [6, 6, 6, 6, 6],
        },
      },
      setting: {},
    },
    employeeList: [
      {
        id: 'a129D000000gyMtQAI',
        displayName: 'Sista Aadmi',
        code: 'TDEMP000',
      },
    ],
    skillsetCategoryList: [],
    jobGradeList: [
      {
        name_L2: null,
        name_L1: 'TD Job Grade Level 1',
        name_L0: 'TD Job Grade Level 1',
        name: 'TD Job Grade Level 1',
        id: '',
        grade: null,
        costRate: 1000,
        companyId: '',
        code: '',
        billingRate: 2000,
      },
    ],
  },
};
describe('RescheduleContainer Test', () => {
  let store;
  let component;
  Date.now = jest.fn(() => new Date(2022, 4, 10, 0, 0, 0, 0).valueOf());
  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
  });
  afterEach(cleanup);
  it('it renders without crashing', () => {
    jest.mock('uuid/v1', () => jest.fn(() => 1));
    component = renderer.create(
      <Provider store={store}>
        <RescheduleContainer />
      </Provider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
