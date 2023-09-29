import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Allowances } from '../models/attDailyAllowanceAll';
import { CloseEventHandler } from '../models/events';

import { State } from '../modules';
import { actions as dailyAllowanceActions } from '../modules/ui/dailyAllowance';

import { saveDailyAllowanceRecord } from '../action-dispatchers/DailyAllowance';

import DailyAllowanceDialog from '../components';

type OwnProps = Readonly<{
  isModal?: boolean;
  availableAllowanceCount?: number;
  date?: string;
  isLocked?: boolean;
  onClose: CloseEventHandler;
}>;

const DailyAllowanceDialogContainer = ({
  onClose: onCloseHandler,
  availableAllowanceCount,
  date: targetDate,
  isLocked,
  ...ownProps
}: OwnProps) => {
  const user = useSelector((state: State) => state.ui.dailyAllowance.user);
  const loadingDepth = useSelector(
    (state: State) => (state.common as any).app.loadingDepth
  );

  const dailyAllowancAllList = useSelector(
    (state: State) => state.ui.dailyAllowance.dailyRecordAllList
  );

  const isSelectedTab = availableAllowanceCount > 0;

  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const Actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          toggleSelection: dailyAllowanceActions.toggleSelection,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClose = React.useCallback(() => {
    onCloseHandler({
      dismissed: true,
      saved: false,
      timestamp: false,
      targetDate: targetDate,
    });
  }, [targetDate, onCloseHandler]);

  const onSave = React.useCallback(() => {
    dispatch(
      saveDailyAllowanceRecord(
        dailyAllowancAllList,
        onCloseHandler,
        targetDate,
        user
      )
    );
  }, [dispatch, dailyAllowancAllList, onCloseHandler, user]);

  return (
    <DailyAllowanceDialog
      {...ownProps}
      isLoading={loadingDepth > 0}
      isSelectedTab={isSelectedTab}
      targetDate={targetDate}
      isLocked={isLocked}
      dailyAllowanceAllList={dailyAllowancAllList}
      toggleSelection={(row: Allowances) => {
        Actions.toggleSelection(row);
      }}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

export default DailyAllowanceDialogContainer;
