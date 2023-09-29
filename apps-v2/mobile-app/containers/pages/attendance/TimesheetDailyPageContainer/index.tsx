import * as React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import nanoid from 'nanoid';

import { ACTIONS_FOR_FIX } from '@apps/attendance/domain/models/FixDailyRequest';
import { WorkingType } from '@apps/attendance/domain/models/WorkingType';

import { actions as UiDailyEditingActions } from '../../../../modules/attendance/timesheet/ui/daily/editing';
import { State } from '@mobile/modules';

import * as DailyRecordActions from '../../../../action-dispatchers/attendance/dailyRecord';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import TimesheetDailyPage from '../../../../components/pages/attendance/TimesheetDailyPage';

import setup from './config/production';
import events from './events';

const Container = (ownProps: { targetDate: string }) => {
  const [key, setKey] = React.useState<string>('key');
  const store = useStore();
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          onChangeRestTime: UiDailyEditingActions.updateRestTime,
          onClickRemoveRestTime: UiDailyEditingActions.deleteRestTime,
          onClickAddRestTime: UiDailyEditingActions.addRestTime,
          onChangeStartTime: UiDailyEditingActions.updateStartTime,
          onChangeEndTime: UiDailyEditingActions.updateEndTime,
          onChangeOtherRestTime: UiDailyEditingActions.updateRestHours,
          onChangeOtherRestReason: UiDailyEditingActions.updateOtherRestReason,
          onChangeCommuteCount: UiDailyEditingActions.updateCommuteCount,
          onChangeRemarks: UiDailyEditingActions.updateRemarks,
          onClickSave: DailyRecordActions.saveDailyRecord,
        },
        dispatch
      ),
    [dispatch]
  );
  const permission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const currentDate = useSelector(
    (state: State) => state.attendance.timesheet.ui.daily.paging.current
  );
  const lockedSummary = useSelector(
    (state: State) => state.attendance.timesheet.entities.isLocked
  );
  const record = useSelector(
    (state: State) => state.attendance.timesheet.ui.daily.editing
  );
  const restTimeReasons = useSelector(
    (state: State) => state.attendance.timesheet.ui.daily.restTimeReasons
  );
  const workingType = useSelector((state: State) =>
    RecordsUtil.getWithinRange(
      state.attendance.timesheet.ui.daily.paging.current,
      state.attendance.timesheet.entities.workingTypes
    )
  ) as WorkingType;
  const isEditable = useSelector(
    (state: State) => state.attendance.timesheet.ui.daily.editing.editable
  );
  const timesheet = useSelector(
    (state: State) => state.attendance.timesheet.entities
  );
  const sourceRecord = React.useMemo(
    () => timesheet.recordsByRecordDate[currentDate],
    [timesheet.recordsByRecordDate, currentDate]
  );
  const maxRestTimesCount = React.useMemo(
    () => timesheet.dailyRestCountLimit,
    [timesheet.dailyRestCountLimit]
  );

  const approvalHistories = useSelector(
    (state: State) => state.attendance.dailyRequest.entities.approvalHistories
  );

  const onClickSave = React.useCallback(
    () => actions.onClickSave(record, workingType),
    [actions, record, workingType]
  );

  const onClickSaveAndRequest = React.useCallback(async () => {
    dispatch(
      DailyRecordActions.fixDailyRequest(
        record,
        sourceRecord?.remarkableRequestStatus?.status,
        workingType
      )
    );
  }, [
    dispatch,
    record,
    sourceRecord?.remarkableRequestStatus?.status,
    workingType,
  ]);

  const onClickCancel = React.useCallback(async () => {
    switch (record.fixDailyRequest.performableActionForFix) {
      case ACTIONS_FOR_FIX.CancelApproval:
        dispatch(DailyRecordActions.cancelApprovalDailyRequest(record));
        break;
      case ACTIONS_FOR_FIX.CancelRequest:
        dispatch(DailyRecordActions.cancelDailyRequest(record));
        break;
    }
  }, [dispatch, record]);

  React.useEffect(() => {
    setup({ store, permission });
  }, [permission, store]);

  React.useEffect(() => {
    const unsubscribers = [];
    unsubscribers.push(
      events.fetched.subscribe(() => {
        setKey(nanoid(8));
      })
    );
    dispatch(DailyRecordActions.initialize(ownProps.targetDate, timesheet));
    return () => {
      unsubscribers.forEach((m) => m());
    };
  }, []);

  return (
    <TimesheetDailyPage
      key={key}
      approvalHistories={approvalHistories}
      currentDate={currentDate}
      isEditable={isEditable}
      record={record}
      restTimeReasons={restTimeReasons}
      minRestTimesCount={1}
      maxRestTimesCount={maxRestTimesCount}
      sourceRecord={sourceRecord}
      lockedSummary={lockedSummary}
      workingType={workingType}
      onChangeStartTime={actions.onChangeStartTime}
      onChangeEndTime={actions.onChangeEndTime}
      onChangeRestTime={actions.onChangeRestTime}
      onClickAddRestTime={actions.onClickAddRestTime}
      onClickRemoveRestTime={actions.onClickRemoveRestTime}
      onChangeOtherRestTime={actions.onChangeOtherRestTime}
      onChangeOtherRestReason={actions.onChangeOtherRestReason}
      onChangeCommuteCount={actions.onChangeCommuteCount}
      onChangeRemarks={actions.onChangeRemarks}
      onClickSave={onClickSave}
      onClickSaveAndRequest={onClickSaveAndRequest}
      onClickCancel={onClickCancel}
    />
  );
};

export default Container;
