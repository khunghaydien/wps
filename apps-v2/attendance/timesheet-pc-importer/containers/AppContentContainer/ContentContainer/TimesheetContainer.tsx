import * as React from 'react';
import { useSelector, useStore } from 'react-redux';

import { State } from '@attendance/timesheet-pc-importer/modules';

import Component from '@attendance/timesheet-pc-importer/components/AppContent/Content/Timesheet';

import createControllers from './controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const TimesheetContainer: React.FC = () => {
  const store = useStore() as AppStore;
  const controllers = React.useMemo(() => createControllers(store), [store]);

  const dailyRecords = useSelector((state: State) => state.timesheet.records);

  return (
    <Component
      dailyRecords={dailyRecords}
      onClickCheckAll={controllers.toggleCheckedAll}
      onUpdateDailyRecords={controllers.updateDailyRecords}
    />
  );
};

export default TimesheetContainer;
