import { AppDispatch } from '../AppThunk';

export const loadTimeTrackAlerts = jest.fn(
  (...args) =>
    (dispatch: AppDispatch) => {
      dispatch({ type: 'LOAD_TIME_TRACK_ALERTS', payload: args });
      return Promise.resolve();
    }
);
