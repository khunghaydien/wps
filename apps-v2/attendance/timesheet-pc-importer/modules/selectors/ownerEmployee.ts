import { createSelector } from 'reselect';

import delegated from './delegated';
import delegatedEmployee from './delegatedEmployee';
import leggedInEmployee from './leggedInEmployee';

export default createSelector(
  leggedInEmployee,
  delegatedEmployee,
  delegated,
  (leggedInEmployee, delegatedEmployee, delegated) =>
    delegated ? delegatedEmployee : leggedInEmployee
);
