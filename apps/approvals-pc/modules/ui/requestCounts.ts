import * as attRequestConstants from './att/request/constants';

import * as appActions from '../../../commons/actions/app';
import Api from '../../../commons/api';
import { constants as PROXY_CONSTANTS } from '../../../commons/modules/proxyEmployeeInfo';

import { ACTIONS as SWITCH_APPROVER_ACTIONS } from '../../../../widgets/dialogs/SwitchApporverDialog/modules/ui';
import { ACTIONS as APPROVE_ACTIONS } from '../../../domain/modules/approval/request/approve';
import { ACTIONS as REJECT_ACTIONS } from '../../../domain/modules/approval/request/reject';

import { constants as attMonthlyDetailConstants } from './attMonthly/detail';
import { constants as tabsConstants, tabType as TABS } from './tabs';
import { constants as timeTrackRequestConstants } from './timeTrack/request';

//
// constants
//
const FETCH_SUCCESS = 'MODULES/UI/REQUEST_COUNTS/FETCH_SUCCESS';

//
// actions
//
export const convertCount = (res, tab) => {
  const { ATT_DAILY, ATT_MONTHLY, TRACKING, EXPENSES, EXP_PRE_APPROVAL } = TABS;
  return {
    ...(tab === ATT_DAILY && { attDaily: res.attDailyRequestCount }),
    ...(tab === ATT_MONTHLY && { attMonthly: res.attRequestCount }),
    ...(tab === TRACKING && { timeRequest: res.timeRequestCount }),
    ...(tab === EXPENSES && { expenses: res.expReportRequestCount }),
    ...(tab === EXP_PRE_APPROVAL && {
      expPreApproval: res.expPreApprovalRequestCount,
    }),
  };
};

const update = (empId?, isDelegatedApprover?, tab?) => (dispatch) => {
  if (tab && tab !== TABS.UNAVAILABLE) {
    const req = {
      path: '/approval/request-count/get',
      param: { empId, isDelegatedApprover, approvalTypes: [tab] },
    };

    Api.invoke(req)
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: true }))
      )
      .then((res) => {
        dispatch({
          type: FETCH_SUCCESS,
          payload: convertCount(res, tab),
        });
      });
  }
};

const updateCountsAction = [
  timeTrackRequestConstants.APPROVE_SUCCESS,
  timeTrackRequestConstants.REJECT_SUCCESS,
  attRequestConstants.APPROVE_SUCCESS,
  attRequestConstants.REJECT_SUCCESS,
  attMonthlyDetailConstants.PROCESS_SUCCESS,
  tabsConstants.SELECT,
  APPROVE_ACTIONS.APPROVE,
  REJECT_ACTIONS.REJECT,
  SWITCH_APPROVER_ACTIONS.SELECT,
  PROXY_CONSTANTS.UNSET,
];

//
// middlewares
//
const updateMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (updateCountsAction.includes(action.type)) {
      let empId;
      let isDelegatedApprover = false;
      const currentState = getState();
      const { isProxyMode } = currentState.common.proxyEmployeeInfo;
      // Switch to proxy employee
      if (isProxyMode || action.type === SWITCH_APPROVER_ACTIONS.SELECT) {
        empId = currentState.common.proxyEmployeeInfo.id;
        isDelegatedApprover = true;
      }
      // Switch back to original user
      if (!isProxyMode || action.type === PROXY_CONSTANTS.UNSET) {
        empId = currentState.userSetting.employeeId;
        isDelegatedApprover = false;
      }

      const selectedTab = currentState.ui.tabs.selected;
      const { [selectedTab]: curTab, ...remain }: any = TABS;

      if (!currentState.ui.isApexView) {
        dispatch(update(empId, isDelegatedApprover, curTab));

        // Calling request count for tabs other than current tabs
        // Should remove this part if performance issues happen
        Object.values(remain).forEach((tab) =>
          dispatch(update(empId, isDelegatedApprover, tab))
        );
      }
    }

    return next(action);
  };

// まとめてpushするだけなので配列としてもつ
export const middlewares = [updateMiddleware];

export const actions = {
  update,
};

//
// Reducer
//
const initialState = {
  attDaily: null,
  attMonthly: null,
  timeRequest: null,
  expenses: null,
  expPreApproval: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
