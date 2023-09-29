import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';

import { Role, RoleRescheduleParam } from '@apps/domain/models/psa/Role';

import { actions as activityActions } from '@apps/domain/modules/psa/activity';
import { actions as roleActions } from '@apps/domain/modules/psa/role';
import { actions as resourceScheduleActions } from '@apps/resource-pc-schedule/modules/ui/siteRoute';
import { actions as activeDialogActions } from '@psa/modules/ui/dialog/activeDialog';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import * as appActions from '@apps/resource-pc-schedule/action-dispatchers/App';

import { AppDispatch } from './AppThunk';

export const getRole =
  (roleId: string, activityId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(modeActions.initialize());
    dispatch(activityActions.get(activityId));
    dispatch(roleActions.get(roleId))
      .then(() => {
        // show role details page
        dispatch(siteRouteActions.showRoleDetails());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const submitRole =
  (roleId: string, comments: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.submit(roleId, comments))
      .then(() => {
        dispatch(roleActions.get(roleId))
          .then(() => {
            // show role details page
            dispatch(siteRouteActions.showRoleDetails());
          })
          .then(() => {
            dispatch(showToast(msg().Psa_Lbl_SuccessfulRequest));
          });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const submitMemo =
  (
    roleId: string,
    activityId: string,
    memoId: string,
    memo: string,
    memoType: string
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(
        roleActions.submitMemo(memoId, activityId, memo, memoType)
      );
      await dispatch(roleActions.get(roleId));
      // await dispatch(siteRouteActions.showRoleDetails());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const cloneRole =
  (roleIds: Array<string>, targetActivityId: string, numberOfClones: number) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.clone(roleIds, targetActivityId, numberOfClones))
      .then(() => {
        dispatch(siteRouteActions.showProject());
      })
      .then(() => {
        dispatch(showToast(msg().Psa_Lbl_SuccessfulCloneRequest));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const confirmRole =
  (assignmentId: string, role: Role, comments: string, confirmBy: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.confirm(assignmentId, comments, confirmBy))
      .then(() => {
        dispatch(roleActions.get(role.roleId)).then(() => {
          dispatch(siteRouteActions.showRoleDetails());
        });
        dispatch(
          roleActions.updateAssignments(
            role.assignments.filter(
              (assignment) => assignment.assignmentId === assignmentId
            )
          )
        );
      })
      .then(() => {
        dispatch(showToast(msg().Psa_Msg_SuccessfulConfirmResourceBooking));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

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

export const completeRole =
  (roleId: string, completionDate: string, comments: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.complete(roleId, completionDate, comments))
      .then(() => {
        dispatch(activeDialogActions.hide());
        dispatch(siteRouteActions.showProject());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const rescheduleRoleEndDate =
  (roleId: string, endDate: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.rescheduleEndDate(roleId, endDate))
      .then(() => {
        dispatch(roleActions.get(roleId));
        dispatch(activeDialogActions.hide());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const rescheduleRole =
  (roleRescheduleParam: RoleRescheduleParam) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.reschedule(roleRescheduleParam))
      .then(async () => {
        await dispatch(showToast(msg().Psa_Lbl_SuccessfulReschedule));
        await dispatch(roleActions.get(roleRescheduleParam.roleId));
        await dispatch(siteRouteActions.showRoleDetails());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const selfRescheduleRole =
  (roleRescheduleParam: RoleRescheduleParam) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(roleActions.selfReschedule(roleRescheduleParam))
      .then(async () => {
        // reset the entire process to make sure correct data is loaded
        await dispatch(resourceScheduleActions.showHome());
        await dispatch(showToast(msg().Psa_Lbl_SuccessfulReschedule));
        await dispatch(appActions.initialize());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const saveRole =
  (role: Role, projectId: string, jobGradeList: Array<any>) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(roleActions.save(role));
      await dispatch(
        roleActions.updateJobGrades(
          jobGradeList.filter((jobGrade) =>
            role.jobGrades.includes(jobGrade.id)
          )
        )
      );
      await Promise.all([
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
        !role.roleId && dispatch(activityActions.list(projectId)),
        role.roleId
          ? dispatch(siteRouteActions.showRoleDetails())
          : dispatch(siteRouteActions.showProject()),
        role.roleId && dispatch(roleActions.get(role.roleId)),
      ]);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const deleteRole =
  (roleId: string, projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(roleActions.delete(roleId));
      await Promise.all([
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
        dispatch(activityActions.list(projectId)),
        dispatch(siteRouteActions.showProject()),
      ]);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const cancelRole =
  (roleId: string, projectId: string, comments: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(roleActions.cancel(roleId, comments));
      await Promise.all([
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
        dispatch(activityActions.list(projectId)),
        dispatch(siteRouteActions.showProject()),
      ]);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const recallRole =
  (roleId: string, comments: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(roleActions.recall(roleId, comments));
      await dispatch(roleActions.get(roleId));
      await dispatch(siteRouteActions.showRoleDetails());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const clearRoleLocally = () => (dispatch: AppDispatch) => {
  dispatch(roleActions.clear());
};
