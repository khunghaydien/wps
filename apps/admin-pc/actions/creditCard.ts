import * as base from './base';

const FUNC_NAME = 'exp/credit-card-information';
export const SEARCH_CREDIT_CARD = 'SEARCH_CREDIT_CARD';
export const CREATE_CREDIT_CARD = 'CREATE_CREDIT_CARD';
export const DELETE_CREDIT_CARD = 'DELETE_CREDIT_CARD';
export const UPDATE_CREDIT_CARD = 'UPDATE_CREDIT_CARD';
export const SEARCH_CREDIT_CARD_ERROR = 'SEARCH_CREDIT_CARD_ERROR';
export const CREATE_CREDIT_CARD_ERROR = 'CREATE_CREDIT_CARD_ERROR';
export const DELETE_CREDIT_CARD_ERROR = 'DELETE_CREDIT_CARD_ERROR';
export const UPDATE_CREDIT_CARD_ERROR = 'UPDATE_CREDIT_CARD_ERROR';

export const searchCreditCard = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_CREDIT_CARD,
    SEARCH_CREDIT_CARD_ERROR
  );
};

export const createCreditCard = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_CREDIT_CARD,
    CREATE_CREDIT_CARD_ERROR
  );
};

export const deleteCreditCard = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_CREDIT_CARD,
    DELETE_CREDIT_CARD_ERROR
  );
};

export const updateCreditCard = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_CREDIT_CARD,
    UPDATE_CREDIT_CARD_ERROR
  );
};
