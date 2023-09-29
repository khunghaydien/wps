import { combineReducers } from 'redux';

import approvalList from './approvalList';
import customRequestList from './customRequestList';
import referenceLabelField from './referenceLabelField';
import referenceLayout from './referenceLayout';
import referenceRecords from './referenceRecords';
import requestDetail from './requestDetail';

export default combineReducers({
  approvalList,
  customRequestList,
  referenceLabelField,
  referenceLayout,
  referenceRecords,
  requestDetail,
});
