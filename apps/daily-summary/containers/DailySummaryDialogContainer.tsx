import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';

import * as DailySummaryActions from '../action-dispatchers/DailySummary';

import DailySummaryDialog from '../components';

import { CloseEventHandler } from '../events';
import { useACL } from './hooks/useACL';

type OwnProps = Readonly<{
  margin?: string;
  isModal?: boolean;
  onClose: CloseEventHandler;
}>;

const DailySummaryDialogContainer = ({
  margin: _margin,
  onClose: onCloseHandler,
  ...ownProps
}: OwnProps) => {
  const { editTimeTrack } = useACL();
  const user = useSelector((state: State) => state.entities.user, shallowEqual);
  const dailySummary = useSelector(
    (state: State) => state.ui.dailySummary,
    shallowEqual
  );
  const timestampComment = useSelector(
    (state: State) => state.ui.dailySummary.timestampComment
  );

  /* TODO 工数確定が実装されたら対応する */
  const isLocked = useSelector(
    (state: State) => state.entities.user.isDelegated
  );
  const isEnableEndStamp = useSelector(
    (state: State) => state.ui.dailySummary.isEnableEndStamp
  );
  const loadingDepth = useSelector(
    (state: State) => (state.common as any).app.loadingDepth
  );
  const plannerDefaultView = useSelector(
    (state: State) => (state.common as any).personalSetting.plannerDefaultView
  );
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const hasLeave = React.useMemo(() => {
    return !user.isDelegated && !isLocked && isEnableEndStamp;
  }, [user.isDelegated, isLocked, isEnableEndStamp]);
  const onSave = React.useCallback(() => {
    dispatch(
      DailySummaryActions.saveDailySummary(dailySummary, onCloseHandler, user)
    );
  }, [dispatch, dailySummary, onCloseHandler, user]);
  const onSaveAndLeave = React.useCallback(() => {
    dispatch(
      DailySummaryActions.saveDailySummaryAndLeaveWork(
        dailySummary,
        timestampComment,
        plannerDefaultView,
        onCloseHandler,
        user
      )
    );
  }, [
    dispatch,
    dailySummary,
    timestampComment,
    plannerDefaultView,
    onCloseHandler,
    user,
  ]);
  const onClose = React.useCallback(() => {
    onCloseHandler({
      dismissed: true,
      saved: false,
      timestamp: false,
      targetDate: dailySummary.targetDate,
    });
  }, [dailySummary.targetDate, onCloseHandler]);

  return (
    <DailySummaryDialog
      {...ownProps}
      readOnly={!editTimeTrack}
      isDelegated={user.isDelegated}
      isLoading={loadingDepth > 0}
      hasLeave={hasLeave}
      onSave={onSave}
      onSaveAndLeave={onSaveAndLeave}
      onClose={onClose}
    />
  );
};

export default DailySummaryDialogContainer;
