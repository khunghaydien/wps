import { SEARCH_ORGANIZATION_HIERARCHY } from '@apps/admin-pc/actions/organizationHierarchy';

const initialState = [];

export default function searchOrganizationHierarchyReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_ORGANIZATION_HIERARCHY:
      return action.payload;
    default:
      return state;
  }
}
