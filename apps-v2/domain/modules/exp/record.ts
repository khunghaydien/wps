import { Reducer } from 'redux';

import { catchApiError } from '../../../commons/actions/app';

import { getRecordList, Record } from '../../models/exp/Record';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/EXP/RECORD/LIST_SUCCESS',
  CLEAR: 'MODULES/EXP/RECORD/CLEAR',
};

type RecordList = Array<Record>;

const listSuccess = (body: RecordList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: body,
  };
};

const clearList = () => {
  return {
    type: ACTIONS.CLEAR,
  };
};

export const actions = {
  list:
    (
      empId: string,
      expTypeIdList?: Array<string>,
      startDate?: string,
      endDate?: string
    ) =>
    (dispatch: AppDispatch): Promise<Array<Record> | void> => {
      return getRecordList(empId, expTypeIdList, startDate, endDate)
        .then(({ records }: { records: Array<Record> }) => {
          dispatch(listSuccess(records));
          return records;
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        });
    },
  clear: () => (dispatch: AppDispatch) => {
    dispatch(clearList());
  },
};

const initialState = [];

type State = RecordList;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
