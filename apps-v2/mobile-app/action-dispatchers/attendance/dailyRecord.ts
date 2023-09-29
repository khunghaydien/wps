import isNil from 'lodash/isNil';
import moment from 'moment';

import msg from '../../../commons/languages';
import { showAlert } from '../../modules/commons/alert';

import { Status as DailyRequestStatus } from '@attendance/domain/models/AttDailyRequest';
import {
  getAttDailyRecordByDate,
  isTargetDateInTimesheet,
  Timesheet,
} from '@attendance/domain/models/Timesheet';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import { State as UiDailyEditingState } from '../../modules/attendance/timesheet/ui/daily/editing';
import { actions as EntitiesApprovalHistoriesActions } from '@mobile/modules/attendance/dailyRequest/entities/approvalHistories';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import {
  clearTimesheet,
  setTimesheet,
} from '@mobile/containers/pages/attendance/TimesheetDailyPageContainer/presenters/timesheet/fetch';
import UseCases from '@mobile/containers/pages/attendance/TimesheetDailyPageContainer/UseCases';

import { AppDispatch } from '../AppThunk';

const getTodayData = (targetDate: string, timesheet: Timesheet) => {
  const workingType = RecordsUtil.getWithinRange(
    targetDate,
    timesheet.workingTypes
  );
  const record = getAttDailyRecordByDate(targetDate, timesheet);
  return {
    workingType,
    record,
  };
};

const resetTimesheet = (targetDate: string): Promise<Timesheet | null> =>
  UseCases()
    .fetchTimesheet({
      targetDate,
    })
    .then(({ timesheet }) => timesheet)
    .catch(() => null);

const convertToDailyRecord = (
  editing: UiDailyEditingState,
  workingType: WorkingType
) => ({
  recordId: editing.id,
  recordDate: editing.targetDate,
  startTime: editing.startTime,
  endTime: editing.endTime,
  restTimes: editing.restTimes,
  restHours: editing.restHours,
  otherRestReason: editing.otherRestReason,
  commuteCount: workingType?.useManageCommuteCount
    ? editing.commuteCount
    : null,
  remarks: editing.remarks || '',
});

const fetchApprovalRequestHistoryRepository =
  (targetDate: string, timesheet: Timesheet) =>
  async (dispatch: AppDispatch) => {
    const { workingType, record } = getTodayData(targetDate, timesheet);
    const fixDailyRequest = record?.fixDailyRequest;

    if (workingType?.useFixDailyRequest && fixDailyRequest?.id) {
      await UseCases().fetchApprovalRequestHistory(fixDailyRequest.id);
    } else {
      dispatch(EntitiesApprovalHistoriesActions.initialize([]));
    }
  };

const fetchRestTimeReasons = async (
  targetDate: string,
  timesheet: Timesheet
) => {
  const { workingType, record } = getTodayData(targetDate, timesheet);

  if (workingType?.useRestReason && record?.editable) {
    return UseCases().fetchRestTimeReasons({
      targetDate,
    });
  }
};

/**
 * Timesheet を取得する
 * 勤務表で既に Timesheet を取得しているはずなので cache があれば cache を使用する。
 * @param targetDate
 * @param timesheet
 * @returns
 */
const initializeTimesheet =
  (targetDate: string, timesheet?: Timesheet) => (dispatch: AppDispatch) => {
    if (!isNil(timesheet) && isTargetDateInTimesheet(timesheet, targetDate)) {
      dispatch(setTimesheet(targetDate, timesheet));
      return timesheet;
    } else {
      return resetTimesheet(targetDate);
    }
  };

/**
 * 初期化処理
 * @param targetDate
 * @param timesheet
 * @returns
 */
export const initialize =
  (targetDate?: string, timesheet?: Timesheet) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearTimesheet());
    const $targetDate = targetDate || moment().format('YYYY-MM-DD');

    const [_, $timesheet] = await Promise.all([
      UseCases().fetchUserSetting(),
      dispatch(initializeTimesheet($targetDate, timesheet)),
    ]);

    if ($timesheet && $timesheet.isMigratedSummary) {
      dispatch(showAlert(msg().Att_Err_CanNotDisplayBeforeUsing));
    }

    // 休憩理由と承認履歴は日毎にローディングが必要なので毎回取得する
    await Promise.all([
      fetchRestTimeReasons($targetDate, $timesheet),
      dispatch(fetchApprovalRequestHistoryRepository($targetDate, $timesheet)),
    ]);
  };

export const saveDailyRecord = async (
  editing: UiDailyEditingState,
  workingType: WorkingType
) => {
  const { targetDate } = editing;
  await UseCases().saveDailyRecord(convertToDailyRecord(editing, workingType));
  await resetTimesheet(targetDate);
};

export const fixDailyRequest =
  (
    record: UiDailyEditingState,
    remarkableStatus: DailyRequestStatus,
    workingType: WorkingType
  ) =>
  async (dispatch: AppDispatch) => {
    const { targetDate } = record;

    const result = await UseCases().submitFixDailyRequestAndSaveDailyRecord({
      dailyRecord: convertToDailyRecord(record, workingType),
      dailyRequestSummary: { status: remarkableStatus },
    });

    // 保存処理は複数の API が呼ばれていている。
    // どれか一つが成功しているかもしれないので必ず Timesheet は更新する。
    const timesheet = await resetTimesheet(targetDate);

    if (result) {
      // 失敗した場合は承認履歴の呼び出しは必要ない
      await dispatch(
        fetchApprovalRequestHistoryRepository(targetDate, timesheet)
      );
    }
  };

export const cancelApprovalDailyRequest =
  (record: UiDailyEditingState) => async (dispatch: AppDispatch) => {
    const { targetDate } = record;
    const { result } = await UseCases().cancelApprovalFixDailyRequest(
      record.fixDailyRequest.id
    );
    if (!result) {
      return;
    }
    const timesheet = await resetTimesheet(targetDate);
    await dispatch(
      fetchApprovalRequestHistoryRepository(targetDate, timesheet)
    );
  };

export const cancelDailyRequest =
  (record: UiDailyEditingState) => async (dispatch: AppDispatch) => {
    const { targetDate } = record;
    const { result } = await UseCases().cancelSubmittedFixDailyRequest(
      record.fixDailyRequest.id
    );
    if (!result) {
      return;
    }
    const timesheet = await resetTimesheet(targetDate);
    await dispatch(
      fetchApprovalRequestHistoryRepository(targetDate, timesheet)
    );
  };
