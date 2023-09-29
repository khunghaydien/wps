import { Reducer } from 'redux';

import {
  AccountingPeriodList,
  searchAccountingPeriod,
} from '../../../../../domain/models/exp/AccountingPeriod';

import { AppDispatch } from '../../../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/ENTITIES/EXP/ACCOUNTING_PERIOD/SEARCH_SUCCESS',
};

const searchSuccess = (body: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body.records,
});

export const actions = {
  search:
    (companyId: string) =>
    (dispatch: AppDispatch): void | any => {
      return searchAccountingPeriod(companyId)
        .then((res: any) => {
          dispatch(searchSuccess(res));
        })
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
}) as Reducer<AccountingPeriodList, any>;
