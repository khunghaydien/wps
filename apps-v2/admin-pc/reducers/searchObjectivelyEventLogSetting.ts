import { SEARCH_OBJECTIVELY_EVENT_LOG_SETTING } from '../actions/objectivelyEventLogSetting';

const initialState = [];

export default function searchObjectivelyEventLogSettingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_OBJECTIVELY_EVENT_LOG_SETTING:
      return action.payload;
    default:
      return state;
  }
}
