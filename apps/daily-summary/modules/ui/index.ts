import { combineReducers } from 'redux';

import blocking from './blocking';
import dailySummary from './dailySummary';
import eventListPopup from './eventListPopup';
import workCategoryList from './workCategoryList';

export default combineReducers({
  dailySummary,
  eventListPopup,
  blocking,
  workCategoryList,
});
