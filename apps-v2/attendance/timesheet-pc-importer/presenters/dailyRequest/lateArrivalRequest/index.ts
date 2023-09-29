import fetchReasons from './fetchReasons';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) => bind({ fetchReasons }, store);
