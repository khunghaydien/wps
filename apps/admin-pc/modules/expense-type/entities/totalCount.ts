export const initialState = 0;

// Actions

type SetCount = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/TOTAL_COUNT/SET';
  payload: number;
};

type Action = SetCount;

export const SET: SetCount['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/ENTITIES/TOTAL_COUNT/SET';

export const actions = {
  set: (totalCount = 0) => ({
    type: SET,
    payload: totalCount,
  }),
};

// Reducer

export default (state: number = initialState, action: Action): number => {
  switch (action.type) {
    case SET:
      return action.payload;
    default:
      return state;
  }
};
