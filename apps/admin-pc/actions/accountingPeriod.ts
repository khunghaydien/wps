import * as base from './base';

const FUNC_NAME = 'exp/accounting-period';
export const SEARCH_ACCOUNTING_PERIOD = 'SEARCH_ACCOUNTING_PERIOD';
export const CREATE_ACCOUNTING_PERIOD = 'CREATE_ACCOUNTING_PERIOD';
export const DELETE_ACCOUNTING_PERIOD = 'DELETE_ACCOUNTING_PERIOD';
export const UPDATE_ACCOUNTING_PERIOD = 'UPDATE_ACCOUNTING_PERIOD';
export const SEARCH_ACCOUNTING_PERIOD_ERROR = 'SEARCH_ACCOUNTING_PERIOD_ERROR';
export const CREATE_ACCOUNTING_PERIOD_ERROR = 'CREATE_ACCOUNTING_PERIOD_ERROR';
export const DELETE_ACCOUNTING_PERIOD_ERROR = 'DELETE_ACCOUNTING_PERIOD_ERROR';
export const UPDATE_ACCOUNTING_PERIOD_ERROR = 'UPDATE_ACCOUNTING_PERIOD_ERROR';

export const searchAccountingPeriod = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_ACCOUNTING_PERIOD,
    SEARCH_ACCOUNTING_PERIOD_ERROR
  );
};

export const createAccountingPeriod = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_ACCOUNTING_PERIOD,
    CREATE_ACCOUNTING_PERIOD_ERROR
  );
};

export const deleteAccountingPeriod = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_ACCOUNTING_PERIOD,
    DELETE_ACCOUNTING_PERIOD_ERROR
  );
};

export const updateAccountingPeriod = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ACCOUNTING_PERIOD,
    UPDATE_ACCOUNTING_PERIOD_ERROR
  );
};
