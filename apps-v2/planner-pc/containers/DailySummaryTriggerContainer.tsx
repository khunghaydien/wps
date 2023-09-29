import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';

import { closeDailySummary } from '../actions/dailySummary';

import DailySummaryTrigger from '../components/DailySummaryTrigger';

import { CloseEvent } from '../../daily-summary';

type OwnProps = {
  'data-testid'?: string;
  date?: Date;
  asDefaultView?: boolean;
  children?: React.ReactNode;
};

const DailySummaryTriggerContainer: React.FC<OwnProps> = ({
  date = new Date(),
  asDefaultView = false,
  ...props
}: OwnProps) => {
  const userSetting = useSelector((state: State) => state.userSetting);
  const plannerDefaultView = useSelector(
    (state: State) => state.common.personalSetting.plannerDefaultView
  ) as 'Weekly' | 'Daily';
  const userPermission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const isOpenDailySummaryByDefault = React.useMemo(() => {
    return userSetting.useWorkTime && plannerDefaultView === 'Daily';
  }, [userSetting.useWorkTime, plannerDefaultView]);

  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const onClose = React.useCallback(
    (e: CloseEvent) => {
      dispatch(closeDailySummary(plannerDefaultView, e));
    },
    [dispatch, plannerDefaultView]
  );

  return (
    <DailySummaryTrigger
      {...props}
      date={date}
      userPermission={userPermission}
      onClose={onClose}
      isInitialView={asDefaultView && isOpenDailySummaryByDefault}
    />
  );
};

export default DailySummaryTriggerContainer;
