import { Store } from 'redux';

import fetch from './fetch';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      fetch,
    },
    store
  );
