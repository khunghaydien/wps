import { Reducer } from 'redux';

import { RecordClone } from '../../../../../../commons/components/exp/Form/Dialog/RecordClone/CloneDateSelection';

export const ACTIONS = {
  SET_RECORD: 'MODULES/EXPENSES/DIALOG/RECORD_CLONE/SET_RECORD',
  SET_DATE: 'MODULES/EXPENSES/DIALOG/RECORD_CLONE/SET_DATE',
  SET_RECORD_IDS: 'MODULES/EXPENSES/DIALOG/RECORD_CLONE/SET_RECORD_IDS',
};

export const actions = {
  setDate: (date: Date[]) => ({
    type: ACTIONS.SET_DATE,
    payload: date,
  }),
  setRecord: (recordIds: Array<string>, latestDay: string) => ({
    type: ACTIONS.SET_RECORD,
    payload: { recordIds, latestDay },
  }),
  setRecordIds: (recordIds: Array<string>) => ({
    type: ACTIONS.SET_RECORD_IDS,
    payload: recordIds,
  }),
};

//
// Reducer
//
const initialState: RecordClone = {
  dates: [],
  records: [],
  defaultDate: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_DATE:
      return { ...state, dates: [...action.payload] };
    case ACTIONS.SET_RECORD:
      const { recordIds, latestDay } = action.payload;
      return { ...initialState, records: recordIds, defaultDate: latestDay };
    case ACTIONS.SET_RECORD_IDS:
      return { ...initialState, records: action.payload };
    default:
      return state;
  }
}) as Reducer<any, any>;
