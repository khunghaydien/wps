import { combineReducers } from 'redux';

import { $State } from '../../../../../commons/utils/TypeUtil';

import history from './history';

const rootReducer = {
  history,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
