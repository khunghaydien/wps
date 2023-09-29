import { Store } from 'redux';

import submitFixDailyRequestWithClockOut from './submitFixDailyRequestWithClockOut';
import { bind } from '@apps/attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      submitFixDailyRequestWithClockOut,
    },
    store
  );
