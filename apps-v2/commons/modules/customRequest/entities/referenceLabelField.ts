import { Reducer } from 'redux';

import { ReferenceLabelField } from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS:
    'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_LABEL_FIELD/SET_SUCCESS',
  CLEAR_SUCCESS:
    'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_LABEL_FIELD/CLEAR_SUCCESS',
};

export const actions = {
  set: (sObjName: string, labelField: string) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { [sObjName]: labelField },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return { ...state, ...action.payload };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ReferenceLabelField, any>;
