import { Store } from 'redux';

import cleanTimesheetRecords from './cleanTimesheetRecords';
import fetchRestTimesBulk from './fetchRestTimesBulk';
import { bind } from '@attendance/libraries/Collection';

export const methods = {
  cleanTimesheetRecords,
  fetchRestTimesBulk,
};

export default (store: Store) => bind(methods, store);
