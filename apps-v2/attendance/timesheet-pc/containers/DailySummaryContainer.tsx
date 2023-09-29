import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { delegate } from '../../../domain/models/User';

import { State } from '../modules';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import { closeDailySummary } from '../action-dispatchers/DailySummary';

import { CloseEvent } from '../../../daily-summary';

const DailySummary = React.lazy(() => import('../../../daily-summary'));

type OwnProps = {
  date: string;
  onClose: () => void;
};

const DailySummaryContainer = (props: OwnProps) => {
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
      dispatch(closeDailySummary(e, user));
    },
    [dispatch]
  );

  return (
    <React.Suspense fallback={<React.Fragment />}>
      <DailySummary
        {...props}
        user={user}
        userPermission={userPermission}
        onClose={onClose}
      />
    </React.Suspense>
  );
};

export default DailySummaryContainer;
