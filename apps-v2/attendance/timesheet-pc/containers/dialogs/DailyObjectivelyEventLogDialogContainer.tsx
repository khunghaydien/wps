import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import {
  apply,
  ObjectivelyEventLog,
} from '@attendance/domain/models/ObjectivelyEventLog';
import { EVENT_TYPE } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import { State } from '@attendance/timesheet-pc/modules';
import { clear as clearRecordAction } from '@attendance/timesheet-pc/modules/entities/objectivelyEventLog';
import { isTimesheetReadOnly } from '@attendance/timesheet-pc/modules/selectors';
import { close as closeDialogAction } from '@attendance/timesheet-pc/modules/ui/dailyObjectivelyEventLogDialog';

import Component from '@attendance/timesheet-pc/components/dialogs/DailyObjectivelyEventLogDialog';

import combineDaily from '@attendance/ui/helpers/objectivelyEventLog/combineDaily';
import extractSettingFromDaily from '@attendance/ui/helpers/objectivelyEventLog/extractSettingFromDaily';
import * as RecordsUtil from '@attendance/libraries/utils/Records';
import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';
import UseCases from '@attendance/timesheet-pc/UseCases';

const DISPLAYED_BEFORE_TIME = 6 * 60;
const DISPLAYED_AFTER_TIME = 6 * 60;

const createParameterForSetToBeApplied = (
  records: ObjectivelyEventLog[],
  dailyRecord: DailyObjectivelyEventLog
) => {
  const applied = records.filter((record) => record.isApplied);
  const appliedEntering = applied.filter(
    (record) => record.eventType === EVENT_TYPE.ENTERING
  );
  const appliedLeaving = applied.filter(
    (record) => record.eventType === EVENT_TYPE.LEAVING
  );
  const $records = dailyRecord.logs.map((log) => {
    if (!log) {
      return {
        enteringId: null,
        leavingId: null,
      };
    }
    const settingId = log.setting.id;
    const enteringId =
      appliedEntering.find((record) => record.setting.id === settingId)?.id ||
      null;
    const leavingId =
      appliedLeaving.find((record) => record.setting.id === settingId)?.id ||
      null;
    return {
      enteringId,
      leavingId,
    };
  });
  return {
    id: dailyRecord.id,
    records: $records,
  };
};

