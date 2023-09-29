import { Reducer } from 'redux';

import {
  ReferenceRecords,
  ReferenceRecordsData,
} from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_RECORDS/SET_SUCCESS',
  CLEAR_SUCCESS:
    'MODULES/CUSTOM_REQUEST/ENTITIES/REFERENCE_RECORDS/CLEAR_SUCCESS',
};

export const actions = {
  set: (sObjName: string, records: ReferenceRecords) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { sObjName, records },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = { sObjName: '', records: [] };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ReferenceRecordsData, any>;
