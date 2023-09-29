import { Reducer } from 'redux';

import {
  LayoutConfig,
  LayoutItem,
} from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/LAYOUT_CONFIG/SET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CLEAR_SUCCESS',
};

export const actions = {
  set: (config: Array<LayoutItem>, sObjName: string) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { config, sObjName },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = { sObjName: '', config: [] };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<LayoutConfig, any>;
