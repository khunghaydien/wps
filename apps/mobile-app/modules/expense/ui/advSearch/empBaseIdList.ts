import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/ADV_SEARCH/EMP_ID_LIST/SET',
};

type EmpIdList = Array<string>;

type SetAction = {
  type: string;
  payload: EmpIdList;
};

export const actions = {
  set: (employeeBaseIdList: EmpIdList): SetAction => ({
    type: ACTIONS.SET,
    payload: employeeBaseIdList,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<EmpIdList, any>;
