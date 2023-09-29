import { Reducer } from 'redux';

import { sObjList } from '../../models/ObjectList';

type State = sObjList;

const ACTIONS = {
  SET_LIST: 'MODULES/ENTITIES/DB_TOOL/OBJECT_LIST/SET_LIST',
};

export const setObjList = (objectList: sObjList) => ({
  type: ACTIONS.SET_LIST,
  payload: objectList,
});

const initialState: State = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LIST:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
