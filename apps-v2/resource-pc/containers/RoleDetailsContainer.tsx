import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { confirm } from '@apps/commons/actions/app';
import RoleDetails from '@apps/commons/components/psa/RoleDetails';
import msg from '@apps/commons/languages';

import { Assignment } from '@apps/domain/models/psa/Role';

import { State } from '@resource/modules';

import { listCategory } from '@apps/admin-pc/actions/category';
import { searchJobGrade } from '@apps/admin-pc/actions/jobGrade';
import { fetchActivity } from '@psa/action-dispatchers/Activity';
import { getProject } from '@psa/action-dispatchers/Project';
import {
  openEmployeeCapabilityInfo,
  openNewRoleDialog,
  openRoleCommentDialog,
  openRoleMemoDialog,
} from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import {
  rescheduleResource,
  selectResource,
} from '@resource/action-dispatchers/Resource';
import {
  releaseRoleResource,
  selectAssignment,
  showScheduleDetails,
  updateAssignments,
  updateRoleStatus,
} from '@resource/action-dispatchers/Role';

const RoleDetailsContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

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
  const mode = useSelector((state: State) => state.ui.mode);
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );

  useEffect(() => {
    dispatch(searchJobGrade({ companyId }));
    dispatch(getExtendedItemList(companyId, 'Role'));
    dispatch(getExtendedItemList(companyId, 'Project'));
    dispatch(fetchActivity(selectedRole.activityId));
    dispatch(listCategory({ companyId }));
  }, []);

  const removeResourceFromAssignment = (
    assignmentId: string,
    assignments: Array<Assignment>
  ) => {
    dispatch(
      confirm(msg().Psa_Msg_RemoveResource, (yes) => {
        if (yes) {
          dispatch(releaseRoleResource(assignmentId));
          dispatch(
            updateAssignments(
              assignments.filter(
                (assignment) => assignment.assignmentId !== assignmentId
              )
            )
          );
          assignments &&
            assignments.length === 1 &&
            dispatch(updateRoleStatus('Requested'));
        }
      })
    );
  };

  const Actions = bindActionCreators(
    {
      getProject,
      openEmployeeCapabilityInfo,
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
      currencyCode={currencyCode}
      currentRoute={currentRoute}
      extendedItemProjectConfigList={extendedItemProjectConfigList}
      extendedItemRoleConfigList={extendedItemRoleConfigList}
      mode={mode}
      openEmployeeCapabilityInfo={Actions.openEmployeeCapabilityInfo}
      openNewRoleDialog={Actions.openNewRoleDialog}
      openRoleCommentDialog={Actions.openRoleCommentDialog}
      openRoleMemoDialog={Actions.openRoleMemoDialog}
      removeResourceFromAssignment={removeResourceFromAssignment}
      rescheduleResource={Actions.rescheduleResource}
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
