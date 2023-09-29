import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import {
  Project,
  ProjectListFilterState,
} from '@apps/domain/models/psa/Project';

import { actions as projectActions } from '@apps/domain/modules/psa/project';
import { actions as activeDialogActions } from '@psa/modules/ui/dialog/activeDialog';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { actions as sidebarActions } from '@psa/modules/ui/sidebar';
import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

export const backToProjectList =
  (companyId: string, pageNo: number, filterQuery?: ProjectListFilterState) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(projectActions.list(companyId, pageNo, filterQuery))
      .then(() => {
        dispatch(siteRouteActions.showProjectList());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const fetchProjectList =
  (
    companyId: string,
    pageNo: number,
    filterQuery?: ProjectListFilterState,
    pageSize?: number
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(
      projectActions.list(companyId, pageNo, filterQuery, pageSize)
    )
      .then((res) => {
        if (res.payload.totalRecords === 0) {
          dispatch(projectActions.initialize());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const fetchProject = (projectId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(projectActions.get(projectId))
    .then(() => {
      // show project detail screen
      dispatch(siteRouteActions.showProject());
      dispatch(sidebarActions.showActivity());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const fetchProjectFromUrl = (projectId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(projectActions.get(projectId))
    .then(() => {
      // show project detail screen
      dispatch(siteRouteActions.showProject());
      dispatch(sidebarActions.showProject());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const getProject = (projectId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(projectActions.get(projectId))
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const saveProject =
  (project: Project, companyId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      const res = await dispatch(projectActions.save(project));
      await Promise.all([
        dispatch(projectActions.list(companyId, 1)),
        dispatch(activeDialogActions.hide()),
        dispatch(modeActions.initialize()),
        // temporary fix. To be removed once project manager is implemented
        dispatch(projectActions.get(res.projectId)),
      ]);
      await dispatch(siteRouteActions.showProject());
      await dispatch(sidebarActions.showProject());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const deleteProject =
  (projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    try {
      await dispatch(projectActions.delete(projectId));
      // show project list screen
      dispatch(siteRouteActions.showProjectList());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };
