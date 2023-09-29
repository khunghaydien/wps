import { Reducer } from 'redux';

import {
  CustomRequestList,
  SearchCondition,
  searchCustomRequestList,
} from '../../../../domain/models/exp/CustomRequest';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CUSTOM_REQUEST/SEARCH_SUCESS',
};

const searchSuccess = (body: CustomRequestList) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

type Action = {
  payload: CustomRequestList;
  type: string;
};

export const actions = {
  search:
    (searchCondition: SearchCondition) =>
    async (dispatch: AppDispatch): Promise<Action> => {
      return searchCustomRequestList(searchCondition)
        .then((res) => dispatch(searchSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CustomRequestList, any>;
