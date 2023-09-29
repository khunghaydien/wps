import { combineReducers } from 'redux';

import capacityEditorActions from './capacityEditorActions';
import capacityEditorWorkArrangements from './capacityEditorWorkArrangements';
import capacityEditorWorkSchemes from './capacityEditorWorkSchemes';

export default combineReducers({
  capacityEditorActions,
  capacityEditorWorkArrangements,
  capacityEditorWorkSchemes,
});
