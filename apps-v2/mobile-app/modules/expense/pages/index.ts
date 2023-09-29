import { combineReducers } from 'redux';

import defaultRouteOptions from './defaultRouteOptions';
import routeFormPage from './routeFormPage';

export default combineReducers({
  routeFormPage,
  defaultRouteOptions,
});
