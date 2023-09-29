import { Store } from 'redux';

import { AppDispatch } from '@attendance/timesheet-pc/action-dispatchers/AppThunk';
import { loadDailyAllowanceRecords } from '@attendance/timesheet-pc/action-dispatchers/DailyAllowance';

import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';

export default (store: Store) =>
  async ({ employeeId, timesheet }: IOutputData): Promise<void> => {
    const dispatch = store.dispatch as AppDispatch;

    if (!timesheet || timesheet.isMigratedSummary) {
      return;
    }

    if (
      timesheet.workingTypeList.some(
        ({ useAllowanceManagement }) => useAllowanceManagement
      )
    ) {
      // Don't await loading daily-allowance API
      dispatch(loadDailyAllowanceRecords(timesheet, employeeId || undefined));
    }
  };
