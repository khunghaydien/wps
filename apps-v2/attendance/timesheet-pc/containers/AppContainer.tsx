import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';

import {
  onChangeApproverEmployee as $onChangeApproverEmployee,
  switchProxyEmployee,
} from '../action-dispatchers/App';

import App from '../components/App';

import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

const AppContainer: React.FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const isEnableViewAttTimeSheetByDelegate = useAccessControl({
    requireIfByEmployee: ['viewAttTimeSheetByDelegate'],
    requireIfByDelegate: ['viewAttTimeSheetByDelegate'],
  });
  const selectedPeriodStartDate = useSelector(
    (state: State) => state.client.selectedPeriodStartDate
  );
  const ownerInfos = useSelector(
    (state: State) => state.entities.timesheet.ownerInfos
  );
  const proxyEmployee = useSelector(
    (state: State) => state.common.proxyEmployeeInfo
  );
  const selectedPeriodEdnDate = React.useMemo(
    () => (ownerInfos?.length > 0 ? ownerInfos.slice(-1)[0].endDate : null),
    [ownerInfos]
  );
  const onDecideProxyEmployee = React.useCallback(
    (targetEmployee) =>
      dispatch(switchProxyEmployee(selectedPeriodStartDate, targetEmployee)),
    [dispatch, selectedPeriodStartDate]
  );
  const onChangeApproverEmployee = React.useCallback(() => {
    if (proxyEmployee && proxyEmployee.id) {
      return;
    }
    dispatch(
      $onChangeApproverEmployee(selectedPeriodStartDate, selectedPeriodEdnDate)
    );
  }, [dispatch, proxyEmployee, selectedPeriodStartDate, selectedPeriodEdnDate]);

  return (
    <App
      isEnableViewAttTimeSheetByDelegate={isEnableViewAttTimeSheetByDelegate}
      // @ts-ignore
      onDecideProxyEmployee={onDecideProxyEmployee}
      onChangeApproverEmployee={onChangeApproverEmployee}
    />
  );
};

export default AppContainer;
