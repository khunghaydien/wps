import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { delegate } from '../../../domain/models/User';

import { State } from '../modules';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import { closeDailyAllowance } from '../action-dispatchers/DailyAllowance';

import { CloseEvent } from '../../daily-allowance';

const DailyAllowance = React.lazy(() => import('../../daily-allowance'));

type OwnProps = {
  date: string;
  isLocked: boolean;
  dailyAllowanceList: [];
  availableAllowanceCount: number;
  onClose: () => void;
};

const DailyAllowanceContainer = (props: OwnProps) => {
  const dispatch: AppDispatch = useDispatch();
  const employee = useSelector(
    (state: State) => state.common.proxyEmployeeInfo
  );
  const userPermission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const user = React.useMemo(() => {
    // @ts-ignore
    // TODO Fix mismatched type for delegate and employee
    return employee.id ? delegate(employee) : undefined;
  }, [employee]);
  const onClose = React.useCallback(
    (e: CloseEvent) => {
      if (e.dismissed || e.timestamp) {
        props.onClose();
      }
      dispatch(closeDailyAllowance(e, user, onClose));
    },
    [dispatch]
  );

  return (
    <React.Suspense fallback={<React.Fragment />}>
      <DailyAllowance
        {...props}
        user={user}
        availableAllowanceCount={props.availableAllowanceCount}
        userPermission={userPermission}
        onClose={onClose}
      />
    </React.Suspense>
  );
};

export default DailyAllowanceContainer;
