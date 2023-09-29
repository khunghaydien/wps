import { ApproverGroup } from '@admin-pc-v2/models/approverGroup';

import { ACTION_TYPES } from '@admin-pc-v2/actions/approverGroup';

type ApproverGroupList = ApproverGroup[];

type Search = {
  type: typeof ACTION_TYPES['SEARCH_APPROVER_GROUP'];
  payload: ApproverGroupList;
};

type Create = {
  type: typeof ACTION_TYPES['CREATE_APPROVER_GROUP'];
};

type Update = {
  type: typeof ACTION_TYPES['UPDATE_APPROVER_GROUP'];
};

type Delete = {
  type: typeof ACTION_TYPES['DELETE_APPROVER_GROUP'];
};

type Action = Search | Create | Update | Delete;

const initialState = [];

export default (state = initialState, action: Action): ApproverGroupList => {
  switch (action.type) {
    case ACTION_TYPES.SEARCH_APPROVER_GROUP:
      const { payload } = action as Search;
      return payload
        .map((approverGroup: ApproverGroup) => ({
          ...approverGroup,
          departmentName: approverGroup.department.name || '',
        }))
        .sort((a, b) => (a.code > b.code ? 1 : b.code > a.code ? -1 : 0));
    case ACTION_TYPES.CREATE_APPROVER_GROUP:
    case ACTION_TYPES.UPDATE_APPROVER_GROUP:
    case ACTION_TYPES.DELETE_APPROVER_GROUP:
    default:
      return state;
  }
};
