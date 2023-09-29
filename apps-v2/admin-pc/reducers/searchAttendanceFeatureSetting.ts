import { SEARCH_ATTENDANCE_FEATURE_SETTING } from '../actions/attendanceFeatureSetting';

const initialState = [];

export default function searchFeatureSettingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_ATTENDANCE_FEATURE_SETTING:
      return action.payload;
    default:
      return state;
  }
}
