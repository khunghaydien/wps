import * as actions from '@attendance/timesheet-pc-importer/modules/actions';
import ownerEmployeeId from '@attendance/timesheet-pc-importer/modules/selectors/ownerEmployeeId';

import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

export default ({ dispatch, getState }: AppStore) => {
  return {
    toggleCheckedAll: () => {
      dispatch(actions.timesheet.toggleCheckedAll());
    },
    updateDailyRecords: (
      dailyRecords: Map<string, DailyRecordViewModel.DailyRecordViewModel>
    ) => {
      dispatch(actions.timesheet.setRecords(dailyRecords));
      const employeeId = ownerEmployeeId(getState());
      dailyRecords?.forEach((record) => {
        const { recordDate: targetDate } = record;
        if (DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves(record)) {
          UseCases().fetchLeaves({
            targetDate,
            employeeId,
          });
        }
        if (
          DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons(record)
        ) {
          UseCases().fetchEarlyLeaveReasons({
            targetDate,
            employeeId,
          });
        }
        if (
          DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons(
            record
          )
        ) {
          UseCases().fetchLateArrivalReasons({
            targetDate,
            employeeId,
          });
        }
        if (DailyRecordViewModel.isRequiredLoadingRestTimeReasons(record)) {
          UseCases().fetchRestTimeReasons({
            targetDate,
            employeeId,
          });
        }
      });
    },
  };
};
