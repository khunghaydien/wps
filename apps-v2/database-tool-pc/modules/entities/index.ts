import { combineReducers } from 'redux';

import objectDetails from './objectDetails';
import objectList from './objectList';
import objRecord from './objRecord';
import query from './query';
import recordDetail from './recordDetail';

export default combineReducers({
  objectList,
  objectDetails,
  objRecord,
  recordDetail,
  query,
});
