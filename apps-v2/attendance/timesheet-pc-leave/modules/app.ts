import { getUserSetting } from '../../../commons/actions/userSetting';
import DateUtil from '../../../commons/utils/DateUtil';
import UrlUtil from '../../../commons/utils/UrlUtil';

import { actions as leaveInfoActions } from './entities/leaveInfo';

const initialize = () => (dispatch) => {
  const params = UrlUtil.getUrlQuery();
  const targetDate = params ? params.targetDate : DateUtil.nowAsISO8601();
  const targetEmployeeId = params ? params.targetEmployeeId : null;

  return Promise.all([
    dispatch(getUserSetting()),
    dispatch(leaveInfoActions.fetch(targetDate, targetEmployeeId)),
  ]);
};

const openPrintDialog = () => () => {
  window.print();
};

// eslint-disable-next-line import/prefer-default-export
export const actions = {
  initialize,
  openPrintDialog,
};
