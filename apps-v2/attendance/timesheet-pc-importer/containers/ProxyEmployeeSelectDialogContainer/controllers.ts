import Employee from '@widgets/dialogs/ProxyEmployeeSelectDialog/models/Employee';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import Events from '@attendance/timesheet-pc-importer/Events';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch }: AppStore) => {
  return {
    selectEmployee: async (employee: Employee): Promise<boolean> => {
      dispatch(actions.common.proxyEmployeeInfo.set(employee));
      Events.selectedEmployee.publish(employee);
      return true;
    },
  };
};
