import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { SITE_ROUTE_TYPES } from '@psa/modules/ui/siteRoute';

import ProjectListHeader from '@psa/components/ProjectListScreen/Header';

import ProjectListHeaderContainer from '../ProjectListHeaderContainer';

const mockStore = configureStore([thunk]);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const state = {
  userSetting: {
    companyId: '',
    employeeName: '',
  },
  entities: {
    departmentList: [],
    psa: {
      psaGroup: {
        groupList: [
          {
            code: 'PSAG001',
            companyId: 'a0Y6D000001oEHEUA2',
            groupType: 'PsaGroup',
            id: 'a1l6D000001lgKtQAI',
            isOwned: null,
            name: 'PSA Group 1',
            name_L0: 'PSA Group 1',
            name_L1: 'PSA Group 1',
          },
        ],
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

const props = {
  activeRoute: '',
  onClickBackToProjectList: () => {},
  openNewProjectDialog: () => {},
  openViewAllResources: () => {},
  selectedProject: {
    calendarId: '',
    clientCode: '',
    clientId: '',
    clientName: '',
    code: '',
    companyId: '',
    currentDetailId: '',
    deptCode: '',
    deptId: '',
    deptName: '',
    description: '',
    endDate: '',
    extendedItems: null,
    extendedItemValueId: '',
    jobCode: '',
    name: '',
    pmBaseId: '',
    projectId: '',
    revisionComment: '',
    startDate: '',
    status: '',
    uniqKey: '',
    workingDayFRI: true,
    workingDayMON: true,
    workingDaySAT: false,
    workingDaySUN: false,
    workingDayTHU: true,
    workingDayTUE: true,
    workingDayWED: true,
    workTimePerDay: 0,
  },
};

describe('ProjectListHeaderContainer Test', () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
  });

  afterEach(cleanup);

  it('it renders without crashing', () => {
    component = renderer.create(
      <Provider store={store}>
        <ProjectListHeaderContainer
          isOverlapProject={props.activeRoute === SITE_ROUTE_TYPES.VIEW_PROJECT}
          onClickBackToProjectList={props.onClickBackToProjectList}
          openNewProjectDialog={props.openNewProjectDialog}
          openViewAllResources={props.openViewAllResources}
          selectedProject={props.selectedProject}
        />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event to apply filter', async () => {
    component = mount(
      <Provider store={store}>
        <ProjectListHeaderContainer
          isOverlapProject={props.activeRoute === SITE_ROUTE_TYPES.VIEW_PROJECT}
          onClickBackToProjectList={props.onClickBackToProjectList}
          openNewProjectDialog={props.openNewProjectDialog}
          openViewAllResources={props.openViewAllResources}
          selectedProject={props.selectedProject}
        />
      </Provider>
    );
    const page = component.find(ProjectListHeader).props();
    await act(async () => {
      page.applyFilter({});
      await delay(100);
      component.update();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
