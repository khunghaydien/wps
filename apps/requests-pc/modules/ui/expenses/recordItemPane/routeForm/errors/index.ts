import { combineReducers } from 'redux';

import arrival from './arrival';
import origin from './origin';
import viaList from './viaList';

export default combineReducers({
  origin,
  viaList,
  arrival,
});
