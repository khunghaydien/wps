import combined from './combined';
import timesheet from './timesheet';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) => bind({ combined, timesheet }, store);
