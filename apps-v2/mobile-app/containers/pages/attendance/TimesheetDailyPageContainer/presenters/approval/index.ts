import { Store } from 'redux';

import requestHistory from './requestHistory';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      requestHistory,
    },
    store
  );
