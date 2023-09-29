import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

import LocalEvents from '@apps/approvals-pc/containers/AttDailyFixProcess/events';

export const approveBulk =
  (ids: string[], comment: string) => async (dispatch) => {
    dispatch(loadingStart());
    try {
      await RequestRepository.approve({
        ids,
        comment,
      });
      LocalEvents.approved.publish();
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(loadingEnd());
    }
  };
