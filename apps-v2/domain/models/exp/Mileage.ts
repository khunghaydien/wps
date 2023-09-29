import Api from '@apps/commons/api';

export const MAX_DESTINATIONS = 6;
export const MIN_DESTINATIONS = 2;

export const initialDestinations: Array<MileageDestinationInfo> = [
  { name: '' },
  { name: '' },
];

export const NO_ROUTE_STATUSES = ['NOT_FOUND', 'ZERO_RESULTS'];
export const API_LIMIT_EXCEEDED_STATUSES = [
  'OVER_QUERY_LIMIT',
  'REQUEST_DENIED',
  'UNKNOWN_ERROR',
];

export interface SearchMileageRateRequest {
  id?: string;
  companyId: string;
  targetDate?: string;
}

export interface MileageRate {
  id: string;
  code: string;
  comment?: string;
  companyId: string;
  historyId: string;
  name?: string;
  name_L0?: string;
  name_L1?: string;
  name_L2?: string;
  rate: number;
  validDateFrom: string;
  validDateTo: string;
}

export enum MileageUnit {
  KILOMETER = 'kilometer',
  MILE = 'mile',
}

export type MileageDestinationInfo = {
  name: string;
  placeId?: string;
};

export const searchMileageRate = (
  param: SearchMileageRateRequest
): Promise<{ records: MileageRate[] }> => {
  return Api.invoke({
    path: '/exp/mileage-rate/search',
    param,
  });
};

export const getRecentlyUsedDestinations = (
  employeeBaseId: string,
  companyId: string
): Promise<{ records: Array<string> }> => {
  return Api.invoke({
    path: '/exp/mileage-destination/recently-used/list',
    param: { employeeBaseId, companyId },
  });
};
