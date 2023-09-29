import { combineReducers } from 'redux';

import workCategories from './workCategories';

const rootReducer = {
  workCategories,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
