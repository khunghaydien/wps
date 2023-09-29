import _ from 'lodash';

import suggestInputTemplate from '../constants/suggestInputTemplate';
import suggestionStatus from '../constants/suggestionStatus';

import {
  CANCEL_CONFIRM,
  EMPTY_SEARCH_STRING,
  ON_CHANGE_INPUT,
  SEARCH_STATION,
  SET_SUGGEST_INPUT,
  SET_SUGGESTION_ITEM,
} from '../actions/route';

const initialState = {
  origin: _.cloneDeep(suggestInputTemplate),
  arrival: _.cloneDeep(suggestInputTemplate),
  via1: _.cloneDeep(suggestInputTemplate),
  via2: _.cloneDeep(suggestInputTemplate),
  via3: _.cloneDeep(suggestInputTemplate),
  via4: _.cloneDeep(suggestInputTemplate),
};

function makeSuggestion(stationList) {
  const categoryList = {};
  stationList.forEach((station) => {
    if (!categoryList[station.category]) {
      categoryList[station.category] = [];
    }
    const { name, company, category } = station;
    categoryList[station.category].push({ name, company, category });
  });

  const suggestions = [];
  Object.keys(categoryList).forEach((key) => {
    suggestions.push({ category: key, suggestions: categoryList[key] });
  });
  return suggestions;
}

export default function suggestInputReducer(state = initialState, action) {
  const suggestInput = _.cloneDeep(state);
  const { payload, type } = action;

  switch (type) {
    case ON_CHANGE_INPUT:
      suggestInput[payload.inputType].value = payload.value;
      return suggestInput;
    case CANCEL_CONFIRM:
      suggestInput[payload.inputType].selectSuggestion = {};
      suggestInput[payload.inputType].status = suggestionStatus.INITIAL;
      return suggestInput;
    case SEARCH_STATION:
      let suggestions = [];
      const searchedStation = payload.searchedStation;

      if (searchedStation && searchedStation.num > 0) {
        suggestions = makeSuggestion(searchedStation.stationList);
        suggestInput[payload.inputType].status =
          suggestionStatus.SEARCH_STATION_SUCCESS;
      } else if (searchedStation && searchedStation.num === 0) {
        suggestInput[payload.inputType].status =
          suggestionStatus.SEARCH_STATION_NO_RESULT;
      } else {
        suggestInput[payload.inputType].status =
          suggestionStatus.SEARCH_STATION_ERROR;
      }

      suggestInput[payload.inputType].suggestions = suggestions;
      return suggestInput;
    case EMPTY_SEARCH_STRING:
      suggestInput[payload.inputType].status =
        suggestionStatus.EMPTY_SEARCH_STRING;
      return suggestInput;
    case SET_SUGGESTION_ITEM:
      suggestInput[payload.inputType].selectSuggestion = payload.suggestionItem;
      suggestInput[payload.inputType].status =
        suggestionStatus.SELECTED_SUGGESTION_ITEM;
      return suggestInput;
    case SET_SUGGEST_INPUT:
      if (_.isEmpty(payload)) {
        return initialState;
      } else {
        const routeInfo = payload;
        suggestInput.origin.selectSuggestion = routeInfo.origin;
        suggestInput.origin.suggestions = [];
        suggestInput.origin.value = routeInfo.origin.name;
        suggestInput.arrival.selectSuggestion = routeInfo.arrival;
        suggestInput.arrival.suggestions = [];
        suggestInput.origin.value = routeInfo.origin.name;
        return suggestInput;
      }

    default:
      return state;
  }
}
