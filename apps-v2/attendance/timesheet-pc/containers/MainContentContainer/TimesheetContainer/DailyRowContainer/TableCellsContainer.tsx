import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getPermissionTestConditionsForEdit } from '@attendance/domain/models/AttDailyRecord';
import {
  LAYOUT_ITEM_TYPE,
  SYSTEM_ITEM_NAME,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';
import {
  ACTIONS_FOR_FIX,
  getPermissionTestConditionsForActionForFix,
} from '@attendance/domain/models/FixDailyRequest';

import { State } from '@attendance/timesheet-pc/modules';

import FieldsActions from '@attendance/timesheet-pc/action-dispatchers/DailyFields';

import DailyRow from '@attendance/timesheet-pc/components/MainContent/Timesheet/DailyRow';
import Component from '@attendance/timesheet-pc/components/MainContent/Timesheet/DailyRow/TableCells';

import { fieldChanged } from './helpers';
import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

const mapStateToProps = (state: State) => ({
  row: state.ui.dailyRecordDisplayFieldLayout.layoutRow,
  origLayoutValues: state.ui.dailyRecordDisplayFieldLayout.layoutValues,
  layoutValues: state.ui.dailyRecordDisplayFieldLayout.layoutTempValues,
  readOnly: state.entities.timesheet.attSummary?.isLocked,
  useFixDailyRequest: state.entities.timesheet.workingType.useFixDailyRequest,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return React.useMemo(() => {
    const fieldsActions = FieldsActions(dispatch);

    return {
      update: fieldsActions.update,
      save: fieldsActions.save,
      fixDaily: fieldsActions.fixDaily,
      cancelRequest: fieldsActions.cancelRequest,
    };
  }, [dispatch]);
};

const TableCellsContainer: React.ComponentProps<
  typeof DailyRow
>['TableCellsContainer'] = ({
  targetDate,
  recordId,
  requestConditions,
  fixDailyRequest,
  useFixDailyRequest,
}) => {
  const {
    row,
    origLayoutValues,
    layoutValues,
    readOnly,
    useFixDailyRequest: useFixRequest,
  } = useSelector(mapStateToProps, shallowEqual);

  const { update, save, fixDaily, cancelRequest } = useMapDispatchToProps();

  const layoutRow = React.useMemo(() => {
    let layoutRow = row;
    if (!useFixRequest) {
      layoutRow = row?.filter(
        (item) =>
          !(
            item.type === LAYOUT_ITEM_TYPE.ACTION &&
            item.objectItemName === SYSTEM_ITEM_NAME.DAILY_FIX_REQUEST_BUTTON
          )
      );
    }
    return layoutRow;
  }, [row, useFixRequest]);

  const values = React.useMemo(
    () => (layoutValues ? layoutValues[targetDate] : null),
    [targetDate, layoutValues]
  );

  const permissionTestConditionsForEdit = React.useMemo(
    () => getPermissionTestConditionsForEdit(),
    []
  );
  const allowedEditField = useAccessControl(permissionTestConditionsForEdit);

  const showDailyFix = React.useMemo(
    () => requestConditions?.isAvailableToOperateAttTime,
    [requestConditions?.isAvailableToOperateAttTime]
  );

  const permissionTestConditionsForActionForFix = React.useMemo(
    () =>
      getPermissionTestConditionsForActionForFix(
        fixDailyRequest?.performableActionForFix
      ),
    [fixDailyRequest?.performableActionForFix]
  );

  const allowedActionForFixDailyRequest = useAccessControl(
    permissionTestConditionsForActionForFix
  );

  const onUpdateValue = React.useCallback(
    (key: string, value: number | string | boolean) => {
      update({ date: targetDate, key, value });
    },
    [update, targetDate]
  );

  const onSaveFields = React.useCallback(() => {
    save({
      recordId,
      row: layoutRow,
      rowValues: values,
    });
  }, [save, recordId, layoutRow, values]);

  const submitDailyFix = React.useCallback(() => {
    if (fixDailyRequest?.performableActionForFix === ACTIONS_FOR_FIX.Submit) {
      const changed = fieldChanged({
        orignValues: origLayoutValues[targetDate],
        currentValues: layoutValues[targetDate],
      });
      fixDaily(
        {
          id: recordId,
          dailyRequestSummary: {
            status: requestConditions.remarkableRequestStatus,
          },
        },
        changed,
        layoutRow,
        values
      );
    } else {
      cancelRequest(fixDailyRequest);
    }
  }, [
    cancelRequest,
    fixDaily,
    fixDailyRequest,
    layoutValues,
    origLayoutValues,
    recordId,
    requestConditions.remarkableRequestStatus,
    targetDate,
  ]);

  return (
    <Component
      row={layoutRow}
      values={values}
      readOnly={readOnly || !allowedEditField}
      showDailyFix={showDailyFix}
      allowedAction={allowedActionForFixDailyRequest}
      performableActionForFix={fixDailyRequest?.performableActionForFix}
      useFixDailyRequest={useFixDailyRequest}
      onUpdateValue={onUpdateValue}
      onSaveFields={onSaveFields}
      submitDailyFix={submitDailyFix}
    />
  );
};

export default TableCellsContainer;
