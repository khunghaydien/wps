import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as capabilityInfoAction } from '@apps/domain/modules/psa/capabilityInfo';
import { actions as projectUploadActions } from '@apps/domain/modules/psa/projectUpload';
import { actions as workingDaysActions } from '@apps/domain/modules/psa/workingDays';
import { actions as activeDialogActions } from '@psa/modules/ui/dialog/activeDialog';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { actions as sidebarActions } from '@psa/modules/ui/sidebar';
import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

// Project Screen
export const openNewProjectDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.newProject());
};

export const openDeleteProjectDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.deleteProject());
};

export const openGenerateProjectLinkDialog = ()=>(dispatch: AppDispatch) =>{
  dispatch(activeDialogActions.generateProjectLink());
}
// Activity Screen
export const openNewActivityDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.newActivity());
};

export const openActivityDetailDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.activityDetail());
};

// Assignment Screen
export const openNewAssignmentDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.newAssignment());
};

export const openAssignmentDetailDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.assignmentDetail());
};

// Activity Role Screen
export const openNewRoleDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.newRole());
};

export const openEditEndDateRoleDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.editRoleEndDate());
};

export const openRoleCommentDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.openRoleComment());
};

export const openRoleMemoDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.openRoleMemo());
};

export const openMarkAsCompletedRoleDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.markAsCompletedRole());
};

// resourcePlanner screen
export const openResourcePlannerCommentDialog =
  () => (dispatch: AppDispatch) => {
    dispatch(activeDialogActions.openResourcePlannerComment());
  };

// Resource Selection Screen
export const openResourceSelectionDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.resourceSelection());
};

export const hideDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.hide());
};

export const overlapProject = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showProject());
};

export const nonOverlapProject = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showProjectList());
};

export const switchToSidebar =
  (component: string) => (dispatch: AppDispatch) => {
    switch (component) {
      case 'PROJECT':
        dispatch(sidebarActions.showProject());
        break;
      case 'ACTIVITY':
        dispatch(sidebarActions.showActivity());
        break;
      case 'UPLOAD':
        dispatch(sidebarActions.showUpload());
        dispatch(projectUploadActions.initialize());
        break;
      case 'FINANCE':
        dispatch(sidebarActions.showFinance());
        break;
      default:
        dispatch(sidebarActions.showActivity());
    }

    dispatch(modeActions.initialize());
  };

export const getWorkingDays =
  (projectId: string, startDate: string, endDate: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(workingDaysActions.get(projectId, startDate, endDate))
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

// Employee Capability Info
export const openEmployeeCapabilityInfo =
  (empId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(capabilityInfoAction.get(empId))
      .then(() => {
        dispatch(activeDialogActions.employeeCapabilityInfo());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const openNewFinanceDetailDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.openNewFinanceDetailDialog());
};
export const openModifyFinanceDetailDialog = () => (dispatch: AppDispatch) => {
  dispatch(activeDialogActions.openModifyFinanceDetailDialog());
};
