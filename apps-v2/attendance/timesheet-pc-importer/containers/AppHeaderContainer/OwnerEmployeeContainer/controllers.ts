import { bindActionCreators } from 'redux';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';
import { ownerEmployeeId } from '@attendance/timesheet-pc-importer/modules/selectors';

import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({ dispatch, getState }: AppStore) => {
  const showProxyEmployeeSelectDialogActions = bindActionCreators(
    actions.widgets.ProxyEmployeeSelectDialog.show,
    dispatch
  );

  return {
    openProxyEmployeeSelector: () => {
      const state = getState();
      const removeEmployeeId = ownerEmployeeId(state);
      const userSetting = state.common.userSetting;
      showProxyEmployeeSelectDialogActions(
        userSetting.companyId,
        userSetting.departmentId,
        removeEmployeeId
      );
    },
  };
};
