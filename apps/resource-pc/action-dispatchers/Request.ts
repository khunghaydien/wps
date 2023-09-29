import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages/index';
import { showToast } from '@apps/commons/modules/toast';

import {
  RequestListItem as Request,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';

import { actions as activityActions } from '@apps/domain/modules/psa/activity';
import { actions as projectActions } from '@apps/domain/modules/psa/project';
import { actions as requestActions } from '@apps/domain/modules/psa/request';
import { actions as roleActions } from '@apps/domain/modules/psa/role';
import { actions as modeActions } from '@resource/modules/ui/mode';
import { actions as overlapActions } from '@resource/modules/ui/overlap';
import { actions as siteRouteActions } from '@resource/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

export const showDownloadToast = () => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(showToast(msg().Psa_Lbl_SuccessfulResourceListDownload));
  dispatch(loadingEnd());
};

export const selectRequest = (request: Request) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(roleActions.get(request.roleId))
    .then(() => {
      dispatch(requestActions.saveInternally(request));
      dispatch(siteRouteActions.showRoleDetails());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

export const openRoleDetails = (roleId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  dispatch(modeActions.selectRoleFromAllResources());
  dispatch(roleActions.get(roleId))
    .then(() => {
      dispatch(siteRouteActions.showRoleDetails());
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
    .finally(() => dispatch(loadingEnd()));
};

/**
 * Need to fetch activity for reverse assignment
 * Because activity end date is used for scheduling purpose
 */
export const selectRequestAndPlan =
  (request: Request, employeeBaseId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(roleActions.scheduleCheck(request.roleId, employeeBaseId));
      await dispatch(roleActions.get(request.roleId)).then((res) => {
        dispatch(requestActions.saveInternally(request));
        dispatch(activityActions.get(res.payload.activityId))
          .then(async (response: any) => {
            await dispatch(projectActions.get(response.payload.projectId)).then(
              () => {
                dispatch(siteRouteActions.showResourcePlanner());
              }
            );
          })
          .then(() => dispatch(loadingEnd()));
      });
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const overlapRequest = () => (dispatch: AppDispatch) => {
  dispatch(overlapActions.overlap());
};

export const fetchResourceRequestList =
  (
    companyId: string,
    pageNo: number,
    psaGroupId: string,
    filterQuery?: RoleRequestListFilterState | Record<string, any>,
    listSize?: number
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(
        requestActions.list(
          companyId,
          pageNo,
          psaGroupId,
          filterQuery,
          listSize
        )
      );
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const backToRequestList =
  (
    companyId: string,
    pageNo: number,
    psaGroupId: string,
    filterQuery?: RoleRequestListFilterState,
    listSize?: number
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(
        requestActions.list(
          companyId,
          pageNo,
          psaGroupId,
          filterQuery,
          listSize || 10
        )
      );
      await dispatch(modeActions.initialize());
      dispatch(siteRouteActions.showResourceList());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const goToRequestSelection =
  (
    companyId: string,
    pageNo: number,
    psaGroupId: string,
    filterQuery?: RoleRequestListFilterState
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      await dispatch(
        requestActions.list(companyId, pageNo, psaGroupId, filterQuery)
      );
      await dispatch(modeActions.resourceAssignment());
      dispatch(siteRouteActions.showResourceList());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };
