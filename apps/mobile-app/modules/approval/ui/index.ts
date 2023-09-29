import { combineReducers } from 'redux';

import { $State } from '../../../../commons/utils/TypeUtil';

import detail from './detail';
import advSearch from './expense/advSearch';
import requestModule from './expense/requestModule';
import isExpenseModule from './isExpenseModule';

const rootReducer = {
  detail,
  advSearch,
  requestModule,
  isExpenseModule,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
