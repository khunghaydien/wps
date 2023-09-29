import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import { SITE_ROUTE_TYPES } from '@psa/modules/ui/siteRoute';

import ProjectListHeaderContainer from '../ProjectListHeaderContainer';

const mockStore = configureStore([]);

const state = {
  userSetting: {
    companyId: '',
    employeeName: '',
  },
  entities: {
    departmentList: [],
    psa: {
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

describe('ProjectListHeaderContainer Test', () => {
  let store;
  let component;
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
  beforeEach(() => {
    store = mockStore(state);
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
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('ProjectListHeaderContainer Test IsOverLapProjectTrue', () => {
  let store;
  let component;
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
  beforeEach(async () => {
    store = mockStore(state);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ProjectListHeaderContainer
            isOverlapProject={true}
            onClickBackToProjectList={props.onClickBackToProjectList}
            openNewProjectDialog={props.openNewProjectDialog}
            openViewAllResources={props.openViewAllResources}
            selectedProject={props.selectedProject}
          />
        </Provider>
      );
    });
  });

  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
