import { Reducer } from 'redux';

import {
  getTransitCards,
  IcCards,
} from '@apps/domain/models/exp/TransportICCard';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/IC_CARD/GET',
};

const getSuccess = (body: IcCards) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (salesId, customerId, companyId, employeeCode) =>
    (dispatch: AppDispatch): Promise<IcCards> => {
      return getTransitCards(salesId, customerId, companyId, employeeCode)
        .then((res: IcCards) => {
          dispatch(getSuccess(res));
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<IcCards, any>;
