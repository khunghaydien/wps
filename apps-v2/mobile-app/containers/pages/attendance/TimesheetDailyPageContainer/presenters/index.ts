import { Store } from 'redux';

import approval from './approval';
import combined from './combined';
import dailyRecord from './dailyRecord';
import fixDailyRequest from './fixDailyRequest';
import general from './general';
import timesheet from './timesheet';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    { approval, combined, general, timesheet, dailyRecord, fixDailyRequest },
    store
  );
