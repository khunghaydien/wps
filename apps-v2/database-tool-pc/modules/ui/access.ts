import { Reducer } from 'redux';

const SET_BLOCK = 'MODULES/UI/DB_TOOL/ACCESS/SET_BLOCK';

export const setBlock = () => ({
  type: SET_BLOCK,
});

const initialState = true;

export default ((state = initialState, action) => {
  switch (action.type) {
    case SET_BLOCK:
      return false;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
