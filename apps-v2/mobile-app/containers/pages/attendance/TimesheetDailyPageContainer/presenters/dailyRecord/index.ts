import { Store } from 'redux';

import fetchRestTimeReasons from './fetchRestTimeReasons';
import save from './save';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      save,
      fetchRestTimeReasons,
    },
    store
  );
