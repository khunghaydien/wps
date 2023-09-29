import { combineReducers } from 'redux';

import customRequestList from '@commons/modules/customRequest/entities/customRequestList';
import referenceLabelField from '@commons/modules/customRequest/entities/referenceLabelField';
import referenceLayout from '@commons/modules/customRequest/entities/referenceLayout';
import referenceRecords from '@commons/modules/customRequest/entities/referenceRecords';
import requestDetail from '@commons/modules/customRequest/entities/requestDetail';

import defaultRequest from './defaultRequest';
import recordTypeList from './recordTypeList';

const reducers = {
  customRequestList,
  recordTypeList,
  requestDetail,
  referenceRecords,
  referenceLayout,
  referenceLabelField,
  defaultRequest,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
