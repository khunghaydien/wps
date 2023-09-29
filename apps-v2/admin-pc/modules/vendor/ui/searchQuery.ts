import { SearchQuery } from '../../../../domain/models/exp/Vendor';

export type State = SearchQuery;

export const initialState: State = {
  companyId: '',
};

// Actions

type Save = {
  type: 'ADMIN-PC/MODULES/VENDOR/UI/SEARCH_QUERY/SAVE';
  payload: State;
};

type Action = Save;

export const SAVE: Save['type'] =
  'ADMIN-PC/MODULES/VENDOR/UI/SEARCH_QUERY/SAVE';

export const actions = {
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
    default:
      return state;
  }
};
