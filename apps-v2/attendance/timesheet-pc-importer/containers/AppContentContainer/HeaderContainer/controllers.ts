import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import msg from '@commons/languages';

import { State } from '@attendance/timesheet-pc-importer/modules';
import * as actions from '@attendance/timesheet-pc-importer/modules/actions';
import * as selectors from '@attendance/timesheet-pc-importer/modules/selectors';

import {
  AppDispatch,
  AppStore,
} from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';
import {
  getCheckedStartEndTime,
  getMaxDate,
} from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';
import TimesheetFactory from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel/TimesheetFactory';

export default ({ dispatch, getState }: AppStore) => {
  const alertRoundOverDaysForImporting = (
    startDate: string,
    endDate: string
  ) => {
    const $endDate = getMaxDate(startDate);
    const text = TextUtil.template(
      msg().Att_Msg_ImpAlertRoundOverDaysForImporting,
      DateUtil.formatYMD($endDate)
    );
    if ($endDate < endDate || endDate < startDate) {
      (dispatch as AppDispatch)(
        actions.common.app.catchBusinessError(msg().Com_Lbl_Error, text, '')
      );
    }
  };

  const updateDate = (startDate: string, endDate: string) => {
    alertRoundOverDaysForImporting(startDate, endDate);
    dispatch(actions.timesheet.create(startDate, endDate));
  };

  return {
    updateStartDate: (startDate: string) => {
      const endDate = (getState() as State).timesheet.endDate;
      updateDate(startDate, endDate);
    },
    updateEndDate: (endDate: string) => {
      const startDate = (getState() as State).timesheet.startDate;
      updateDate(startDate, endDate);
    },
    fetchContractedWorkTimes: () => {
      const state = getState();
      const employeeId = selectors.ownerEmployeeId(state);
      UseCases().fetchContractedWorkTimes({
        employeeId,
        startDate: state.timesheet.startDate,
        endDate: state.timesheet.endDate,
      });
    },
    checkTimesheet: () => {
      const state = getState();
      const employeeId = selectors.ownerEmployeeId(state);
      const { startDate, endDate } = getCheckedStartEndTime([
        ...state.timesheet.records.values(),
      ]);
      UseCases().checkTimesheet({
        employeeId,
        startDate,
        endDate,
      });
    },
    saveTimesheet: () => {
      const state = getState();
      const employeeId = selectors.ownerEmployeeId(state);
      UseCases().saveTimesheet(
        TimesheetFactory.create({
          employeeId,
          records: [...state.timesheet.records.values()],
        })
      );
    },
  };
};
