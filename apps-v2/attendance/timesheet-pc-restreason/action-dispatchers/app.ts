import { getUserSetting } from '../../../commons/actions/userSetting';
import DateUtil from '../../../commons/utils/DateUtil';
import UrlUtil from '../../../commons/utils/UrlUtil';

import { actions as restReasonActions } from '../modules/entities/dailyrest';

const initialize = () => (dispatch) => {
  const params = UrlUtil.getUrlQuery();
  const startDate = params ? params.startDate : DateUtil.nowAsISO8601();
  const endDate = params ? params.endDate : DateUtil.nowAsISO8601();
  const targetEmployeeId = params ? params.targetEmployeeId : null;

  return Promise.all([
    dispatch(getUserSetting()),
    dispatch(restReasonActions.fetch(startDate, endDate, targetEmployeeId)),
    dispatch(restReasonActions.fetchHeader(startDate, targetEmployeeId)),
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
