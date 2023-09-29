import { combineReducers } from 'redux';

import capabilityInfo from '../../../domain/modules/psa/capabilityInfo';

import skillsetCategoryList from '@apps/admin-pc/reducers/searchCategory';
import skillItemsList from '@apps/admin-pc/reducers/searchSkillset';

export default combineReducers({
  capabilityInfo,
  skillsetCategoryList,
  skillItemsList,
});
