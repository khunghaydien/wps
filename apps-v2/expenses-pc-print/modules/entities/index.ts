import { combineReducers } from 'redux';

import report from './report';
import reportTypeList from './reportTypeList';

const reducers = {
  report,
  reportTypeList,
};

export default combineReducers(reducers);
