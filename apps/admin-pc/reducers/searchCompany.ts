import { SEARCH_COMPANY } from '../actions/company';

const initialState = [];

export default function searchCompanyReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_COMPANY:
      // Temporary implementation for Planner Default View
      // TODO Remove this
      return action.payload.map((company) => ({
        ...company,
        plannerDefaultView: company.plannerDefaultView === 'Daily',
      }));
    default:
      return state;
  }
}
