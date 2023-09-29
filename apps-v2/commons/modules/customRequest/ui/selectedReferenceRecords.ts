import { Reducer } from 'redux';

import { ReferenceRecords } from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/CUSTOM_REQUEST/UI/SELECTED_REFERENCE_RECORDS/SET',
};

export const actions = {
  set: (sObjName: string, record: Record<string, string>) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { sObjName, record },
  }),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      const { sObjName, record } = action.payload;
      const records = state[sObjName] || [];
      const updated = {
        ...state,
        [sObjName]: [...records, record],
      };
      return updated;
    default:
      return state;
  }
}) as Reducer<Record<string, ReferenceRecords>, any>;
