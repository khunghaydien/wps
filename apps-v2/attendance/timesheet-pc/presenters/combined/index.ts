import { Store } from 'redux';

import submitFixDailyRequestAndSaveDailyRecord from './submitFixDailyRequestAndSaveDailyRecord';
import submitFixDailyRequestWithClockOut from './submitFixDailyRequestWithClockOut';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      submitFixDailyRequestAndSaveDailyRecord,
      submitFixDailyRequestWithClockOut,
    },
    store
  );
