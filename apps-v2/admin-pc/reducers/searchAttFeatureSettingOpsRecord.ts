import { SEARCH_FEATURE_SETTING_OPS_RECORD } from '../actions/attFeatureSettingOpsRecord';

const initialState = [];

export default function searchAttFeatureSettingOpsRecordReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_FEATURE_SETTING_OPS_RECORD:
      return action.payload;
    default:
      return state;
  }
}
