import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import AttDailyRequestRepository from '@apps/repositories/approval/AttDailyRequestRepository';
import FixMonthlyRequestRepository from '@attendance/repositories/approval/FixMonthlyRequestRepository';

import { actions as attendanceRequestActions } from '@mobile/modules/approval/entities/attendance/attendanceRequest';
import { actions as dailyRequestActions } from '@mobile/modules/approval/entities/attendance/dailyRequest';

import { AppDispatch } from '../AppThunk';

/* eslint-disable import/prefer-default-export  */
export const getDailyRequest =
  (requestId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const loadingId = dispatch(startLoading());
    try {
      const request = await AttDailyRequestRepository.fetch(requestId);
      dispatch(dailyRequestActions.set(request));
    } catch (err) {
      dispatch(catchApiError(err));
      throw err;
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

export const getAttendanceRequest =
  (requestId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const loadingId = dispatch(startLoading());
    try {
      const request = await FixMonthlyRequestRepository.fetch(requestId);
      dispatch(attendanceRequestActions.set(request));
    } catch (err) {
      dispatch(catchApiError(err));
      throw err;
    } finally {
      dispatch(endLoading(loadingId));
    }
  };
