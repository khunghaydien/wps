import { SearchQueryV2 } from '../../../../repositories/organization/employee/EmployeeListRepository';

export type State = SearchQueryV2;

export const initialState: State = {
  // TODO Define data type properly
  // @ts-ignore
  searchCondition: {},
};

// Actions

type Save = {
  type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_QUERY/SAVE';
  payload: State;
};

type INITIALIZE = {
  type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_QUERY/INITIALIZE';
};

type Action = Save | INITIALIZE;

export const SAVE: Save['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_QUERY/SAVE';

export const INITIALIZE: INITIALIZE['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/SEARCH_QUERY/INITIALIZE';

export const actions = {
  initialize: () => ({
    type: INITIALIZE,
  }),
  save: (values: State) => ({
    type: SAVE,
    payload: values,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SAVE:
      return action.payload;

    case INITIALIZE:
      return initialState;

    default:
      return state;
  }
};
