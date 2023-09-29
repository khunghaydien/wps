import { Reducer } from 'redux';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import expModuleType from '@apps/commons/constants/expModuleType';

import { catchApiError } from '@apps/commons/actions/app';
import { GET_USER_SETTING } from '@apps/commons/actions/userSetting';
import DateUtil from '@apps/commons/utils/DateUtil';

import {
  EmpHistoryList,
  EmployeeHistoryList,
  getEmployeeHistoryList,
} from '@apps/domain/models/common/Employee';
import { status as reportStatus } from '@apps/domain/models/exp/Report';

import { AppDispatch } from './AppThunk';
import { actions as empHistoryActions } from './employeeHistory';
import { ACTIONS as REQUEST_ACTIONS } from './pre-request';
import { SET_RECORD_DATE } from './recordDate';
import { ACTIONS as REPORT_ACTIONS } from './report';

export const ACTIONS = {
  SET: 'MODULES/EXP/EMPLOYEE_HISTORY_LIST/SET',
  CLEAR: 'MODULES/EXP/EMPLOYEE_HISTORY_LIST/CLEAR',
};

const actions = {
  set: (item: EmpHistoryList) => ({
    type: ACTIONS.SET,
    payload: item,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const getEmpHistoryList =
  (empId: string) =>
  (dispatch: AppDispatch): Promise<EmpHistoryList> => {
    return getEmployeeHistoryList(empId)
      .then((res: EmployeeHistoryList) => {
        const convertHistory = ({
          validDateFrom,
          validDateTo,
          expEmployeeGroupId,
        }) => ({
          validFrom: validDateFrom,
          validTo: DateUtil.addDays(validDateTo, -1),
          empGroupId: expEmployeeGroupId,
        });
        const historyList = res.map(convertHistory);
        dispatch(actions.set(historyList));
        return historyList;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      });
  };

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}) as Reducer<EmpHistoryList, any>;

// actions which changes record date or trigged employee history change
const dateTriggerActions = [
  SET_RECORD_DATE,
  REPORT_ACTIONS.GET_SUCCESS,
  REQUEST_ACTIONS.GET_SUCCESS,
];

const userTriggerActions = [GET_USER_SETTING];

const crossHistoryCheck = (currentState, action) => {
  let targetDate;
  let isHistoryCheckNeeded;
  switch (action.type) {
    case SET_RECORD_DATE:
      targetDate = action.payload;
      isHistoryCheckNeeded = true;
      break;
    case REPORT_ACTIONS.GET_SUCCESS:
    case REQUEST_ACTIONS.GET_SUCCESS:
      const moduleType = currentState.entities.exp.usedIn;
      const date =
        moduleType === expModuleType.REPORT
          ? 'accountingDate'
          : 'scheduledDate';
      targetDate = action.payload[date];
      // check reports whose report type respond to targeted date only
      isHistoryCheckNeeded = [
        reportStatus.NOT_REQUESTED,
        reportStatus.REJECTED,
        reportStatus.RECALLED,
        reportStatus.CANCELED,
      ].includes(action.payload.status);
      break;
    default:
      return;
  }
  const { validFrom, validTo } = currentState.entities.exp.employeeHistory;
  const isCrossHistory =
    isHistoryCheckNeeded && !DateUtil.inRange(targetDate, validFrom, validTo);
  return { targetDate, isCrossHistory };
};

const middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    /* 
  subsequent action for change date
  update employee history group if targeted date is out side current employee history period
  */
    if (dateTriggerActions.includes(action.type)) {
      const currentState = getState();
      let empHistoryGroupList = currentState.entities.exp.empHistoryList;
      const { targetDate, isCrossHistory } = crossHistoryCheck(
        currentState,
        action
      );
      if (isCrossHistory) {
        if (isEmpty(empHistoryGroupList)) {
          empHistoryGroupList = await dispatch(
            getEmpHistoryList(currentState.userSetting.employeeId)
          );
        }
        const targetHistory = find(
          empHistoryGroupList,
          ({ validFrom, validTo }) =>
            DateUtil.inRange(targetDate, validFrom, validTo)
        );
        dispatch(empHistoryActions.set(targetHistory));
      }
    }
    /* 
  subsequent action for change employee
  reset employee history list 
  */
    if (userTriggerActions.includes(action.type)) {
      dispatch(actions.clear());
      dispatch(
        empHistoryActions.set({
          validFrom: action.payload.empHistoryValidFrom,
          validTo: DateUtil.addDays(action.payload.empHistoryValidTo, -1),
          empGroupId: action.payload.empGroupId,
          companyId: action.payload.companyId,
          employeeId: action.payload.employeeId,
        })
      );
    }
    return next(action);
  };

export const empHistoryMiddlewares = [middleware];
