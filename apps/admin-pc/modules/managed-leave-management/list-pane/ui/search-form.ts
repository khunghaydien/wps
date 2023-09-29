import { SELECT_TAB } from '../../../../../commons/actions/tab';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';
import { CHANGE_LEAVE_TYPE } from './leave-type';

const UPDATE_EMPLOYEE_CODE_QUERY =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/UPDATE_EMPLOYEE_CODE_QUERY';
const UPDATE_EMPLOYEE_NAME_QUERY =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/UPDATE_EMPLOYEE_NAME_QUERY';
const UPDATE_DEPARTMENT_NAME_QUERY =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/UPDATE_DEPARTMENT_NAME_QUERY';
const UPDATE_WORKING_TYPE_NAME_QUERY =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/UPDATE_WORKING_TYPE_NAME_QUERY';
const UPDATE_TARGET_DATE_QUERY =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/UPDATE_UPDATE_TARGET_DATE_QUERY';
export const CLEAR = 'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/SEARCH_FORM/CLEAR';

/**
 * Update the query for employee's code
 *
 * @param {String} newQuery new query for employee's code
 * @returns {Object} redux action
 */
export const updateEmployeeCodeQuery = (newQuery) => ({
  type: UPDATE_EMPLOYEE_CODE_QUERY,
  payload: newQuery,
});

/**
 * Update the query for employee's name
 *
 * @param {String} newQuery new query for employee's name
 * @returns {Object} redux action
 */
export const updateEmployeeNameQuery = (newQuery) => ({
  type: UPDATE_EMPLOYEE_NAME_QUERY,
  payload: newQuery,
});

/**
 * Update the query for the department name of employee's
 *
 * @param {String} newQuery new query for the department name of employee's
 * @returns {Object} redux action
 */
export const updateDepartmentNameQuery = (newQuery) => ({
  type: UPDATE_DEPARTMENT_NAME_QUERY,
  payload: newQuery,
});

/**
 * Update the query for the name of working type
 *
 * @param {String} newQuery new query for the name of working type
 * @returns {Object} redux action
 */
export const updateWorkingTypeNameQuery = (newQuery) => ({
  type: UPDATE_WORKING_TYPE_NAME_QUERY,
  payload: newQuery,
});

/**
 * Update the query for the target date
 *
 * @param {String} newQuery new query for the target date
 * @returns {Object} redux action
 */
export const updateTargetDateQuery = (newQuery) => ({
  type: UPDATE_TARGET_DATE_QUERY,
  payload: newQuery,
});

/**
 * Clear the state.
 */
export const clear = () => ({
  type: CLEAR,
});

export const initialState = {
  employeeCodeQuery: '',
  employeeNameQuery: '',
  departmentNameQuery: '',
  workingTypeNameQuery: '',
  targetDateQuery: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EMPLOYEE_CODE_QUERY:
      return {
        ...state,
        employeeCodeQuery: action.payload,
      };
    case UPDATE_EMPLOYEE_NAME_QUERY:
      return {
        ...state,
        employeeNameQuery: action.payload,
      };
    case UPDATE_DEPARTMENT_NAME_QUERY:
      return {
        ...state,
        departmentNameQuery: action.payload,
      };
    case UPDATE_WORKING_TYPE_NAME_QUERY:
      return {
        ...state,
        workingTypeNameQuery: action.payload,
      };
    case UPDATE_TARGET_DATE_QUERY:
      return {
        ...state,
        targetDateQuery: action.payload,
      };

    case CLEAR:
    case CHANGE_LEAVE_TYPE:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
};
