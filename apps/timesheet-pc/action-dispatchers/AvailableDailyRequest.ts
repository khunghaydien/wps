import { catchApiError } from '../../commons/actions/app';

import TimesheetRepository from '../../repositories/attendance/TimesheetRepository';

import { actions as timesheetActions } from '../modules/entities/timesheet';

import { AppDispatch } from './AppThunk';

export const load =
  (targetDate: string = null, targetEmployeeId: string = null) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(timesheetActions.clearRequestTypeCodes());
      const { availableRequestTypeCodesMap } =
        await TimesheetRepository.fetchAvailableDailyRequest(
          targetDate,
          targetEmployeeId
        );
      dispatch(
        timesheetActions.setRequestTypeCodes(availableRequestTypeCodesMap)
      );
    } catch (e) {
      dispatch(catchApiError(e));
    }
  };
