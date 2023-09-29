import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import repository from '@attendance/repositories/ManageCommuteCountRepository';

import { CommuteCount } from '@attendance/domain/models/CommuteCount';

import { actions } from '../modules/entities/timesheet';

import { AppDispatch } from './AppThunk';

export const update =
  ({
    commuteCount,
    targetDate,
    employeeId,
  }: {
    commuteCount: CommuteCount;
    targetDate: string;
    employeeId?: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(loadingStart());
      await repository.update({
        commuteCount,
        targetDate,
        employeeId,
      });
      dispatch(actions.updateCommuteCount(targetDate, commuteCount));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };
