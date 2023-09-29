import { Reducer } from 'redux';

import msg from '@apps/commons/languages';

import STATUS from '@apps/domain/models/approval/request/Status';
import { mobileInitialSearchCondition } from '@apps/domain/models/exp/request/Report';

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/STATUS_LIST/SET',
  CLEAR: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/STATUS_LIST/CLEAR',
};

export const statusOption = () => [
  { label: msg().Com_Status_Approved, value: STATUS.Approved },
  { label: msg().Com_Status_Pending, value: STATUS.Pending },
  { label: msg().Com_Status_Rejected, value: STATUS.Rejected },
];

type StatusList = Array<string>;

type SetAction = {
  type: string;
  payload: StatusList;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (status: StatusList): SetAction => ({
    type: ACTIONS.SET,
    payload: status,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialStatuses = mobileInitialSearchCondition.statusList;

export default ((state = initialStatuses, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialStatuses;
    default:
      return state;
  }
}) as Reducer<StatusList, any>;
