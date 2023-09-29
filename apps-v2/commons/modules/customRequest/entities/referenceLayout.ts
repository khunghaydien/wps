import { Reducer } from 'redux';

import {
  LayoutData,
  ReferenceLayoutConfig,
} from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_LAYOUT/SET_SUCCESS',
  CLEAR_SUCCESS:
    'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_LAYOUT/CLEAR_SUCCESS',
};

export const actions = {
  set: (sObjName: string, layout: Array<LayoutData>, fieldName: string) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { layout, sObjName, fieldName },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = {
  sObjName: '',
  layout: [],
  fieldName: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ReferenceLayoutConfig, any>;
