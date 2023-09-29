import { Reducer } from 'redux';

import { SELECT_TAB } from '../../../../../commons/actions/tab';

import {
  generateDefaultSearchCondition,
  SearchCondition,
} from '../../../../models/common/EmployeePersonalInfo';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';

type State = { isSearchExecuted: boolean } & SearchCondition;

const KEY = 'MODULES/ADMIN_COMMON/EMPLOYEE_SELECTION/UI/SEARCH_QUERY';
const ACTIONS = {
  UPDATE_TARGET_DATE: `${KEY}/UPDATE_TARGET_DATE`,
  UPDATE_EMPLOYEE_CODE: `${KEY}/UPDATE_EMPLOYEE_CODE`,
  UPDATE_EMPLOYEE_NAME: `${KEY}/UPDATE_EMPLOYEE_NAME`,
  UPDATE_DEPARTMENT_NAME: `${KEY}/UPDATE_DEPARTMENT_NAME`,
  UPDATE_WORKING_TYPE_NAME: `${KEY}/UPDATE_WORKING_TYPE_NAME`,
  SET_SEARCH_EXECUTED: `${KEY}/SET_SEARCH_EXECUTED`,
  CLEAR: `${KEY}CLEAR`,
};

export const actions = {
  updateTargetDateQuery: (newQuery: string) => ({
    type: ACTIONS.UPDATE_TARGET_DATE,
    payload: newQuery,
  }),
  updateEmployeeCodeQuery: (newQuery: string) => ({
    type: ACTIONS.UPDATE_EMPLOYEE_CODE,
    payload: newQuery,
  }),

  updateEmployeeNameQuery: (newQuery: string) => ({
    type: ACTIONS.UPDATE_EMPLOYEE_NAME,
    payload: newQuery,
  }),

  updateDepartmentNameQuery: (newQuery: string) => ({
    type: ACTIONS.UPDATE_DEPARTMENT_NAME,
    payload: newQuery,
  }),

  updateWorkingTypeNameQuery: (newQuery: string) => ({
    type: ACTIONS.UPDATE_WORKING_TYPE_NAME,
    payload: newQuery,
  }),

  setSearchExecuted: () => ({
    type: ACTIONS.SET_SEARCH_EXECUTED,
  }),

  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  isSearchExecuted: false,
  ...generateDefaultSearchCondition(),
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_TARGET_DATE:
      return {
        ...state,
        targetDateQuery: action.payload,
      };
    case ACTIONS.UPDATE_EMPLOYEE_CODE:
      return {
        ...state,
        employeeCodeQuery: action.payload,
      };
    case ACTIONS.UPDATE_EMPLOYEE_NAME:
      return {
        ...state,
        employeeNameQuery: action.payload,
      };
    case ACTIONS.UPDATE_DEPARTMENT_NAME:
      return {
        ...state,
        departmentNameQuery: action.payload,
      };
    case ACTIONS.UPDATE_WORKING_TYPE_NAME:
      return {
        ...state,
        workingTypeNameQuery: action.payload,
      };

    case ACTIONS.SET_SEARCH_EXECUTED:
      return {
        ...state,
        isSearchExecuted: true,
      };

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
