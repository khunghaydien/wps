import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@psa/modules';

import { searchJobGrade } from '@apps/admin-pc/actions/jobGrade';
import {
  editActivity,
  fetchActivityList,
  setActivityEndDate,
  setActivityId,
  setActivityStartDate,
  setActivityTitle,
} from '@psa/action-dispatchers/Activity';
import {
  openEmployeeCapabilityInfo as openTalentProfile,
  openNewActivityDialog,
  openNewRoleDialog,
} from '@psa/action-dispatchers/PSA';
import { clearRoleLocally, getRole } from '@psa/action-dispatchers/Role';

import ActivityView from '@psa/components/ProjectScreen/Activity';

const ActivityContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const activityList = useSelector(
    (state: State) => state.entities.psa.activity.activityList
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  const getActivityList = () => {
    const { projectId } = selectedProject;
    dispatch(fetchActivityList(projectId));
  };

  const getJobGradeList = () => {
    dispatch(searchJobGrade({ companyId, psaGroupId: selectedGroup.id }));
  };

  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );
  const openEmployeeCapabilityInfo = (empId: string) => {
    dispatch(openTalentProfile(empId, selectedGroup.id));
  };
  const Actions = bindActionCreators(
    {
      clearRoleLocally,
      editActivity,
      getRole,
      openNewActivityDialog,
      openNewRoleDialog,
      setActivityEndDate,
      setActivityId,
      setActivityStartDate,
      setActivityTitle,
    },
    dispatch
  );

  return (
    <ActivityView
      activeDialog={activeDialog}
      activityList={activityList}
      clearRoleLocally={Actions.clearRoleLocally}
      editActivity={Actions.editActivity}
      getActivityList={getActivityList}
      getJobGradeList={getJobGradeList}
      getRole={Actions.getRole}
      isLoading={isLoading}
      openEmployeeCapabilityInfo={openEmployeeCapabilityInfo}
      openNewActivityDialog={Actions.openNewActivityDialog}
      openNewRoleDialog={Actions.openNewRoleDialog}
      selectedProject={selectedProject}
      setActivityEndDate={Actions.setActivityEndDate}
      setActivityId={Actions.setActivityId}
      setActivityStartDate={Actions.setActivityStartDate}
      setActivityTitle={Actions.setActivityTitle}
    />
  );
};

export default ActivityContainer;
