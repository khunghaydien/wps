import { Reducer } from 'redux';

import { createSelector } from 'reselect';

import { SELECT_TAB } from '../../../../../commons/actions/tab';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';

type State = { selectedEmployeeId: string | null | undefined };

const KEY = 'MODULES/ADMIN_COMMON/EMPLOYEE_SELECTION/UI/SELECTION';
const ACTIONS = {
  SET_SELECTED_EMPLOYEE_ID: `${KEY}/SET_SELECTED_EMPLOYEE_ID`,
  CLEAR: `${KEY}/UNSET_SELECTED_EMPLOYEE_ID`,
};

export const actions = {
  setSelectedEmployeeId: (selectedEmployeeId: string) => ({
    type: ACTIONS.SET_SELECTED_EMPLOYEE_ID,
    payload: selectedEmployeeId,
  }),

  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const getEmployeeList = (state) =>
  state.adminCommon.employeeSelection.entities.employeeList.list;
const getSelectedEmployeeId = (state) =>
  state.adminCommon.employeeSelection.ui.selection.selectedEmployeeId;

export const selectors = {
  selectSelectedEmployee: createSelector(
    getEmployeeList,
    getSelectedEmployeeId,
    (employeeList, selectedId) =>
      employeeList.filter((emp) => emp.id === selectedId)[0]
  ),
};

const initialState: State = {
  selectedEmployeeId: null,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_EMPLOYEE_ID:
      return {
        ...state,
        selectedEmployeeId: action.payload,
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
