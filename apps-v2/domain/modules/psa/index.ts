import { combineReducers } from 'redux';

import access from './access';
import activity from './activity';
import assignment from './assignment';
import capabilityInfo from './capabilityInfo';
import project from './project';
import projectFinance from './projectFinance';
import projectManager from './projectManager';
import projectUploadInfo from './projectUpload';
import psaExtendedItem from './psaExtendedItem';
import request from './request';
import resource from './resource';
import resourceGroup from './resourceGroup';
import resourceManager from './resourceManager';
import role from './role';
import setting from './setting';

export default combineReducers({
  access,
  activity,
  assignment,
  capabilityInfo,
  project,
  projectFinance,
  projectManager,
  projectUploadInfo,
  psaExtendedItem,
  request,
  resource,
  resourceGroup,
  resourceManager,
  role,
  setting,
});
