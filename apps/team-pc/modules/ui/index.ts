import { combineReducers } from 'redux';

import { $State } from '../../../commons/utils/TypeUtil';

import attRequestStatus from './attRequestStatus';

const rootReducer = {
  attRequestStatus,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
