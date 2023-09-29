import { createSelector } from 'reselect';

import msg from '../../commons/languages';

import { Status } from '../../domain/models/approval/request/Status';

/**
 * Selectors depending on the root state.
 *
 * Note that you should NOT put selectors depending on a module.
 * If you want to write selectors depending on a module, then you should
 * put the selectors into a module.
 */

/* eslint-disable import/prefer-default-export */

/* Status */
export const status = createSelector(
  (s) => s,
  (s: Status) => {
    // For backward compatibility
    const status =
      s === 'Removed' ? /* Deprecated status label */ 'Recalled' : s;

    const key = `Com_Status_${status}`;
    return msg()[key];
  }
);
/* eslint-enable import/prefer-default-export */
