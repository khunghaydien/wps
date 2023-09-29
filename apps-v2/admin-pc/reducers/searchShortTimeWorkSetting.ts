import { SEARCH_SHORT_TIME_WORK_SETTING } from '../actions/shortTimeWorkSetting';

const initialState = [];

export default function searchShortTimeWorkSettingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_SHORT_TIME_WORK_SETTING:
      return action.payload;
    default:
      return state;
  }
}
