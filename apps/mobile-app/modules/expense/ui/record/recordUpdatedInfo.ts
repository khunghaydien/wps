import { Reducer } from 'redux';

import { RecordUpdateInfoList } from '../../../../../domain/models/exp/Record';

const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/REPORT/RECORD_UPDATED_INFO/SET',
  RESET: 'MODULES/EXPENSE/UI/REPORT/RECORD_UPDATED_INFO/RESET',
};

export const actions = {
  setUpdateInfo: (updateInfo: RecordUpdateInfoList) => ({
    type: ACTIONS.SET,
    payload: updateInfo,
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

//
// Reducer
//
const initialState: RecordUpdateInfoList = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return [...action.payload];
    case ACTIONS.RESET:
      return [];
    default:
      return state;
  }
}) as Reducer<RecordUpdateInfoList, any>;
