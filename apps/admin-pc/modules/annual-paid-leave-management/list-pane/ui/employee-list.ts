import { Dispatch, Reducer } from 'redux';

import { SELECT_TAB } from '../../../../../commons/actions/tab';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';
import { fetch as fetchGrantHistoryList } from '../../detail-pane/entities/grant-history-list';
import { CLEAR, SEARCH_EMPLOYEE_SUCCESS } from '../entities/employee-list';

type State = {
  readonly isSearchExecuted: boolean;
  readonly selectedEmployeeId: string | null | undefined;
  readonly targetDate: string | null | undefined;
};

export const SELECT_EMPLOYEE =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/UI/EMPLOYEE_LIST/SELECT_EMPLOYEE';
export const DESELECT_EMPLOYEE =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/UI/EMPLOYEE_LIST/DESELECT_EMPLOYEE';

export const selectEmployee =
  (targetEmployeeId: string, targetDate: string) =>
  (dispatch: Dispatch<any>) => {
    dispatch(fetchGrantHistoryList(targetEmployeeId, targetDate));
    dispatch({
      type: SELECT_EMPLOYEE,
      payload: { selectedEmployeeId: targetEmployeeId, targetDate },
    });
  };

export const deselectEmployee = () => ({
  type: DESELECT_EMPLOYEE,
});

export const initialState: State = {
  isSearchExecuted: false,
  selectedEmployeeId: null,
  targetDate: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case SELECT_EMPLOYEE:
      return {
        ...state,
        selectedEmployeeId: action.payload.selectedEmployeeId as string,
        targetDate: action.payload.targetDate as string,
      };
    case DESELECT_EMPLOYEE:
      return {
        ...state,
        selectedEmployeeId: null,
      };

    case SEARCH_EMPLOYEE_SUCCESS:
      return {
        ...state,
        isSearchExecuted: true,
        selectedEmployeeId: null,
      };

    case CLEAR:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
