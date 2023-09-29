import * as base from './base';

const FUNC_NAME = 'exp/credit-card-assignment';
export const SEARCH_CREDIT_CARD_ASSIGNMENT = 'SEARCH_CREDIT_CARD_ASSIGNMENT';
export const CREATE_CREDIT_CARD_ASSIGNMENT = 'CREATE_CREDIT_CARD_ASSIGNMENT';
export const DELETE_CREDIT_CARD_ASSIGNMENT = 'DELETE_CREDIT_CARD_ASSIGNMENT';
export const UPDATE_CREDIT_CARD_ASSIGNMENT = 'UPDATE_CREDIT_CARD_ASSIGNMENT';
export const SEARCH_CREDIT_CARD_ASSIGNMENT_ERROR =
  'SEARCH_CREDIT_CARD_ASSIGNMENT_ERROR';
export const CREATE_CREDIT_CARD_ASSIGNMENT_ERROR =
  'CREATE_CREDIT_CARD_ASSIGNMENT_ERROR';
export const DELETE_CREDIT_CARD_ASSIGNMENT_ERROR =
  'DELETE_CREDIT_CARD_ASSIGNMENT_ERROR';
export const UPDATE_CREDIT_CARD_ASSIGNMENT_ERROR =
  'UPDATE_CREDIT_CARD_ASSIGNMENT_ERROR';

export const searchCreditCardAssign = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_CREDIT_CARD_ASSIGNMENT,
    SEARCH_CREDIT_CARD_ASSIGNMENT_ERROR
  );
};

export const createCreditCardAssign = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_CREDIT_CARD_ASSIGNMENT,
    CREATE_CREDIT_CARD_ASSIGNMENT_ERROR
  );
};

export const deleteCreditCardAssign = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_CREDIT_CARD_ASSIGNMENT,
    DELETE_CREDIT_CARD_ASSIGNMENT_ERROR
  );
};

export const updateCreditCardAssign = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_CREDIT_CARD_ASSIGNMENT,
    UPDATE_CREDIT_CARD_ASSIGNMENT_ERROR
  );
};