const DailyObjectivelyEventLogDialogContainer: React.FC = () => {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [editingRecords, setEditingRecords] =
    React.useState<ObjectivelyEventLog[]>();
  const dispatch = useDispatch();
  const closeDialog = React.useCallback(() => {
    setOpened(false);
    dispatch(closeDialogAction());
    dispatch(clearRecordAction());
  }, [dispatch]);
  const fired = useSelector(
    (state: State) => state.ui.dailyObjectivelyEventLogDialog
  );
  const proxyEmployee = useSelector(
    (state: State) => state.common.proxyEmployeeInfo
  );
  const employeeId = React.useMemo(
    () => (proxyEmployee.isProxyMode ? proxyEmployee.id : null),
    [proxyEmployee]
  );
  const targetDate = useSelector(
    (state: State) => state.ui.editingDailyAttTime?.recordDate
  );
  const workingType = useSelector((state: State) =>
    RecordsUtil.getWithinRange(
      targetDate,
      state.entities.timesheet.workingTypes
    )
  );
  const appliedObjectivelyEventLogs = useSelector(
    (state: State) => state.ui.editingDailyAttTime?.dailyObjectivelyEventLog
  );
  const objectivelyEventLogs = useSelector(
    (state: State) => state.entities?.objectivelyEventLog
  );
  const sources = React.useMemo(
    () =>
      appliedObjectivelyEventLogs
        ? extractSettingFromDaily(appliedObjectivelyEventLogs)
        : [],
    [appliedObjectivelyEventLogs]
  );
  const originalRecords = React.useMemo(
    () =>
      objectivelyEventLogs && appliedObjectivelyEventLogs
        ? combineDaily(objectivelyEventLogs, appliedObjectivelyEventLogs)
        : objectivelyEventLogs || [],
    [objectivelyEventLogs, appliedObjectivelyEventLogs]
  );
  const loading = useSelector(
    (state: State) => !!state.common.app.loadingDepth
  );
  const readOnly = useSelector((state: State) => isTimesheetReadOnly(state));
  const allowedEditLogs = useAccessControl({
    requireIfByEmployee: ['createDeleteAttObjectivelyEventLogByEmployee'],
    requireIfByDelegate: ['createDeleteAttObjectivelyEventLogByDelegate'],
  });
  const allowedSetToApplied = useAccessControl({
    requireIfByEmployee: ['selectAttObjectivelyEventLogByEmployee'],
    requireIfByDelegate: ['selectAttObjectivelyEventLogByDelegate'],
  });
  const reload = React.useCallback(
    () =>
      Promise.allSettled([
        UseCases().fetchObjectivelyEventLogs({
          employeeId,
          targetDate,
        }),
        UseCases().reloadOneDailyObjectivelyEventLog({
          employeeId,
          startDate: targetDate,
          endDate: targetDate,
        }),
      ]),
    [employeeId, targetDate]
  );
  const filteredRecords = React.useMemo(() => {
    if (!editingRecords) {
      return editingRecords;
    }
    if (expanded) {
      return editingRecords;
    } else {
      const startTime = workingType?.startTime - DISPLAYED_AFTER_TIME;
      const endTime = workingType?.endTime + DISPLAYED_BEFORE_TIME;
      return editingRecords.filter(
        (record) => startTime <= record.time && record.time <= endTime
      );
    }
  }, [expanded, editingRecords, workingType]);
  const onClickToggleDisplay = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);
  const onCheckRecord = React.useCallback(
    (id: string) => {
      setEditingRecords(apply(editingRecords, id));
    },
    [editingRecords, setEditingRecords]
  );
  const onClickAdd = React.useCallback(
    async (
      record: Parameters<
        React.ComponentProps<typeof Component>['onClickAdd']
      >[0]
    ) => {
      await UseCases().createObjectivelyEventLog({
        employeeId,
        targetDate,
        ...record,
      });
      await reload();
    },
    [employeeId, targetDate, reload]
  );
  const onClickRemove = React.useCallback(
    async (id) => {
      await UseCases().removeObjectivelyEventLog(id);
      await reload();
    },
    [reload]
  );
  const onSubmit = React.useCallback(async () => {
    const input = createParameterForSetToBeApplied(
      editingRecords,
      appliedObjectivelyEventLogs
    );
    await UseCases().setToBeAppliedToDailyObjectivelyEventLog(input);
    await UseCases().reloadOneDailyObjectivelyEventLog({
      employeeId,
      startDate: targetDate,
      endDate: targetDate,
    });
    closeDialog();
  }, [
    targetDate,
    employeeId,
    appliedObjectivelyEventLogs,
    editingRecords,
    closeDialog,
  ]);
  const onCancel = closeDialog;

  React.useEffect(() => {
    if (fired) {
      UseCases()
        .fetchObjectivelyEventLogs({
          employeeId,
          targetDate,
        })
        .then(() => {
          setOpened(true);
        })
        .catch(() => {
          closeDialog();
        });
    }
  }, [fired, employeeId, targetDate, closeDialog]);

  React.useEffect(() => {
    setEditingRecords(originalRecords);
  }, [originalRecords, setEditingRecords]);

  if (!opened) {
    return null;
  }

  return (
    <Component
      {...{
        targetDate,
        sources,
        records: filteredRecords,
        onClickToggleDisplay,
        onCheckRecord,
        onClickAdd,
        onClickRemove,
        onSubmit,
        onCancel,
        expanded,
        allowedEditLogs,
        allowedSetToApplied,
        loading,
        readOnly,
      }}
    />
  );
};

export default DailyObjectivelyEventLogDialogContainer;
