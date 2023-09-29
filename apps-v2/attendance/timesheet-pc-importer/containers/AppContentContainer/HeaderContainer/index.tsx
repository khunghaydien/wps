import * as React from 'react';
import { useSelector, useStore } from 'react-redux';

import { ownerEmployeeId } from '@attendance/timesheet-pc-importer/modules/selectors';

import Component from '@attendance/timesheet-pc-importer/components/AppContent/Header';

import createControllers from './controllers';
import DateSelectorContainer from './DateSelectorContainer';
import {
  AppState,
  AppStore,
} from '@attendance/timesheet-pc-importer/store/AppStore';
import {
  filterForSubmitting,
  hasChecked,
} from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const HeaderContainer: React.FC = () => {
  const store = useStore() as AppStore;
  const controllers = React.useMemo(() => createControllers(store), [store]);
  const records = useSelector((state: AppState) => state.timesheet.records);
  const disabledRegistering = React.useMemo(
    () => !filterForSubmitting([...(records?.values() || [])])?.length,
    [records]
  );
  const disabledChecking = React.useMemo(
    () => !hasChecked([...(records?.values() || [])]),
    [records]
  );
  const disabledFetchContractedWorkTimes = !useSelector(ownerEmployeeId);

  return (
    <Component
      disabledRegistering={disabledRegistering}
      disabledChecking={disabledChecking}
      onClickFetchContractedWorkTimes={controllers.fetchContractedWorkTimes}
      onClickCheckTimesheet={controllers.checkTimesheet}
      onClickRegisterToTimesheet={controllers.saveTimesheet}
      DateSelectorContainer={DateSelectorContainer}
      disabledFetchContractedWorkTimes={disabledFetchContractedWorkTimes}
    />
  );
};

export default HeaderContainer;
