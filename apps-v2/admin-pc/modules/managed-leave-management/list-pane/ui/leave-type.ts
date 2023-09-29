import { SELECT_TAB } from '../../../../../commons/actions/tab';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';
import {
  CLEAR as CLEAR_LEAVE_TYPES,
  FETCH_LEAVE_TYPES_SUCCESS,
} from '../entities/leave-types';

export const CHANGE_LEAVE_TYPE =
  'MODULES/MANAGED_LEAVE_MANAGEMENT/LIST_PANE/UI/LEAVE_TYPE/CHANGE_LEAVE_TYPE';

type ChangeLeaveTypeAction = {
  type: 'MODULES/MANAGED_LEAVE_MANAGEMENT/LIST_PANE/UI/LEAVE_TYPE/CHANGE_LEAVE_TYPE';
  payload: string;
};

export const changeLeaveType = (
  newLeaveTypeId: string
): ChangeLeaveTypeAction => ({
  type: CHANGE_LEAVE_TYPE,
  payload: newLeaveTypeId,
});

export type State = {
  readonly selectedLeaveTypeId: string;
};

export type Action = ChangeLeaveTypeAction;

export const initialState: State = {
  selectedLeaveTypeId: '',
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CHANGE_LEAVE_TYPE:
      return {
        ...state,
        selectedLeaveTypeId: (action as ChangeLeaveTypeAction).payload,
      };

    // @ts-ignore
    case FETCH_LEAVE_TYPES_SUCCESS:
    // @ts-ignore no-fallthrough
    case CLEAR_LEAVE_TYPES:
    // @ts-ignore no-fallthrough
    case SELECT_MENU_ITEM:
    // @ts-ignore no-fallthrough
    case CHANGE_COMPANY:
    // @ts-ignore no-fallthrough
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
};
