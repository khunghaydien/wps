import { GET_PSA_SETTING } from '../actions/psaSetting';

const initialState = [];

export default function searchPsaSettingReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PSA_SETTING:
      return action.payload.setting;
    default:
      return state;
  }
}
