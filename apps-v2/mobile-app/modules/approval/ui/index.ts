import { combineReducers } from 'redux';

import { $State } from '../../../../commons/utils/TypeUtil';

import customRequest from './customRequest';
import detail from './detail';
import advSearch from './expense/advSearch';
import requestModule from './expense/requestModule';
import isExpenseModule from './isExpenseModule';
import list from './list';

const rootReducer = {
  detail,
  list,
  advSearch,
  requestModule,
  isExpenseModule,
  customRequest,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
