import * as React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { State } from '../../../modules';
import * as selectors from '../../../modules/selectors';
import { close } from '../../../modules/ui/dailyAttTimeDialog';
import { actions as editingDailyAttTimeActions } from '../../../modules/ui/editingDailyAttTime';

import * as actions from './actions';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../components/dialogs/DailyAttTimeDialog';

import ContentContainer from './ContentContainer';
import HeaderContainer from './HeaderContainer';
import { convertToEditing, convertToSaving } from './helpers';
import * as localSelectors from './selectors';
import subscriber from './subscriber';
import UseCases from '@attendance/timesheet-pc/UseCases';

const Container: React.FC = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const hideDialog = React.useCallback(() => dispatch(close()), [dispatch]);
  const globalLoading = useSelector(selectors.isLoading);
  const localLoading = useSelector(localSelectors.localLoading);
  const isDelegated = useSelector(selectors.isByDelegate);
  const proxyEmployeeId = useSelector(selectors.employeeId);
  const dailyAttTime = useSelector(
    (state: State) => state.ui.editingDailyAttTime
  );
  const attRecord = useSelector(selectors.editingAttRecord);
  const workingType = useSelector((state: State) =>
    RecordsUtil.getWithinRange(
      attRecord.recordDate,
      state.entities.timesheet.workingTypes
    )
  );
  const enabledFixDailyRequest = workingType?.useFixDailyRequest;
  const enabledObjectivelyEventLog = workingType?.useObjectivelyEventLog;
  const enabledRestReason = workingType?.useRestReason;
  const isLockedSummary = useSelector(selectors.isTimesheetReadOnly);
  const isLockedDailyRecord = useSelector(
    selectors.isDailyRecordReadOnly(dailyAttTime?.recordId)
  );
  // 月次勤務確定されている もしくは 客観情報ログを使用しないで日次勤務確定がされている場合
  const isReadOnly = React.useMemo(
    () =>
      isLockedSummary || (isLockedDailyRecord && !enabledObjectivelyEventLog),
    [enabledObjectivelyEventLog, isLockedDailyRecord, isLockedSummary]
  );
  const targetDate = dailyAttTime.recordDate;
  const onSave = React.useCallback(() => {
    const record = convertToSaving(dailyAttTime);
    if (!isLockedDailyRecord) {
      actions.save({
        ...record,
        employeeId: isDelegated ? proxyEmployeeId : null,
      });
    } else if (record.objectivelyEventLog) {
      actions.saveDailyObjectivelyEventLogDeviationReason(
        record.objectivelyEventLog
      );
    }
  }, [dailyAttTime, isDelegated, isLockedDailyRecord, proxyEmployeeId]);

  React.useEffect(() => {
    return subscriber(store);
  }, [store]);

  return (
    <Component
      isLoading={globalLoading || localLoading}
      isReadOnly={isReadOnly}
      targetDate={targetDate}
      enabledFixDailyRequest={enabledFixDailyRequest}
      enabledRestReason={enabledRestReason}
      onCancel={hideDialog}
      onSave={onSave}
      Header={HeaderContainer}
      Content={ContentContainer}
    />
  );
};

const DailyAttTimeDialogContainer: React.FC = () => {
  const dispatch = useDispatch();
  const attRecord = useSelector(selectors.editingAttRecord);
  const dailyObjectivelyEventLog = useSelector(
    selectors.editingDailyObjectivelyEventLog
  );
  const dailyAttTime = useSelector(
    (state: State) => state.ui.editingDailyAttTime
  );
  const isDelegated = useSelector(selectors.isByDelegate);
  const proxyEmployeeId = useSelector(selectors.employeeId);
  const employeeId = isDelegated ? proxyEmployeeId : null;

  const lockedSummary = useSelector(selectors.isTimesheetReadOnly);
  const lockedDailyRecord = useSelector(
    selectors.isDailyRecordReadOnly(dailyAttTime?.recordId || null)
  );
  const localLoading = useSelector(localSelectors.localLoading);

  const workingType = useSelector((state: State) =>
    RecordsUtil.getWithinRange(
      attRecord?.recordDate,
      state.entities.timesheet.workingTypes
    )
  );
  const maxRestTimesCount = useSelector(
    (state: State) => state.entities.timesheet.dailyRestCountLimit
  );
  const enabledRestReason = workingType?.useRestReason;
  const enabledExtendedItemAsDeviationReason =
    workingType?.useExtendedItemAsDeviationReason;
  const enabledObjectivelyEventLog = React.useMemo(
    () => workingType?.useObjectivelyEventLog,
    [workingType]
  );
  const initialize = React.useCallback(
    (
      ...[attRecord, maxRestTimesCount, dailyObjectivelyEventLog]: Parameters<
        typeof convertToEditing
      >
    ) => {
      dispatch(
        editingDailyAttTimeActions.set(
          convertToEditing(
            attRecord,
            maxRestTimesCount,
            dailyObjectivelyEventLog
          )
        )
      );
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (!attRecord) {
      // 勤怠明細がない場合は更新しない
      return;
    }
    // loading 中は dailyObjectivelyEventLog が古いデータになっているので null にする
    initialize(
      attRecord,
      maxRestTimesCount,
      localLoading ? null : dailyObjectivelyEventLog
    );
  }, [
    attRecord?.recordDate, // 画面 Open/Close 時に変化する
    maxRestTimesCount,
    localLoading, // 部分ローディングが走っている場合に変化する
  ]);

  React.useEffect(() => {
    if (lockedSummary) {
      return;
    }
    if (dailyAttTime?.recordDate) {
      const targetDate = dailyAttTime.recordDate;
      Promise.all([
        !lockedDailyRecord &&
          enabledRestReason &&
          UseCases().fetchRestTimeReasons({ employeeId, targetDate }),
        enabledObjectivelyEventLog &&
          enabledExtendedItemAsDeviationReason &&
          UseCases().fetchDailyObjectivelyEventLogDeviationReasons({
            employeeId,
            targetDate,
          }),
      ]);
    }
  }, [
    dailyAttTime?.recordDate,
    employeeId,
    enabledExtendedItemAsDeviationReason,
    enabledObjectivelyEventLog,
    enabledRestReason,
    lockedDailyRecord,
    lockedSummary,
  ]);

  // attRecord はユーザがダイアログを Open/Close したかどうか
  // dailyAttTime は初期化したかどうか
  // ※ attRecord だけを確認すると画面に何も表示されなくなる
  // ※ dailyAttTime だけを確認すると画面が閉じられなくなる
  // Open 時の Timeline：
  //  - targetDate が指定される = attRecord に値が入る
  //  - 上記の変化を hook にして dailyAttTime が初期化される
  // Close 時の Timeline:
  //  - targetDate が null になる = attRecord が null になる
  //  - 上記の変化を hook にして dailyAttTime が null になる
  if (!attRecord || !dailyAttTime) {
    return null;
  }

  return <Container />;
};

export default DailyAttTimeDialogContainer;
