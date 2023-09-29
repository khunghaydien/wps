import {
  getOpportunityList,
  initialOpportunityList,
  OpportunityList,
  OpportunityResponse,
  OpportunitySearchQuery,
} from '@apps/domain/models/psa/Opportunity';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS_LIST: 'MODULES/ENTITIES/OPPORTUNITY/GET_SUCCESS_LIST',
  INIT_SUCCESS_LIST: 'MODULES/ENTITIES/OPPORTUNITY/INIT_SUCCESS_LIST',
  CLEAR_SUCCESS_LIST: 'MODULES/ENTITIES/OPPORTUNITY/CLEAR_SUCCESS_LIST',
};

const getSuccessList = (body: OpportunityResponse) => ({
  type: ACTIONS.GET_SUCCESS_LIST,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS_LIST,
  payload: [],
});

const clear: any = () => ({
  type: ACTIONS.CLEAR_SUCCESS_LIST,
  payload: [],
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<OpportunityList> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<OpportunityList> =>
      dispatch(clear()),

  getOpportunityList:
    (param: OpportunitySearchQuery) =>
    (dispatch: AppDispatch): void | any =>
      getOpportunityList(param)
        .then((res: OpportunityResponse) => {
          dispatch(getSuccessList(res));
        })
        .catch((err) => {
          throw err;
        }),
};

const initialState = {
  opportunities: initialOpportunityList,
  exceedLimit: false,
};

type State = {
  opportunities: OpportunityList;
  exceedLimit: boolean;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS_LIST:
    case ACTIONS.INIT_SUCCESS_LIST:
      return {
        ...state,
        opportunities: action.payload.records,
        exceedLimit: action.payload.exceedLimit,
      };
    case ACTIONS.CLEAR_SUCCESS_LIST:
      return initialState;
    default:
      return state;
  }
};
