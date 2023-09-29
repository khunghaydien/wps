import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPermissionTestConditionsForEdit } from '@attendance/domain/models/AttDailyRecord';

import { State } from '../../../modules';
import * as selectors from '../../../modules/selectors';
import { open as openDailyObjectivelyEventLogDialog } from '../../../modules/ui/dailyObjectivelyEventLogDialog';
import { actions as editingDailyAttTimeActions } from '../../../modules/ui/editingDailyAttTime';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../components/dialogs/DailyAttTimeDialog/Content';

import * as localSelectors from './selectors';
import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

const Container: React.FC = () => {
  const dispatch = useDispatch();
  const localLoading = useSelector(localSelectors.localLoading);
  const actions = React.useMemo(
    () => bindActionCreators(editingDailyAttTimeActions, dispatch),
    [dispatch]
  );
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
  const enabledObjectivelyEventLog = React.useMemo(
    () => workingType.useObjectivelyEventLog,
    [workingType]
  );
  const permissionTestConditionsForEdit = React.useMemo(
    () => getPermissionTestConditionsForEdit(),
    []
  );
  const readOnly = !useAccessControl(permissionTestConditionsForEdit);
  const enabledRestReason = workingType?.useRestReason;
  const restTimeReasons = useSelector(
    (state: State) => state.entities.restTimeReasons
  );
  const enabledDeviationReason = workingType?.useExtendedItemAsDeviationReason;
  const enabledDeviationReasonText = workingType?.useDeviationReasonText;
  const dailyDeviatedReasons = useSelector(
    (state: State) => state.entities.dailyDeviatedReason
  );
  const lockedSummary = useSelector(selectors.isTimesheetReadOnly);
  const lockedDailyRecord = useSelector(
    selectors.isDailyRecordReadOnly(dailyAttTime.recordId)
  );
  const maxRestTimesCount = useSelector(
    (state: State) => state.entities.timesheet.dailyRestCountLimit
  );
  const onUpdateRemarks = React.useCallback(
    (value: string) => {
      dispatch(editingDailyAttTimeActions.update('remarks', value));
    },
    [dispatch]
  );
  const onOpenDailyObjectivelyEventLogDialog = React.useCallback(() => {
    dispatch(openDailyObjectivelyEventLogDialog());
  }, [dispatch]);

  if (!dailyAttTime) {
    return null;
  }

  return (
    <Component
      loading={localLoading}
      readOnly={readOnly}
      lockedSummary={lockedSummary}
      lockedDailyRecord={lockedDailyRecord}
      enabledRestReason={enabledRestReason}
      enabledObjectivelyEventLog={enabledObjectivelyEventLog}
      enabledDeviationReason={enabledDeviationReason}
      enabledDeviationReasonText={enabledDeviationReasonText}
      maxRestTimesCount={maxRestTimesCount}
      dailyAttTime={dailyAttTime}
      restTimeReasons={restTimeReasons}
      dailyDeviatedReasons={dailyDeviatedReasons}
      onUpdateClockTime={actions.update}
      onAddRestTime={actions.addRestTime}
      onDeleteRestTime={actions.deleteRestTime}
      onUpdateRestTime={actions.updateRestTime}
      onUpdateDeviationReason={actions.updateDeviationReason}
      onUpdateDeviationReasonId={actions.updateDeviationReasonId}
      onUpdateRemarks={onUpdateRemarks}
      onOpenDailyObjectivelyEventLogDialog={
        onOpenDailyObjectivelyEventLogDialog
      }
    />
  );
};

export default Container;
