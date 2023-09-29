import { AppDispatch } from '../AppThunk';

export const loadDailyTimeTrackRecords = jest.fn(
  (...args) =>
    (dispatch: AppDispatch) => {
      dispatch({ type: 'LOAD_DAILY_TIME_TRACK_RECORDS', payload: args });
      return Promise.resolve();
    }
);
