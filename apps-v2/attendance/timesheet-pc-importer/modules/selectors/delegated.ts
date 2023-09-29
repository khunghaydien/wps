import { createSelector } from 'reselect';

import delegatedEmployee from './delegatedEmployee';

export default createSelector(
  delegatedEmployee,
  (delegatedEmployee): boolean => !!delegatedEmployee?.id
);
