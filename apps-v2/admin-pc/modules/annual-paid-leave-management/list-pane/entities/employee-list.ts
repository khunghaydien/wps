import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../commons/actions/tab';
import Api from '../../../../../commons/api';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';

export type Employee = {
  id: string;
  code: string;
  name: string;
  photoUrl: string;
  deptName: string;
  workingTypeName: string;
};

export type State = {
  allIds: string[];
  byId: {
    [key: string]: Employee;
  };
  isOverLimit: boolean;
};

type SearchEmployeeSuccess = {
  type: 'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/EMPLOYEE_LIST/SEARCH_EMPLOYEE_SUCCESS';
  payload: State;
};

type Clear = {
  type: 'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/EMPLOYEE_LIST/CLEAR';
};

export const SEARCH_EMPLOYEE_SUCCESS: SearchEmployeeSuccess['type'] =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/EMPLOYEE_LIST/SEARCH_EMPLOYEE_SUCCESS';
export const CLEAR: Clear['type'] =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/EMPLOYEE_LIST/CLEAR';

const convertEmployees = (records: Employee[], limitNumber: number): State => {
  const $records = records.slice(0, limitNumber);
  return {
    allIds: $records.map((record) => record.id),
    byId: Object.assign(
      {},
      ...$records.map((record) => ({ [record.id]: record }))
    ),
    isOverLimit: records.length > limitNumber,
  };
};

export const searchEmployeeSuccess = (
  body: {
    records: Employee[];
  },
  limitNumber: number
): SearchEmployeeSuccess => ({
  type: SEARCH_EMPLOYEE_SUCCESS,
  payload: convertEmployees(body.records, limitNumber),
});

/**
 * Search employees which match to the specified queries
 *
 * @param {String} companyId the ID of company
 * @param {String} employeeCodeQuery search query for employee's code
 * @param {String} employeeNameQuery search query for employee's name
 * @param {String} departmentNameQuery search query for the department name of employee's
 * @param {String} workingTypeNameQuery search query for the working type
 * @returns {Promise} Promise object to handle API request
 */
export const searchEmployees =
  ({
    companyId,
    employeeCodeQuery,
    employeeNameQuery,
    departmentNameQuery,
    workingTypeNameQuery,
    targetDateQuery,
    limitNumber,
  }: {
    companyId: string;
    employeeCodeQuery: string;
    employeeNameQuery: string;
    departmentNameQuery: string;
    workingTypeNameQuery: string;
    targetDateQuery: string;
    limitNumber: number;
  }) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());

    return Api.invoke({
      path: '/att/annual-leave/employee/search',
      param: {
        companyId,
        empCode: employeeCodeQuery,
        empName: employeeNameQuery,
        deptName: departmentNameQuery,
        workingTypeName: workingTypeNameQuery,
        targetDate: targetDateQuery,
        limitNumber: limitNumber + 1,
      },
    })
      .then((res) => dispatch(searchEmployeeSuccess(res, limitNumber)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/**
 * Clear the state
 */
export const clear = (): Clear => ({
  type: CLEAR,
});

export const employeesSelector = createSelector(
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.listPane.entities.employeeList.allIds,
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.listPane.entities.employeeList.byId,
  (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectedEmployeeSelector = createSelector(
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.listPane.ui.employeeList.selectedEmployeeId,
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.listPane.entities.employeeList.byId,
  (selectedEmployeeId, byId) => byId[selectedEmployeeId] || null
);

export const initialState: State = {
  allIds: [],
  byId: {},
  isOverLimit: false,
};

export default (
  state: State = initialState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case SEARCH_EMPLOYEE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case CLEAR:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
};
