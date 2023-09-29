import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch, getState }: AppStore) =>
  async (): Promise<void> => {
    const { startDate, endDate } = getState().timesheet;
    dispatch(actions.timesheet.create(startDate, endDate));
  };
