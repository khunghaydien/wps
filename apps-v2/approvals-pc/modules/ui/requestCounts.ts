import * as attRequestConstants from './att/request/constants';

import * as appActions from '../../../commons/actions/app';
import { constants as PROXY_CONSTANTS } from '../../../commons/modules/proxyEmployeeInfo';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

import { ACTIONS as SWITCH_APPROVER_ACTIONS } from '../../../../widgets/dialogs/SwitchApporverDialog/modules/ui';
import { ACTIONS as APPROVE_ACTIONS } from '../../../domain/modules/approval/request/approve';
import { ACTIONS as REJECT_ACTIONS } from '../../../domain/modules/approval/request/reject';

import { ACTION_TYPE as ATT_FIX_DAILY_ACTIONS } from './attFixDaily/process';
import { ACTION_TYPE as ATT_LEGAL_AGREEMENT_ACTIONS } from './attLegalAgreement/detail';
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
  const {
    ATT_DAILY,
    ATT_FIX_DAILY,
    ATT_FIX_MONTHLY,
    ATT_LEGAL_AGREEMENT,
    TRACKING,
    EXPENSES,
    EXP_PRE_APPROVAL,
    CUSTOM_REQUEST,
  } = TABS;
  return {
    ...(tab === ATT_DAILY && { attDaily: res.attDailyRequestCount }),
    ...(tab === ATT_FIX_DAILY && { attFixDaily: res.attFixDailyRequestCount }),
    ...(tab === ATT_LEGAL_AGREEMENT && {
      attLegalAgreement: res.attLegalAgreementRequestCount,
    }),
    ...(tab === ATT_FIX_MONTHLY && {
      attFixMonthly: res.attFixMonthlyRequestCount,
    }),
    ...(tab === TRACKING && { timeRequest: res.timeRequestCount }),
    ...(tab === EXPENSES && { expenses: res.expReportRequestCount }),
    ...(tab === EXP_PRE_APPROVAL && {
      expPreApproval: res.expPreApprovalRequestCount,
    }),
    ...(tab === CUSTOM_REQUEST && { customRequest: res.customRequestCount }),
  };
};

const update =
  (empId?, isDelegated?, tab?) =>
  async (dispatch): Promise<void> => {
    if (tab && tab !== TABS.UNAVAILABLE) {
      try {
        const response = await RequestRepository.fetchCount({
          employeeId: empId,
          isDelegated,
          type: tab,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: convertCount(response, tab),
        });
      } catch (err) {
        dispatch(appActions.catchApiError(err, { isContinuable: true }));
      }
    }
  };

const updateCountsAction = [
  timeTrackRequestConstants.APPROVE_SUCCESS,
  timeTrackRequestConstants.REJECT_SUCCESS,
  attRequestConstants.APPROVE_SUCCESS,
  attRequestConstants.REJECT_SUCCESS,
  attMonthlyDetailConstants.PROCESS_SUCCESS,
  ATT_LEGAL_AGREEMENT_ACTIONS.PROCESS_SUCCESS,
  ATT_FIX_DAILY_ACTIONS.SUCCESS,
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

export type State = {
  attDaily: number | null;
  attFixDaily: number | null;
  attLegalAgreement: number | null;
  attFixMonthly: number | null;
  timeRequest: number | null;
  expenses: number | null;
  expPreApproval: number | null;
  customRequest: number | null;
};

//
// Reducer
//
const initialState: State = {
  attDaily: null,
  attFixDaily: null,
  attLegalAgreement: null,
  attFixMonthly: null,
  timeRequest: null,
  expenses: null,
  expPreApproval: null,
  customRequest: null,
};

export default (state: State = initialState, action): State => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
