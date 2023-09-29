import msg from '@commons/languages';

import {
  ApproverSetting,
  REQUEST_TYPE_LABELS,
} from '../models/approverSetting';

import { ACTION_TYPES } from '@admin-pc-v2/actions/approverSetting';

type ApproverSettingList = ApproverSetting[];

type Search = {
  type: typeof ACTION_TYPES['SEARCH_APPROVER_SETTING'];
  payload: ApproverSettingList;
};

type Update = { type: typeof ACTION_TYPES['UPDATE_APPROVER_SETTING'] };

type Action = Search | Update;

const initialState = [];

export default (state = initialState, action: Action): ApproverSettingList => {
  switch (action.type) {
    case ACTION_TYPES.SEARCH_APPROVER_SETTING:
      const { payload } = action as Search;
      return (
        payload.map((setting: ApproverSetting) => ({
          ...setting,
          requestTypeLabel: msg()[REQUEST_TYPE_LABELS[setting.requestType]],
        })) || []
      );
    case ACTION_TYPES.UPDATE_APPROVER_SETTING:
    default:
      return state;
  }
};
