import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';

import {
  Assignment,
  RoleAssignParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { actions as roleActions } from '@apps/domain/modules/psa/role';
import { actions as siteRouteActions } from '@resource/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

export const rejectRole =
  (roleId: string, rejectBy: string, comments: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.reject(roleId, rejectBy, comments))
      .then(() => {
        dispatch(roleActions.get(roleId)).then(() => {
          dispatch(siteRouteActions.showRoleDetails());
        });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const selectRole = (roleId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(roleActions.get(roleId))
    .then(() => {
      dispatch(siteRouteActions.showRoleDetails());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const assignRole =
  (roleAssignParam: RoleAssignParam) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.assign(roleAssignParam))
      .then(() => {
        dispatch(siteRouteActions.showRoleDetails());
        dispatch(roleActions.get(roleAssignParam.roleId));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const showScheduleDetails = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showScheduleDetails());
};

export const softBookRole =
  (roleId: string, comments: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.softBook(roleId, comments))
      .then(() => {
        dispatch(roleActions.get(roleId)).then(() => {
          dispatch(siteRouteActions.showRoleDetails());
        });
      })
      .then(() => {
        dispatch(showToast(msg().Psa_Lbl_SuccessfulSoftBookRequest));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const releaseRoleResource =
  (assignmentId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.releaseResource(assignmentId))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
export const updateAssignments =
  (assignments: Array<Assignment>) => (dispatch: AppDispatch) => {
    dispatch(roleActions.updateAssignments(assignments));
  };

export const selectAssignment =
  (assignment: Assignment) => (dispatch: AppDispatch) => {
    dispatch(roleActions.selectAssignment(assignment));
  };

export const updateRoleStatus = (status: string) => (dispatch: AppDispatch) => {
  dispatch(roleActions.updateStatus(status));
};

export const setRoleScheduleResult =
  (scheduleResult: RoleScheduleResult) => (dispatch: AppDispatch) => {
    dispatch(roleActions.setScheduleResult(scheduleResult));
  };
