import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RoleRequestListContainer from '../RoleRequestListContainer';

const mockStore = configureStore([thunk]);

const state = {
  userSetting: {
    companyId: '',
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
      request: {
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
          {
            status: 'Scheduling',
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
        ],
        pageNum: 1,
        pageSize: 1,
        totalRecords: 9,
      },
    },
  },
  ui: {
    filter: {
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
        requesterName: '',
        requestCode: '',
        requesterCode: '',
        resourceGroup: '',
        rmName: 'Sista Aadmi',
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
        rmName: 'Sista Aadmi',
        roleStartDate: ['', ''],
        roleTitle: '',
        statusList: ['Requested', 'Scheduling'],
      },
    },
    mode: 'INITIALIZE',
    resourceSelection: {
      resource: undefined,
    },
  },
};

describe('RoleRequestListContainer Test', () => {
  let store;
  let component;
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <RoleRequestListContainer />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
