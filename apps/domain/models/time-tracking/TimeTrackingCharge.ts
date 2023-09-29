import STATUS, { Status } from '../approval/request/Status';

/**
 * Tests time tracking charge transfer is available or not for a given status
 * @param status - Request status
 * @returns the availability of time tracking charge transfer
 */
export const canTransfer = (status: Status): boolean =>
  STATUS.Canceled === status ||
  STATUS.Recalled === status ||
  STATUS.Rejected === status ||
  STATUS.NotRequested === status;
