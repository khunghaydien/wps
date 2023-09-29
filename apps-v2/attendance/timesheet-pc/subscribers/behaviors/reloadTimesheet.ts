import { Store } from 'redux';

import { State } from '@attendance/timesheet-pc/modules';

import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store) => async (): Promise<void> => {
  const state = store.getState() as State;

  const targetDate = state.client.selectedPeriodStartDate;
  const delegatedEmployeeInfo = state.common.proxyEmployeeInfo;
  const isDelegated = delegatedEmployeeInfo.isProxyMode;
  const employeeId = isDelegated ? delegatedEmployeeInfo.id : null;

  await UseCases().fetchTimesheet({
    targetDate,
    employeeId,
  });
};
