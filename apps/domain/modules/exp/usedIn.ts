import { Reducer } from 'redux';

import { $Values } from 'utility-types';

import expModuleType from '@apps/commons/constants/expModuleType';

type State = $Values<typeof expModuleType>;
const ACTIONS = {
  SET: 'MODULES/UI/EXP/USED_IN/SET',
};

export const setUsedIn = (tabName: State) => ({
  type: ACTIONS.SET,
  payload: tabName,
});

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
