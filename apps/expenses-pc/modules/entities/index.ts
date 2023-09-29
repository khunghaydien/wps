import { combineReducers } from 'redux';

import approval from '../../../domain/modules/approval';
import exp from '../../../domain/modules/exp';

// for pagination
import reportIdList from './reportIdList';

export default combineReducers({
  exp,
  approval,
  reportIdList,
});
