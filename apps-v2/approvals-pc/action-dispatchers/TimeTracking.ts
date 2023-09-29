import { catchApiError, withLoading } from '../../commons/actions/app';

import { fetch } from '../../domain/models/time-tracking/TrackRequest';

import { fetchSuccess } from '../modules/entities/timeTrack/detail';

import { AppDispatch } from './AppThunk';
import History from './History';

export default (dispatch: AppDispatch) => {
  return {
    fetch: (requestId: string) => {
      dispatch(
        withLoading(async () => {
          const history = History(dispatch);
          try {
            const [records] = await Promise.all([
              fetch(requestId),
              history.fetch(requestId),
            ]);
            dispatch(fetchSuccess(records));
          } catch (err) {
            catchApiError(err, { isContinuable: false });
          }
        })
      );
    },
  };
};
