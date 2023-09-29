import { combineReducers } from 'redux';

import resource from '../../../domain/modules/psa/resource';

import role from './role';

export default combineReducers({
  role,
  resource,
});
