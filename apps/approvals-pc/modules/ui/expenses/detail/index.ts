import { combineReducers } from 'redux';

import comment from './comment';
import recordsArea from './recordsArea';
import sideFilePreview from './sideFilePreview';

export default combineReducers({
  comment,
  recordsArea,
  sideFilePreview,
});
