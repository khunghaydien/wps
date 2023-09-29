import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { catchBusinessError } from '@commons/actions/app';

import {
  Project,
  ProjectListFilterState,
} from '@apps/domain/models/psa/Project';
import { PsaPermissionType } from '@apps/domain/models/psa/PsaAccess';

import { actions as psaAccessSettingActions } from '@apps/domain/modules/psa/access';
import { actions as psaGroupActions } from '@apps/domain/modules/psa/psaGroup';
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
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
  );
  const employeeFullName = useSelector(
    (state: State) => state.userSetting.employeeName
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const pageSize = useSelector(
    (state: State) => state.entities.psa.project.pageSize
  );
  const projectListFilterState = useSelector(
    (state: State) => state.ui.filter.project
  );
  const psaGroupList = useSelector(
    (state: State) => state.entities.psa.psaGroup.groupList
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  const applyFilter = (nextFilterState: ProjectListFilterState) => {
    dispatch(filterActions.update(nextFilterState));
    dispatch(
      fetchProjectList(
        companyId,
        1,
        selectedGroup.id,
        nextFilterState,
        pageSize
      )
    );
  };

  const updateSelectedGroup = (selectedGroupId: string) => {
    const newSelectedGroup = psaGroupList.filter(
      (group) => group.id === selectedGroupId
    );
    dispatch(psaGroupActions.setSelectedGroup(newSelectedGroup[0]));
    dispatch(
      fetchProjectList(
        companyId,
        1,
        newSelectedGroup[0].id,
        projectListFilterState,
        pageSize
      )
    );
    const psaPermissions: Array<PsaPermissionType> = [
      'CONFIRM_PROJECT_ROLES',
      'UPLOAD_PROJECT_ROLES',
    ];
    dispatch(
      psaAccessSettingActions.get(
        employeeId,
        psaPermissions,
        newSelectedGroup[0].id
      )
    );
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
      updateSelectedGroup={updateSelectedGroup}
      psaGroupList={psaGroupList}
      selectedGroup={selectedGroup}
    />
  );
};

export default ProjectListHeaderContainer;
