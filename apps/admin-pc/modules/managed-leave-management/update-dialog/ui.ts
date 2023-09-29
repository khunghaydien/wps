import { Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import Api from '../../../../commons/api';

import { fetch as fetchGrantHistoryList } from '../detail-pane/entities/grant-history-list';

type State = {
  readonly isVisible: boolean;
  readonly targetGrantHistoryRecordId: string | null | undefined;
  readonly targetGrantHistoryRecordValidDateFrom: string | null | undefined;
  readonly targetGrantHistoryRecordValidDateTo: string | null | undefined;
  readonly targetGrantHistoryRecordDaysGranted: string | null | undefined;
  readonly newDaysGranted: string | null | undefined;
};

export const SHOW = 'MODULES/MANAGED_LEAVE_MANAGEMENT/UPDATE_DIALOG/UI/SHOW';
export const HIDE = 'MODULES/MANAGED_LEAVE_MANAGEMENT/UPDATE_DIALOG/UI/HIDE';

export const UPDATE_NEW_DAYS_GRANTED =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UPDATE_DIALOG/UI/UPDATE_NEW_DAYS_GRANTED';

export const EXECUTE_SUCCESS =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/UPDATE_DIALOG/UI/EXECUTE_SUCCESS';

export const show = (
  targetGrantHistoryRecordId: string,
  targetGrantHistoryRecordValidDateFrom: string,
  targetGrantHistoryRecordValidDateTo: string,
  targetGrantHistoryRecordDaysGranted: string
) => ({
  type: SHOW,
  payload: {
    targetGrantHistoryRecordId,
    targetGrantHistoryRecordValidDateFrom,
    targetGrantHistoryRecordValidDateTo,
    targetGrantHistoryRecordDaysGranted,
  },
});

export const hide = () => ({
  type: HIDE,
});

export const updateNewDaysGranted = (newDaysGranted: string) => ({
  type: UPDATE_NEW_DAYS_GRANTED,
  payload: newDaysGranted,
});

const executeSuccess =
  (targetEmployeeId: string, targetLeaveTypeId: string, targetDate: string) =>
  (dispatch: Dispatch<any>) => {
    dispatch(
      fetchGrantHistoryList(targetEmployeeId, targetLeaveTypeId, targetDate)
    );
    dispatch({
      type: EXECUTE_SUCCESS,
    });
  };

export const execute =
  (
    targetEmployeeId: string,
    targetLeaveTypeId: string,
    targetGrantHistoryRecordId: string,
    newDaysGranted: string,
    targetDate: string
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());

    return Api.invoke({
      path: '/att/managed-leave/grant/update',
      param: {
        grantId: targetGrantHistoryRecordId,
        daysGranted: newDaysGranted,
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

export const initialState: State = {
  isVisible: false,
  targetGrantHistoryRecordId: null,
  targetGrantHistoryRecordValidDateFrom: null,
  targetGrantHistoryRecordValidDateTo: null,
  targetGrantHistoryRecordDaysGranted: null,
  newDaysGranted: null,
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        isVisible: true,
        targetGrantHistoryRecordId: action.payload
          .targetGrantHistoryRecordId as string,
        targetGrantHistoryRecordValidDateFrom: action.payload
          .targetGrantHistoryRecordValidDateFrom as string,
        targetGrantHistoryRecordValidDateTo: action.payload
          .targetGrantHistoryRecordValidDateTo as string,
        targetGrantHistoryRecordDaysGranted: action.payload
          .targetGrantHistoryRecordDaysGranted as number,
        newDaysGranted: String(
          action.payload.targetGrantHistoryRecordDaysGranted as number
        ),
      };

    case UPDATE_NEW_DAYS_GRANTED:
      return {
        ...state,
        newDaysGranted: action.payload as string,
      };

    case HIDE:
    case EXECUTE_SUCCESS:
      return initialState;

    default:
      return state;
  }
};
