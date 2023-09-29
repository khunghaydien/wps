import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import repository from '../../repositories/attendance/ManageCommuteCountRepository';

import { actions } from '../modules/entities/timesheet';

import { AppDispatch } from './AppThunk';

export const update =
  ({
    commuteBackwardCount,
    commuteForwardCount,
    targetDate,
    employeeId,
  }: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate: string;
    employeeId?: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(loadingStart());
      await repository.update({
        commuteForwardCount,
        commuteBackwardCount,
        targetDate,
        employeeId,
      });
      dispatch(
        actions.updateCommuteCount(
          commuteForwardCount,
          commuteBackwardCount,
          targetDate
        )
      );
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };
