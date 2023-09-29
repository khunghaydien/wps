import { Store } from 'redux';

import create from './create';
import fetch from './fetch';
import fetchDaily from './fetchDaily';
import fetchDailyDeviationReasons from './fetchDailyDeviationReasons';
import remove from './remove';
import saveDailyDeviationReason from './saveDailyDeviationReason';
import setToBeAppliedToDaily from './setToBeAppliedToDaily';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      create,
      remove,
      fetch,
      fetchDaily,
      fetchDailyDeviationReasons,
      setToBeAppliedToDaily,
      saveDailyDeviationReason,
    },
    store
  );
