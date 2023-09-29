import fetchRestTimeReasons from './fetchRestTimeReasons';
import fetchRestTimeReasonsForBulk from './fetchRestTimeReasonsForBulk';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) =>
  bind({ fetchRestTimeReasons, fetchRestTimeReasonsForBulk }, store);
