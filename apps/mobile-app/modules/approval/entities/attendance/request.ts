import { Dispatch, Reducer } from 'redux';

import { AttDailyDetailBaseFromApi } from '../../../../../domain/models/approval/AttDailyDetail/Base';
import { None } from '../../../../../domain/models/approval/AttDailyDetail/None';
import { getAttRequest } from '../../../../../domain/models/attendance/AttDailyRequest';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/APPROVAL/ATT/GET_SUCCESS',
};

const getSuccess = (attRequest: AttDailyDetailBaseFromApi<None>) => {
  return {
    type: ACTIONS.GET_SUCCESS,
    payload: attRequest,
  };
};

export const actions = {
  get:
    (requestId: string) =>
    (dispatch: Dispatch<any>): Promise<AttDailyDetailBaseFromApi<None>> => {
      // @ts-ignore
      return getAttRequest(requestId).then(
        (res: AttDailyDetailBaseFromApi<None>) => dispatch(getSuccess(res))
      );
    },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<AttDailyDetailBaseFromApi<None> | null | undefined, any>;
