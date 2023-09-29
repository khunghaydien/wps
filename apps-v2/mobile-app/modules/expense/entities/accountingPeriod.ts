import { Reducer } from 'redux';

import {
  AccountingPeriodList,
  searchAccountingPeriod,
} from '../../../../domain/models/exp/AccountingPeriod';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_ACCOUNT_PERIOD_SUCCESS:
    'MODULES/ENTITIES/EXP/ACCOUNT_PERIOD/SEARCH_ACCOUNT_PERIOD_SUCCESS',
};

const searchAccountingPeriodSuccess = (list: AccountingPeriodList) => ({
  type: ACTIONS.SEARCH_ACCOUNT_PERIOD_SUCCESS,
  payload: list,
});

export const actions = {
  list:
    (companyId: string) =>
    (dispatch: AppDispatch): Promise<AccountingPeriodList> => {
      return searchAccountingPeriod(companyId).then(
        ({ records }: { records: AccountingPeriodList }) => {
          dispatch(searchAccountingPeriodSuccess(records));
          return records;
        }
      );
    },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_ACCOUNT_PERIOD_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<AccountingPeriodList | null, any>;
