import { combineReducers } from 'redux';

import formValues from './formValues';
import linkedExpTypeList from './linkedExpTypeList';
import listType from './listType';
import reportTypeSelection from './reportTypeSelection';

export default combineReducers({
  formValues,
  listType,
  reportTypeSelection,
  linkedExpTypeList,
});
