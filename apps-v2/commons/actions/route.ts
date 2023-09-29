import { loadingEnd, loadingStart } from './app';

export const ON_CHANGE_INPUT = 'ON_CHANGE_INPUT';
export const CANCEL_CONFIRM = 'CANCEL_CONFIRM';
export const SEARCH_STATION = 'SEARCH_STATION';
export const EMPTY_SEARCH_STRING = 'EMPTY_SEARCH_STRING';
export const SET_SUGGESTION_ITEM = 'SET_SUGGESTION_ITEM';
export const GET_STATION_HISTORY = 'GET_STATION_HISTORY';
export const SEARCH_ROUTE_START = 'SEARCH_ROUTE_START';
export const SEARCH_ROUTE = 'SEARCH_ROUTE';
export const SET_SUGGEST_INPUT = 'SET_SUGGEST_INPUT';

export function onChangeInput(inputType, value) {
  return {
    type: ON_CHANGE_INPUT,
    payload: { inputType, value },
  };
}

export function cancelConfirm(inputType) {
  return {
    type: CANCEL_CONFIRM,
    payload: { inputType },
  };
}

function searchStationSuccess(result, inputType) {
  return {
    type: SEARCH_STATION,
    payload: { searchedStation: result.data, inputType },
  };
}

function searchStationEmptySearchString(inputType) {
  return {
    type: EMPTY_SEARCH_STRING,
    payload: { inputType },
  };
}

/**
 * サジェストで選択された駅情報を保存
 */
export function setSuggestionItem(inputType, suggestionItem) {
  return {
    type: SET_SUGGESTION_ITEM,
    payload: { inputType, suggestionItem },
  };
}

function getStationHistorySuccess(result) {
  return {
    type: GET_STATION_HISTORY,
    payload: result,
  };
}

function searchRouteStart() {
  return {
    type: SEARCH_ROUTE_START,
  };
}

function searchRouteSuccess(result, param) {
  return {
    type: SEARCH_ROUTE,
    payload: { searchedRoute: result.data, param },
  };
}

/**
 * 経路検索に必要な駅情報をセットする
 */
export function setSuggestInput(routeInfo) {
  return {
    type: SET_SUGGEST_INPUT,
    payload: routeInfo,
  };
}

/**
 * 駅名を取得
 */
export function searchStation(inputType, param) {
  return (dispatch, getState) => {
    if (!param.searchString) {
      return dispatch(searchStationEmptySearchString(inputType));
    }
    dispatch(loadingStart());
    const state = getState();
    return state.env.api.common.route.searchStation(state, param, (result) => {
      dispatch(loadingEnd());
      dispatch(searchStationSuccess(result, inputType));
    });
  };
}

/**
 * 駅名の履歴を取得
 */
export function getStationHistory(param) {
  return (dispatch, getState) => {
    const state = getState();
    return state.env.api.common.route.getStationHistory(
      state,
      param,
      (result) => {
        dispatch(getStationHistorySuccess(result));
      }
    );
  };
}

/**
 * 経路を取得
 */
export function searchRoute(param, _param2) {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    dispatch(searchRouteStart());
    const state = getState();
    return state.env.api.common.route.searchRoute(state, param, (result) => {
      dispatch(loadingEnd());
      dispatch(searchRouteSuccess(result, param));
    });
  };
}
