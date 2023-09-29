import { combineReducers } from 'redux';

import psa from '@apps/domain/modules/psa';
import resource from '@apps/domain/modules/psa/resource';

import skillsetCategoryList from '@apps/admin-pc/reducers/searchCategory';

import role from './role';

export default combineReducers({
  role,
  resource,
  skillsetCategoryList,
  psa,
});
