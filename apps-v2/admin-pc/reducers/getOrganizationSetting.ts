import { GET_ORGANIZATION_SETTING } from '../actions/organization';

const initialState = {};

export default function getOrganizationSettingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_ORGANIZATION_SETTING:
      return action.payload;
    default:
      return state;
  }
}
