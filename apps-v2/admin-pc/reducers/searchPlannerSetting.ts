import { GET_PLANNER_SETTING } from '../actions/plannerSetting';

const initialState = {};

export default function searchPlannerSettingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_PLANNER_SETTING:
      return action.payload;
    default:
      return state;
  }
}
