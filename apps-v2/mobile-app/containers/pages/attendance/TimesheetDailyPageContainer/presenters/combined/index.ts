import { Store } from 'redux';

import submitFixDailyRequestAndSaveDailyRecord from './submitFixDailyRequestAndSaveDailyRecord';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      submitFixDailyRequestAndSaveDailyRecord,
    },
    store
  );
