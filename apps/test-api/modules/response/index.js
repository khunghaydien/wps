// @flow
import { type Dispatch, type Reducer } from 'redux';

import Api from '../../../commons/api';

const ACTIONS = {
  GET_SUCCESS: 'MODULES/RESPONSE/GET_SUCCESS',
  CLEAR: 'MODULES/CLEAR',
};

const getSuccess = (body: any) => {
  return {
    type: ACTIONS.GET_SUCCESS,
    payload: body,
  };
};

export const actions = {
  get:
    (request: ?any) =>
    (dispatch: Dispatch<any>): void | any => {
      return Api.invoke(request).then((res: any) => dispatch(getSuccess(res)));
    },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

export default ((state = {}, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR:
      return {};
    default:
      return state;
  }
}: Reducer<any, any>);
