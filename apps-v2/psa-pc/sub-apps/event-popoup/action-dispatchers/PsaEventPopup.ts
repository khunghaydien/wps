import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as psaEventActions } from '@psa/sub-apps/event-popoup/modules/entities/event';
import { actions as conditionsActions } from '@psa/sub-apps/event-popoup/modules/ui/conditions';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

// eslint-disable-next-line import/prefer-default-export
export default (dispatch: AppDispatch) => ({
  getPsaEvent: async (eventId: string, top: number, left: number) => {
    dispatch(loadingStart());
    try {
      await dispatch(psaEventActions.getPsaEvent(eventId));
      dispatch(conditionsActions.set({ isOpen: true, top, left }));
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: false }));
    } finally {
      dispatch(loadingEnd());
    }
  },
});
