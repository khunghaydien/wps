import * as React from 'react';
import { useSelector, useStore } from 'react-redux';

import { State } from '@attendance/timesheet-pc-importer/modules';

import Component from '@attendance/timesheet-pc-importer/components/AppContent/Header/DateSelector';

import createControllers from './controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const DateSelectorContainer: React.FC = () => {
  const store = useStore() as AppStore;
  const controllers = React.useMemo(() => createControllers(store), [store]);

  const startDate = useSelector((state: State) => state.timesheet.startDate);
  const endDate = useSelector((state: State) => state.timesheet.endDate);

  return (
    <Component
      startDate={startDate}
      endDate={endDate}
      onChangeStartDate={controllers.updateStartDate}
      onChangeEndDate={controllers.updateEndDate}
    />
  );
};

export default DateSelectorContainer;
