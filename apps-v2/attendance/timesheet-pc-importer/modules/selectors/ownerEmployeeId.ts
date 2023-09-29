import { createSelector } from 'reselect';

import ownerEmployee from './ownerEmployee';

export default createSelector(ownerEmployee, (owner) => owner.id);
