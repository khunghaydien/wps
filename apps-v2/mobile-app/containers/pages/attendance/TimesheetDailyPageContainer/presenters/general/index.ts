import { Store } from 'redux';

import fetchUserSetting from './fetchUserSetting';
import { bind } from '@attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      fetchUserSetting,
    },
    store
  );
