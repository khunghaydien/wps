import { createSelector } from 'reselect';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../commons/actions/tab';
import Api from '../../../../../commons/api';

import { LeaveType } from '../../../../models/managed-leave-management/types';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';

export type ResponseBody = {
  records: LeaveType[];
};

export type State = {
  allIds: string[];
  byId: {
    [key: string]: LeaveType;
  };
};

export const FETCH_LEAVE_TYPES_SUCCESS =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/LIST_PANE/UI/FETCH_LEAVE_TYPES_SUCCESS';
export const CLEAR = 'MODULES/MANAGED_LEAVE_MANAGEMENT/LIST_PANE/UI/CLEAR';

const convertLeaveTypes = (leaveTypes: LeaveType[]) => ({
  allIds: leaveTypes.map((leaveType: LeaveType) => leaveType.id),
  byId: Object.assign(
    {},
    ...leaveTypes.map((leaveType: LeaveType) => ({
      [leaveType.id]: leaveType,
    }))
  ),
});

const fetchLeaveTypesSuccess = (body: ResponseBody) => ({
  type: FETCH_LEAVE_TYPES_SUCCESS,
  payload: convertLeaveTypes(body.records),
});

export const fetchLeaveTypes =
  (targetCompanyId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());

    return Api.invoke({
      path: '/att/managed-leave/list',
      param: {
        companyId: targetCompanyId,
      },
    })
      .then((body: ResponseBody) => dispatch(fetchLeaveTypesSuccess(body)))
      .catch((err: Error) =>
        dispatch(catchApiError(err, { isContinuable: true }))
      )
      .then(() => dispatch(loadingEnd()));
  };

export const clear = () => ({
  type: CLEAR,
});

export const leaveTypesSelector = createSelector(
  // @ts-ignore
  (state) => state.managedLeaveManagement.listPane.entities.leaveTypes.allIds,
  // @ts-ignore
  (state) => state.managedLeaveManagement.listPane.entities.leaveTypes.byId,
  (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectedLeaveTypeSelector = createSelector(
  (state) =>
    // @ts-ignore
    state.managedLeaveManagement.listPane.ui.leaveType.selectedLeaveTypeId,
  // @ts-ignore
  (state) => state.managedLeaveManagement.listPane.entities.leaveTypes.byId,
  (selectedLeaveTypeId, byId) => byId[selectedLeaveTypeId]
);

export const initialState: State = {
  allIds: [],
  byId: {},
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case FETCH_LEAVE_TYPES_SUCCESS:
      return {
        ...state,
        ...(action.payload as {
          allIds: [string];
          byId: {
            [key: string]: LeaveType;
          };
        }),
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
