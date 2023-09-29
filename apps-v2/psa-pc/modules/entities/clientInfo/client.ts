import {
  ClientResponse,
  clientSearchQuery,
  getClientList,
} from '@apps/domain/models/psa/Client';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

export const ACTIONS = {
  INIT_SUCCESS_LIST: 'MODULES/ENTITIES/CLIENT_INFO/INIT_SUCCESS_LIST',
  GET_CLIENT_SUCCESS: 'MODULES/ENTITIES/CLIENT_INFO/CLIENT/SUCCESS',
};

const getSuccessList = (body: ClientResponse) => ({
  type: ACTIONS.GET_CLIENT_SUCCESS,
  payload: body.records,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS_LIST,
  payload: [],
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<any> =>
      dispatch(initialize()),

  getClientList:
    (param: clientSearchQuery) =>
    (dispatch: AppDispatch): void | any =>
      getClientList(param)
        .then((res: ClientResponse) => {
          dispatch(getSuccessList(res));
        })
        .catch((err) => {
          throw err;
        }),
};

type State = {
  clientList: Array<any>;
};

const initialState = {
  clientList: [],
};

const clientReducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_CLIENT_SUCCESS:
      return { ...state, clientList: action.payload };
    default:
      return state;
  }
};

export default clientReducer;
