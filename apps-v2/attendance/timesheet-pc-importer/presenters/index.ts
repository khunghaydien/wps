import dailyRecord from './dailyRecord';
import dailyRequest from './dailyRequest';
import importer from './importer';
import leave from './leave';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) =>
  bind({ dailyRecord, dailyRequest, importer, leave }, store);
