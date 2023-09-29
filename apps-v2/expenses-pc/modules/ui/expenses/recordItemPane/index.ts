import { combineReducers } from 'redux';

import fixedAmountOption from './fixedAmountOption';
import foreignCurrency from './foreignCurrency';
import isLoading from './isLoading';
import mileage from './mileage';
import routeForm from './routeForm';
import tax from './tax';
import workingDays from './workingDays';

export default combineReducers({
  routeForm,
  tax,
  isLoading,
  foreignCurrency,
  workingDays,
  fixedAmountOption,
  mileage,
});
