import { SearchMileageRateRequest } from '@apps/domain/models/exp/Mileage';

import * as base from '@admin-pc/actions/base';
import * as history from '@admin-pc/actions/history';

const FUNC_NAME = 'exp/mileage-rate';
export const SEARCH_MILEAGE_RATE = 'SEARCH_MILEAGE_RATE';
export const SEARCH_RECORD_ACCESS_ERROR = 'SEARCH_RECORD_ACCESS_ERROR';
export const DELETE_MILEAGE_RATE = 'DELETE_MILEAGE_RATE';
export const DELETE_MILEAGE_RATE_ERROR = 'DELETE_MILEAGE_RATE_ERROR';
export const CREATE_MILEAGE_RATE = 'CREATE_MILEAGE_RATE';
export const CREATE_MILEAGE_RATE_ERROR = 'CREATE_MILEAGE_RATE_ERROR';
export const UPDATE_MILEAGE_RATE = 'UPDATE_MILEAGE_RATE';
export const UPDATE_MILEAGE_RATE_ERROR = 'UPDATE_MILEAGE_RATE_ERROR';
export const SEARCH_MILEAGE_RATE_HISTORY = 'SEARCH_MILEAGE_RATE_HISTORY';
export const SEARCH_MILEAGE_RATE_HISTORY_ERROR =
  'SEARCH_MILEAGE_RATE_HISTORY_ERROR';
export const CREATE_MILEAGE_RATE_HISTORY = 'CREATE_MILEAGE_RATE_HISTORY';
export const CREATE_MILEAGE_RATE_HISTORY_ERROR =
  'CREATE_MILEAGE_RATE_HISTORY_ERROR';
export const DELETE_MILEAGE_RATE_HISTORY = 'DELETE_MILEAGE_RATE_HISTORY';
export const DELETE_MILEAGE_RATE_HISTORY_ERROR =
  'DELETE_MILEAGE_RATE_HISTORY_ERROR';

export const searchMileageRate = (param: SearchMileageRateRequest) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_MILEAGE_RATE,
    SEARCH_RECORD_ACCESS_ERROR
  );
};

export type MileageRateCreateRequest = {
  companyId: string; // required
  code: string; // required
  name_L0: string; // required
  name_L1?: string;
  name_L2?: string;
  validDateFrom: string; // '2022-02-01'
  validDateTo?: string; // '2100-12-31'
  rate: number; // required
  comment?: string;
};
export const createMileageRate = (param: MileageRateCreateRequest) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_MILEAGE_RATE,
    CREATE_MILEAGE_RATE_ERROR
  );
};

export const deleteMileageRate = (param: { id: string }) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_MILEAGE_RATE,
    DELETE_MILEAGE_RATE_ERROR
  );
};

export type MileageRateUpdateRequest = {
  id: string;
  companyId?: string;
  code: string;
};
export const updateMileageRate = (param: MileageRateUpdateRequest) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_MILEAGE_RATE,
    UPDATE_MILEAGE_RATE_ERROR
  );
};

export const searchMileageRateHistory = (param: { baseId: string }) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_MILEAGE_RATE_HISTORY,
    SEARCH_MILEAGE_RATE_HISTORY_ERROR
  );
};

export const createMileageRateHistory = (param: MileageRateCreateRequest) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_MILEAGE_RATE_HISTORY,
    CREATE_MILEAGE_RATE_HISTORY_ERROR
  );
};

export const deleteMileageRateHistory = (param: { id: string }) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_MILEAGE_RATE_HISTORY,
    DELETE_MILEAGE_RATE_HISTORY_ERROR
  );
};
