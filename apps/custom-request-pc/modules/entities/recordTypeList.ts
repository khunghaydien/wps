import { Reducer } from 'redux';

import { getRecordTypeList } from '@custom-request-pc/models';

import { AppDispatch } from '../AppThunk';
import { RecordTypeListEntity } from '@custom-request-pc/types';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/RECORD_TYPE_LIST/GET_SUCCESS',
};

const getSuccess = (payload: RecordTypeListEntity) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: payload,
});

export const actions = {
  get: () => (dispatch: AppDispatch) => {
    return getRecordTypeList()
      .then((res) => {
        const { records, objectName } = res;
        dispatch(getSuccess({ records, objectName }));
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
};

const initialState = {
  records: [],
  objectName: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RecordTypeListEntity, any>;
