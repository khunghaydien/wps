import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import DateUtil from '../../../../commons/utils/DateUtil';

import {
  ExchangeRate,
  fetch,
} from '../../../models/exchange-rate/ExchangeRate';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = ExchangeRate[];

const KEY = 'MODULES/EXCHANGE_RATE/ENTITIES/EXCHANGE_RATE_LIST';

const ACTIONS = {
  SET: `${KEY}/SET`,
  UNSET: `${KEY}/UNSET`,
};

const setExchangeRateList = (exchangeRateList: ExchangeRate[]) => ({
  type: ACTIONS.SET,
  payload: exchangeRateList,
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch:
    (companyId: string, baseCurrencyCode: string, baseCurrencyName: string) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return fetch(companyId, baseCurrencyCode, baseCurrencyName)
        .then((exchangeRateList) =>
          dispatch(
            setExchangeRateList(
              exchangeRateList.map((e) => ({
                ...e,
                validDateTo: DateUtil.addDays(e.validDateTo, -1),
              }))
            )
          )
        )
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },
};

const initialState: State = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
