import { combineReducers } from 'redux';

import formValues from './formValues';
import itemValues from './itemValues';
import rate from './rate';
import readOnly from './readOnly';

export default combineReducers({
  formValues,
  itemValues,
  rate,
  readOnly,
});
