import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../commons/actions/tab';
import Api from '../../../../../commons/api';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';
import { SEARCH_EMPLOYEE_SUCCESS } from '../../list-pane/entities/employee-list';
import {
  DESELECT_EMPLOYEE,
  SELECT_EMPLOYEE,
} from '../../list-pane/ui/employee-list';
import { CHANGE_LEAVE_TYPE } from '../../list-pane/ui/leave-type';
import { fetch as fetchGrantHistoryList } from '../entities/grant-history-list';

type State = {
  daysGranted: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
};

export const UPDATE_DAYS_GRANTED =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/NEW_GRANT_FORM/UPDATE_DAYS_GRANTED';
export const UPDATE_VALID_DATE_FROM =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/NEW_GRANT_FORM/UPDATE_VALID_DATE_FROM';
export const UPDATE_VALID_DATE_TO =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/NEW_GRANT_FORM/UPDATE_VALID_DATE_TO';
export const UPDATE_COMMENT =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/NEW_GRANT_FORM/UPDATE_COMMENT';
export const EXECUTE_SUCCESS =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UI/NEW_GRANT_FORM/EXECUTE_SUCCESS';

/**
 * Update the number of days in the leave
 */
export const updateDaysGranted = (newDaysGranted: string) => ({
  type: UPDATE_DAYS_GRANTED,
  payload: newDaysGranted,
});

/**
 * Update the start date of granted period
 */
export const updateValidDateFrom = (newValidDateFrom: string) => ({
  type: UPDATE_VALID_DATE_FROM,
  payload: newValidDateFrom,
});

/**
 * Update the end date of granted period
 */
export const updateValidDateTo = (newValidDateTo: string) => ({
  type: UPDATE_VALID_DATE_TO,
  payload: newValidDateTo,
});

/**
 * Update grant comment
 */
export const updateComment = (newComment: string) => ({
  type: UPDATE_COMMENT,
  payload: newComment,
});

export const executeSuccess =
  (targetEmployeeId: string, targetLeaveTypeId: string, targetDate: string) =>
  (dispatch: Dispatch<any>) => {
    dispatch({
      type: EXECUTE_SUCCESS,
    });
    dispatch(
      fetchGrantHistoryList(targetEmployeeId, targetLeaveTypeId, targetDate)
    );
  };

/**
 * Execute grant managed leave(s)
 */
export const execute =
  (
    targetEmployeeId: string,
    targetLeaveTypeId: string,
    daysGranted: string,
    validDateFrom: string,
    validDateTo: string,
    targetDate: string,
    comment: string
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());

    return Api.invoke({
      path: '/att/managed-leave/grant/create',
      param: {
        empId: targetEmployeeId,
        leaveId: targetLeaveTypeId,
        daysGranted,
        validDateFrom,
        validDateTo,
        comment,
      },
    })
      .then(() =>
        dispatch(
          executeSuccess(targetEmployeeId, targetLeaveTypeId, targetDate)
        )
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

const initialState: State = {
  daysGranted: '1',
  validDateFrom: '',
  validDateTo: '',
  comment: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DAYS_GRANTED:
      return {
        ...state,
        daysGranted: action.payload,
      };
    case UPDATE_VALID_DATE_FROM:
      return {
        ...state,
        validDateFrom: action.payload,
      };
    case UPDATE_VALID_DATE_TO:
      return {
        ...state,
        validDateTo: action.payload,
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };

    case EXECUTE_SUCCESS:
    case SEARCH_EMPLOYEE_SUCCESS:
    case SELECT_EMPLOYEE:
    case DESELECT_EMPLOYEE:
    case CHANGE_LEAVE_TYPE:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
