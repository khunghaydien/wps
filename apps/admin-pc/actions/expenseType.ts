import * as base from './base';

const FUNC_NAME = 'exp/expense-type';
export const SEARCH_EXPENSE_TYPE = 'SEARCH_EXPENSE_TYPE';
export const CREATE_EXPENSE_TYPE = 'CREATE_EXPENSE_TYPE';
export const DELETE_EXPENSE_TYPE = 'DELETE_EXPENSE_TYPE';
export const UPDATE_EXPENSE_TYPE = 'UPDATE_EXPENSE_TYPE';
export const SEARCH_EXPENSE_TYPE_ERROR = 'SEARCH_EXPENSE_TYPE_ERROR';
export const CREATE_EXPENSE_TYPE_ERROR = 'CREATE_EXPENSE_TYPE_ERROR';
export const DELETE_EXPENSE_TYPE_ERROR = 'DELETE_EXPENSE_TYPE_ERROR';
export const UPDATE_EXPENSE_TYPE_ERROR = 'UPDATE_EXPENSE_TYPE_ERROR';
export const GET_CONSTANTS_EXPENSE_TYPE = 'GET_CONSTANTS_EXPENSE_TYPE';

const remoteConverter = (param = {} as any) => {
  const canUseForeign = !['TransitJorudanJP', 'TransportICCardJP'].includes(
    param.recordType
  );
  return {
    ...param,
    foreignCurrencyUsage: canUseForeign
      ? param.foreignCurrencyUsage
      : 'NOT_USED',
  };
};

export const searchExpenseType = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXPENSE_TYPE,
    SEARCH_EXPENSE_TYPE_ERROR
  );
};

export const createExpenseType = (param) => {
  const remoteParam = remoteConverter(param);
  return base.create(
    FUNC_NAME,
    remoteParam,
    CREATE_EXPENSE_TYPE,
    CREATE_EXPENSE_TYPE_ERROR
  );
};

export const deleteExpenseType = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_EXPENSE_TYPE,
    DELETE_EXPENSE_TYPE_ERROR
  );
};

export const updateExpenseType = (param) => {
  const remoteParam = remoteConverter(param);
  return base.update(
    FUNC_NAME,
    remoteParam,
    UPDATE_EXPENSE_TYPE,
    UPDATE_EXPENSE_TYPE_ERROR
  );
};

export const getConstantsExpenseType = () => ({
  type: GET_CONSTANTS_EXPENSE_TYPE,
});

export const searchMinimalExpenseTypes = (param = {}) => {
  return base.searchMinimal(
    FUNC_NAME,
    param,
    SEARCH_EXPENSE_TYPE,
    SEARCH_EXPENSE_TYPE_ERROR
  );
};
