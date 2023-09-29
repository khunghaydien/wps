import { Action, combineReducers } from 'redux';

import history from './history';

export default combineReducers<Record<string, any>, Action<any>>({
  history,
});
