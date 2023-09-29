import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import RoleDetails from '@apps/commons/components/psa/RoleDetails';

import { State } from '@psa/modules';
import { actions as modeActions } from '@psa/modules/ui/mode';

import { fetchActivity } from '@psa/action-dispatchers/Activity';
import { getProject } from '@psa/action-dispatchers/Project';
import {
  openEmployeeCapabilityInfo as openTalentProfile,
  openMarkAsCompletedRoleDialog,
  openNewRoleDialog,
  openRoleCommentDialog,
  openRoleMemoDialog,
} from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import { cloneRole, deleteRole } from '@psa/action-dispatchers/Role';
import showScheduleDetails from '@psa/action-dispatchers/ScheduleDetails';
import {
  rescheduleResource,
  selectResource,
} from '@resource/action-dispatchers/Resource';
import { selectAssignment } from '@resource/action-dispatchers/Role';

const RoleDetailsContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const accessSetting = useSelector(
    (state: State) => state.entities.psa.access
  );
  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const currentRoute = useSelector((state: State) => state.ui.tab);
  const extendedItemProjectConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.project
  );
  const extendedItemRoleConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.role
  );
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const mode = useSelector((state: State) => state.ui.mode);
  const resourceGroups = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );
  const openEmployeeCapabilityInfo = (empId: string) => {
    dispatch(openTalentProfile(empId, selectedGroup.id));
  };
  useEffect(() => {
    dispatch(getExtendedItemList(companyId, 'Role'));
    dispatch(getExtendedItemList(companyId, 'Project'));
    // fetch activity is needed for rescheduling purpose
    dispatch(fetchActivity(selectedRole.activityId));
  }, []);

  const Actions = bindActionCreators(
    {
      cloneRole,
      deleteRole,
      directAssignment: modeActions.directAssignment,
      getProject,
      openEmployeeCapabilityInfo,
      openMarkAsCompletedRoleDialog,
      openNewRoleDialog,
      openRoleCommentDialog,
      openRoleMemoDialog,
      rescheduleResource,
      selectAssignment,
      selectResource,
      showScheduleDetails,
    },
    dispatch
  );

  return (
    <RoleDetails
      accessSetting={accessSetting}
      activeDialog={activeDialog}
      cloneRole={Actions.cloneRole}
      currencyCode={currencyCode}
      currentRoute={currentRoute}
      deleteRole={Actions.deleteRole}
      directAssignment={Actions.directAssignment}
      extendedItemProjectConfigList={extendedItemProjectConfigList}
      extendedItemRoleConfigList={extendedItemRoleConfigList}
      getProject={Actions.getProject}
      isLoading={isLoading}
      mode={mode}
      openEmployeeCapabilityInfo={Actions.openEmployeeCapabilityInfo}
      openMarkAsCompletedRoleDialog={Actions.openMarkAsCompletedRoleDialog}
      openNewRoleDialog={Actions.openNewRoleDialog}
      openRoleCommentDialog={Actions.openRoleCommentDialog}
      openRoleMemoDialog={Actions.openRoleMemoDialog}
      rescheduleResource={Actions.rescheduleResource}
      resourceGroups={resourceGroups}
      selectAssignment={Actions.selectAssignment}
      selectedActivity={selectedActivity}
      selectedProject={selectedProject}
      selectedRole={selectedRole}
      selectResource={Actions.selectResource}
      showScheduleDetails={Actions.showScheduleDetails}
    />
  );
};

export default RoleDetailsContainer;
