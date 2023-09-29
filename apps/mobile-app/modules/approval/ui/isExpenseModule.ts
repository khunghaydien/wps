import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/IS_EXPENSE_MODULE/SET',
};

// to set whether active product module is expense request
export const set = (isExpenseModule: boolean) => ({
  type: ACTIONS.SET,
  payload: isExpenseModule,
});

const initialState = false;

export default ((state: boolean = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
