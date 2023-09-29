import { Store } from 'redux';

import Events from '../Events';
import createBehaviors from './behaviors';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';

export default (store: Store): void => {
  const behaviors = createBehaviors(store);

  // 社員切替後
  Events.selectedEmployee.subscribe(behaviors.cleanTimesheetRecords);

  // 所定情報取得後
  UseCases().fetchContractedWorkTimes.subscribe(behaviors.fetchRestTimesBulk);
};
