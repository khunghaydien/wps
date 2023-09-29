import { combineReducers } from 'redux';

import highwayBus from './highwayBus';
import routeSort from './routeSort';
import seatPreference from './seatPreference';
import useChargedExpress from './useChargedExpress';
import useExReservation from './useExReservation';

export default combineReducers({
  routeSort,
  seatPreference,
  useChargedExpress,
  highwayBus,
  useExReservation,
});
