import earlyLeaveRequest from './earlyLeaveRequest';
import lateArrivalRequest from './lateArrivalRequest';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) =>
  bind({ earlyLeaveRequest, lateArrivalRequest }, store);
