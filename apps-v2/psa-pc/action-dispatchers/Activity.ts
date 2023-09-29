import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { Activity } from '@apps/domain/models/psa/Activity';

import { actions as activityActions } from '@apps/domain/modules/psa/activity';
import { actions as activeDialogActions } from '@psa/modules/ui/dialog/activeDialog';
import { actions as modeActions } from '@psa/modules/ui/mode';

import { AppDispatch } from './AppThunk';

export const fetchActivityList =
  (projectId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activityActions.list(projectId))
      .then((res) => {
        if (res.payload.length === 0) {
          dispatch(activityActions.initialize());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const editActivity = (activityId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(activityActions.get(activityId))
    .then(() => {
      // show activity detail dialog
      dispatch(activeDialogActions.activityDetail());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const fetchActivity =
  (activityId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activityActions.get(activityId))
      .then(() => {})
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const saveActivity =
  (activity: Activity) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(activityActions.save(activity));
      // show project details and hide dialog
      await Promise.all([
        dispatch(activityActions.list(activity.projectId)),
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
      ]);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const deleteActivity =
  (activityId: string, projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(activityActions.delete(activityId));
      // show project details and hide dialog
      await Promise.all([
        dispatch(activityActions.list(projectId)),
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
      ]);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const setActivityId =
  (activityId: string) => (dispatch: AppDispatch) => {
    dispatch(activityActions.set(activityId));
  };
export const setActivityTitle = (title: string) => (dispatch: AppDispatch) => {
  dispatch(activityActions.setTitle(title));
};
export const setActivityStartDate =
  (startDate: string) => (dispatch: AppDispatch) => {
    dispatch(activityActions.setStartDate(startDate));
  };
export const setActivityEndDate =
  (endDate: string) => (dispatch: AppDispatch) => {
    dispatch(activityActions.setEndDate(endDate));
  };
