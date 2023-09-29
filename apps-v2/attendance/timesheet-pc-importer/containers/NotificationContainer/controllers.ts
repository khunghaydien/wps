import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) => {
  return {
    hide: () => {
      dispatch(actions.common.toast.hide());
    },
    reset: () => {
      dispatch(actions.common.toast.reset());
    },
  };
};
