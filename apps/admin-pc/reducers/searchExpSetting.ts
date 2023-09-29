import { SEARCH_EXP_SETTING } from '../actions/expSetting';

const initialState = [];

export default function searchExpSetting(state = initialState, action) {
  switch (action.type) {
    case SEARCH_EXP_SETTING:
      return action.payload.map((expSetting) => ({
        ...expSetting,
      }));
    default:
      return state;
  }
}
