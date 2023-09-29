import { Approver } from '@admin-pc-v2/models/approverGroup';

import { ACTION_TYPES } from '@admin-pc-v2/actions/approverGroup/member';

type ApproverList = Approver[];

type List = {
  type: typeof ACTION_TYPES['LIST_MEMBER'];
  payload: ApproverList;
};

type Clear = {
  type: typeof ACTION_TYPES['CLEAR_MEMBER'];
};

export const actions = {
  list: (memberList: ApproverList): List => ({
    type: ACTION_TYPES.LIST_MEMBER,
    payload: memberList,
  }),
  clear: (): Clear => ({
    type: ACTION_TYPES.CLEAR_MEMBER,
  }),
};

const initialState = [];

export default (state = initialState, action: List | Clear): ApproverList => {
  switch (action.type) {
    case ACTION_TYPES.LIST_MEMBER:
      return action.payload;
    case ACTION_TYPES.CLEAR_MEMBER:
      return initialState;
    default:
      return state;
  }
};
