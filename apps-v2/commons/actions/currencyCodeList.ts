import {
  CurrencyCodeList,
  searchCurrencyCodeList,
} from '@apps/domain/models/exp/foreign-currency/Currency';

export const FETCH_CURRENCY_CODE_LIST =
  'COMMONS/ACTIONS/FETCH_CURRENCY_CODE_LIST';

const set = (list: CurrencyCodeList) => ({
  type: FETCH_CURRENCY_CODE_LIST,
  payload: list,
});

export const fetchCurrencyCodeList = () => (dispatch) => {
  searchCurrencyCodeList().then(({ records }) => {
    dispatch(set(records));
  });
};
