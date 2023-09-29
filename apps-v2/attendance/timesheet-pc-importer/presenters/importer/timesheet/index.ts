import check from './check';
import fetchContractedWorkTimes from './fetchContractedWorkTimes';
import save from './save';
import { bind } from '@attendance/libraries/Collection';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default (store: AppStore) =>
  bind({ check, fetchContractedWorkTimes, save }, store);
