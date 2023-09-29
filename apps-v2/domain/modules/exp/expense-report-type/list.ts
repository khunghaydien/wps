import { Reducer } from 'redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
import { requestDateInitVal, VIEW_MODE } from '@apps/domain/models/exp/Report';

import { modes } from '@apps/expenses-pc/modules/ui/expenses/mode';

import { AppDispatch } from '../AppThunk';
import { ACTIONS as EmpHistoryActions } from '../employeeHistory';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/LIST_SUCCESS',
  ADD_INVALID: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/ADD_INVALID',
  CLEAR: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/CLEAR',
};

const listSuccess = (body: ExpenseReportTypeList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const addInvalid = (item: ExpenseReportType) => ({
  type: ACTIONS.ADD_INVALID,
  payload: item,
});

const clearList = () => ({ type: ACTIONS.CLEAR });

export const actions = {
  clearList:
    () =>
    (dispatch: AppDispatch): void => {
      dispatch(clearList());
    },
  list:
    (
      companyId: string | undefined,
      usedIn: string | undefined,
      active?: boolean,
      employeeId?: string,
      targetDate?: string,
      endDate?: string,
      showLoadingIndicator?: boolean,
      empHistoryId?: string,
      reportTypeId?: string
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
        endDate,
        undefined,
        reportTypeId,
        empHistoryId
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
    (id: string, companyId: string, usedIn: string, empHistoryId?: string) =>
    (dispatch: AppDispatch): Promise<any> => {
      return getReportTypeById(id, companyId, usedIn, empHistoryId).then(
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
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Record<string, any>, any>;

const empHistoryTriggerActions = [EmpHistoryActions.SET];
const userTriggerActions = [UserSettingAction];
const listModes = [VIEW_MODE.REPORT_LIST, modes.INITIALIZE];
const detailModes = [modes.REPORT_EDIT, modes.REPORT_SELECT];

const middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    const currentState = getState();
    const subroleId = get(currentState, 'ui.expenses.subrole.selectedRole');
    const reportTypeList =
      get(currentState, 'entities.exp.expenseReportType.list.active') || [];
    const viewMode = get(currentState, 'ui.expenses.mode');
    const isList = listModes.includes(viewMode);
    const isDetail = detailModes.includes(viewMode);
    const delegateEmp = get(
      currentState,
      'ui.expenses.delegateApplicant.selectedEmployee'
    );
    const isProxyMode = !isEmpty(delegateEmp);
    /*
      subsequent action for employee history
      fetch report type list according to history period
      */
    if (
      empHistoryTriggerActions.includes(action.type) &&
      (isDetail || isProxyMode)
    ) {
      const curHistory = currentState.entities.exp.employeeHistory;
      const targetHistory = action.payload;
      const { empGroupId, validFrom, validTo } = targetHistory;
      const usedIn = currentState.entities.exp.usedIn;
      let { companyId, employeeId } = currentState.userSetting;
      companyId = action.payload.companyId || companyId;
      employeeId = action.payload.employeeId || employeeId;
      if (empGroupId !== curHistory.empGroupId || isEmpty(reportTypeList)) {
        dispatch(
          actions.list(
            companyId,
            usedIn,
            null,
            employeeId,
            validFrom,
            validTo,
            true,
            subroleId
          )
        );
      }
    }
    /*
  subsequent action for user change - load user/switch applicant
  fetch report type list for advance search report type option
  */
    if (userTriggerActions.includes(action.type) && isList) {
      const currentState = getState();
      const usedIn = currentState.entities.exp.usedIn;
      const { companyId, employeeId, empHistoryValidFrom } = action.payload;
      const { startDate, endDate } = requestDateInitVal();
      // if initial request start date is earlier than user's employee history from date, use the latter one
      const validStartDate = DateUtil.isBefore(startDate, empHistoryValidFrom)
        ? empHistoryValidFrom
        : startDate;
      const tabHistoryIds = get(currentState, 'ui.expenses.subrole.ids');

      dispatch(
        advSearchReportTypeListActions.list(
          companyId,
          validStartDate,
          endDate,
          employeeId,
          usedIn,
          isEmpty(tabHistoryIds) ? null : tabHistoryIds
        )
      );
    }
    return next(action);
  };

export const reportTypeListMiddlewares = [middleware];
