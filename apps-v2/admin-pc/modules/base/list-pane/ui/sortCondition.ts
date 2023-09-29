export type Order = 'ASC' | 'DESC';

export type State = {
  field: string;
  order: Order;
};

export const initialState: State = {
  field: '',
  order: 'ASC',
};

// Actions

type Set = {
  type: 'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/SORT_CONDITION/SET';
  payload: {
    field: string;
    order?: Order;
  };
};

type Action = Set;

export const SET: Set['type'] =
  'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/SORT_CONDITION/SET';

export const actions = {
  set: (field: string, order?: any): Set => ({
    type: SET,
    payload: {
      field,
      order,
    },
  }),
};

// Reducer
export const getOrder = (state: State, field: string) => {
  if (state.field === field) {
    if (state.order === 'ASC') {
      return 'DESC';
    } else {
      return 'ASC';
    }
  } else {
    return 'ASC';
  }
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET: {
      const { payload } = action;
      const { field } = payload;
      const order = payload.order || getOrder(state, field);
      return {
        order,
        field,
      };
    }

    default:
      return state;
  }
};
