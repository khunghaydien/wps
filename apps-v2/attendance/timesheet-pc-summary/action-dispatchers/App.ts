import { Dispatch } from 'redux';

import { getUserSetting } from '../../../commons/actions/userSetting';
import DateUtil from '../../../commons/utils/DateUtil';
import UrlUtil from '../../../commons/utils/UrlUtil';

import { actions as summaryActions } from '../modules/entities/summary';

export const openPrintDialog = () => {
  window.print();
};

export const initialize = () => (dispatch: Dispatch<any>) => {
  const params = UrlUtil.getUrlQuery();
  const targetDate = (params && params.targetDate) || DateUtil.nowAsISO8601();
  const targetEmployeeId = (params && params.targetEmployeeId) || null;

  return Promise.all([
    dispatch(getUserSetting()),
    dispatch(summaryActions.fetch(targetDate, targetEmployeeId)),
  ]);
};
