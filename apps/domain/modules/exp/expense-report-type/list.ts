import { Reducer } from 'redux';

import { loadingEnd, loadingStart } from '../../../../commons/actions/app';
import { GET_USER_SETTING as UserSettingAction } from '@commons/actions/userSetting';
import { actions as advSearchReportTypeListActions } from '@commons/modules/exp/entities/reportTypeList';
import DateUtil from '@commons/utils/DateUtil';

import {
  ExpenseReportType,
  ExpenseReportTypeList,
  getReportTypeById,
  getReportTypeList,
  reportTypeArea,
} from '../../../models/exp/expense-report-type/list';
import { requestDateInitVal } from '@apps/domain/models/exp/Report';

import { AppDispatch } from '../AppThunk';
import { ACTIONS as EmpHistoryActions } from '../employeeHistory';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/LIST_SUCCESS',
  ADD_INVALID: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/ADD_INVALID',
};

const listSuccess = (body: ExpenseReportTypeList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const addInvalid = (item: ExpenseReportType) => ({
  type: ACTIONS.ADD_INVALID,
  payload: item,
});

export const actions = {
  list:
    (
      companyId: string | undefined,
      usedIn: string | undefined,
      active?: boolean,
      employeeId?: string,
      targetDate?: string,
      endDate?: string,
      showLoadingIndicator?: boolean
    ) =>
    (dispatch: AppDispatch): void | any => {
      if (showLoadingIndicator) {
        dispatch(loadingStart({ areas: reportTypeArea }));
      }
      return getReportTypeList(
        companyId,
        usedIn,
        active,
        employeeId,
        false,
        targetDate,
        endDate
      )
        .then(({ records }: { records: ExpenseReportTypeList }) => {
          dispatch(listSuccess(records));
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          if (showLoadingIndicator) {
            dispatch(loadingEnd(reportTypeArea));
          }
        });
    },
  fetchInvalidReportType:
    (id: string, companyId: string, usedIn: string) =>
    (dispatch: AppDispatch): Promise<any> => {
      return getReportTypeById(id, companyId, usedIn).then(
        (res: ExpenseReportType) => {
          dispatch(addInvalid(res));
        }
      );
    },
};

const initialState = { active: null, inactive: [] };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      const activeReportType = action.payload.filter((rt) => rt.active);
      const inactiveReportType = action.payload.filter((rt) => !rt.active);
      return { active: activeReportType, inactive: inactiveReportType };
    case ACTIONS.ADD_INVALID:
      const inactive = [...state.inactive, action.payload];
      return { ...state, inactive };
    default:
      return state;
  }
}) as Reducer<Record<string, any>, any>;

const empHisotryTriggerActions = [EmpHistoryActions.SET];
const userTriggerActions = [UserSettingAction];

const middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    const currentState = getState();
    /*
  subsequent action for employee history
  fetch report type list according to history period
  */
    if (empHisotryTriggerActions.includes(action.type)) {
      const curHistory = currentState.entities.exp.employeeHistory;
      const targetHistory = action.payload;
      const { empGroupId, validFrom, validTo } = targetHistory;
      const usedIn = currentState.entities.exp.usedIn;
      let { companyId, employeeId } = currentState.userSetting;
      companyId = action.payload.companyId || companyId;
      employeeId = action.payload.employeeId || employeeId;
      if (empGroupId !== curHistory.empGroupId) {
        dispatch(
          actions.list(
            companyId,
            usedIn,
            null,
            employeeId,
            validFrom,
            validTo,
            true
          )
        );
      }
    }
    /*
  subsequent action for user change - load user/switch applicant
  fetch report type list for advance search report type option
  */
    if (userTriggerActions.includes(action.type)) {
      const usedIn = currentState.entities.exp.usedIn;
      const { companyId, employeeId, empHistoryValidFrom } = action.payload;
      const { startDate, endDate } = requestDateInitVal();
      // if initial request start date is earlier than user's employee history from date, use the latter one
      const validStartDate = DateUtil.isBefore(startDate, empHistoryValidFrom)
        ? empHistoryValidFrom
        : startDate;
      dispatch(
        advSearchReportTypeListActions.list(
          companyId,
          validStartDate,
          endDate,
          employeeId,
          usedIn
        )
      );
    }
    return next(action);
  };

export const reportTypeListMiddlewares = [middleware];
