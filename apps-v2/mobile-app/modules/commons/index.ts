import { combineReducers } from 'redux';

import { $State } from '../../../commons/utils/TypeUtil';

import $alert from './alert';
import $confirm from './confirm';
import error from './error';
import loading from './loading';
import location from './location';

const rootReducer = {
  error,
  alert: $alert,
  confirm: $confirm,
  loading,
  location,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
