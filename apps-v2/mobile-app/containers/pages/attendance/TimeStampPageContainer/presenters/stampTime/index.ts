import { Store } from 'redux';

import post from './post';
import { bind } from '@apps/attendance/libraries/Collection';

export default (store: Store) => bind({ post }, store);
