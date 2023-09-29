import { Store } from 'redux';

import { actions } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store) =>
  async ({ employeeId, timesheet }: IOutputData): Promise<void> => {
    const useTableView = timesheet.workingTypeList?.some(
      (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
    );
    if (useTableView) {
      await UseCases().fetchDailyFieldLayoutTable({
        employeeId,
        startDate: timesheet.startDate,
        endDate: timesheet.endDate,
      });
    } else {
      store.dispatch(actions.reset());
    }
  };
