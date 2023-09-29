import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { catchBusinessError } from '@commons/actions/app';

import {
  Project,
  ProjectListFilterState,
} from '@apps/domain/models/psa/Project';

import { State } from '@psa/modules';
import { actions as filterActions } from '@psa/modules/ui/filter/project';

import { fetchProjectList } from '@psa/action-dispatchers/Project';

import ProjectListHeader from '@psa/components/ProjectListScreen/Header';

type OwnProps = {
  isOverlapProject: boolean;
  onClickBackToProjectList: () => void;
  openNewProjectDialog: () => void;
  openViewAllResources: () => void;
  selectedProject: Project;
};

const ProjectListHeaderContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
  );
  const employeeFullName = useSelector(
    (state: State) => state.userSetting.employeeName
  );
  const pageSize = useSelector(
    (state: State) => state.entities.psa.project.pageSize
  );
  const projectListFilterState = useSelector(
    (state: State) => state.ui.filter.project
  );

  const applyFilter = (nextFilterState: ProjectListFilterState) => {
    dispatch(filterActions.update(nextFilterState));
    dispatch(fetchProjectList(companyId, 1, nextFilterState, pageSize));
  };

  const Actions = bindActionCreators(
    {
      catchBusinessError,
      updateProjectListFilter: filterActions.update,
    },
    dispatch
  );

  return (
    <ProjectListHeader
      applyFilter={applyFilter}
      catchBusinessError={Actions.catchBusinessError}
      companyId={companyId}
      deptSuggestList={deptSuggestList}
      employeeFullName={employeeFullName}
      isOverlapProject={ownProps.isOverlapProject}
      onClickBackToProjectList={ownProps.onClickBackToProjectList}
      openNewProjectDialog={ownProps.openNewProjectDialog}
      openViewAllResources={ownProps.openViewAllResources}
      projectListFilterState={projectListFilterState}
      selectedProject={ownProps.selectedProject}
      updateProjectListFilter={Actions.updateProjectListFilter}
    />
  );
};

export default ProjectListHeaderContainer;
