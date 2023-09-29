import { combineReducers } from 'redux';

import { $State } from '../../../commons/utils/TypeUtil';

const rootReducer = {};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
