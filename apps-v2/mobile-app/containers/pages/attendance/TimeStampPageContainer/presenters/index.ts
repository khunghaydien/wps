import { Store } from 'redux';

import combined from './combined';
import fixDailyRequest from './fixDailyRequest';
import stampTime from './stampTime';
import { bind } from '@apps/attendance/libraries/Collection';

export default (store: Store) =>
  bind({ combined, stampTime, fixDailyRequest }, store);
