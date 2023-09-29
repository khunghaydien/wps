import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { ResourceSearchQuery } from '@apps/domain/models/psa/Resource';

import { actions as resourceActions } from '@apps/domain/modules/psa/resource';
import { actions as activeDialogActions } from '@psa/modules/ui/dialog/activeDialog';
import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

export const selectResource =
  (resourceIndex: string) => (dispatch: AppDispatch) => {
    dispatch(resourceActions.set(resourceIndex));
    dispatch(activeDialogActions.hide());
  };

export const clearResource = () => (dispatch: AppDispatch) => {
  dispatch(resourceActions.clear());
};

export const fetchResourceList =
  (searchQuery: ResourceSearchQuery) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(resourceActions.list(searchQuery))
      .then((res) => {
        if (res.payload.length === 0) {
          dispatch(resourceActions.initialize());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const openViewAllResources = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showViewAllResources());
};
