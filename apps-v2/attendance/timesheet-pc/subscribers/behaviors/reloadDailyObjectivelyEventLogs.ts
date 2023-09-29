import { Store } from 'redux';

import { actions as timesheetActions } from '@attendance/timesheet-pc/modules/entities/timesheet';

import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store) =>
  async ({ employeeId, timesheet }: IOutputData): Promise<void> => {
    const useObjectivelyEventLog = timesheet?.workingTypeList?.some(
      ({ useObjectivelyEventLog }) => useObjectivelyEventLog
    );
    if (!useObjectivelyEventLog) {
      store.dispatch(timesheetActions.setDailyObjectivelyEventLogs(null));
    } else {
      await UseCases().reloadDailyObjectivelyEventLogs({
        employeeId,
        startDate: timesheet.startDate,
        endDate: timesheet.endDate,
      });
    }
  };
