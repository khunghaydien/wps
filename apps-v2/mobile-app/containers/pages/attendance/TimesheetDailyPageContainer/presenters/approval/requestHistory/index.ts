import { Store } from 'redux';

import fetchList from './fetchList';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      fetchList,
    },
    store
  );
