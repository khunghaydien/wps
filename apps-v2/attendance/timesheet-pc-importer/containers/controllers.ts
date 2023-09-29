import DateUtil from '@apps/commons/utils/DateUtil';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';

const DAY = 1;
const PERIOD = DAY * 14;

export default ({ dispatch }: AppStore) => {
  return {
    initialize: () => {
      UseCases().fetchUserSetting();
      const today = DateUtil.getToday();
      const endDate = DateUtil.addDays(today, PERIOD - 1);
      dispatch(actions.timesheet.create(today, endDate));
    },
  };
};
