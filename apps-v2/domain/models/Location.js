// @flow

export type LocationFetchStatus = 'Success' | 'Failure' | 'Fetching' | 'None';

export const LOCATION_FETCH_STATUS: {
  [key: LocationFetchStatus]: LocationFetchStatus,
} = {
  Success: 'Success',
  Failure: 'Failure',
  Fetching: 'Fetching',
  None: 'None',
};

export default {
  LOCATION_FETCH_STATUS,
};
