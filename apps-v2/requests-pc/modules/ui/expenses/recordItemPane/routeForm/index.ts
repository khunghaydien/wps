import { combineReducers } from 'redux';

import arrival from './arrival';
import edits from './edits';
import errors from './errors';
import option from './option';
import origin from './origin';
import roundTrip from './roundTrip';
import viaList from './viaList';

export default combineReducers({
  roundTrip,
  origin,
  viaList,
  arrival,
  option,
  errors,
  edits,
});
