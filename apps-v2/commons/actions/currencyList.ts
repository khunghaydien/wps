import { loadingEnd, loadingStart } from './app';

export const FETCH_CURRENCY_LIST = 'FETCH_CURRENCY_LIST';

function fetchCurrencyListSuccess(result) {
  return {
    type: FETCH_CURRENCY_LIST,
    payload: result,
  };
}

/**
 * 通貨一覧を取得
 */
export function fetchCurrencyList() {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    return state.env.api.common.currencyList.fetchCurrencyList(
      state,
      (result) => {
        dispatch(fetchCurrencyListSuccess(result.currencyList));
        dispatch(loadingEnd());
      }
    );
  };
}
