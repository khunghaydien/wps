import * as base from './base';

const FUNC_NAME = 'att/legal-agreement-group';
export const SEARCH_LEGAL_AGREEMENT_GROUP = 'SEARCH_LEGAL_AGREEMENT_GROUP';
export const CREATE_LEGAL_AGREEMENT_GROUP = 'CREATE_LEGAL_AGREEMENT_GROUP';
export const DELETE_LEGAL_AGREEMENT_GROUP = 'DELETE_LEGAL_AGREEMENT_GROUP';
export const UPDATE_LEGAL_AGREEMENT_GROUP = 'UPDATE_LEGAL_AGREEMENT_GROUP';
export const SEARCH_LEGAL_AGREEMENT_GROUP_ERROR =
  'SEARCH_LEGAL_AGREEMENT_GROUP_ERROR';
export const CREATE_LEGAL_AGREEMENT_GROUP_ERROR =
  'CREATE_LEGAL_AGREEMENT_GROUP_ERROR';
export const DELETE_LEGAL_AGREEMENT_GROUP_ERROR =
  'DELETE_LEGAL_AGREEMENT_GROUP_ERROR';
export const UPDATE_LEGAL_AGREEMENT_GROUP_ERROR =
  'UPDATE_LEGAL_AGREEMENT_GROUP_ERROR';
export const GET_CONSTANTS_ATTLEGAL_AGREEMENT_GROP =
  'GET_CONSTANTS_ATTLEGAL_AGREEMENT_GROP';

export const searchLegalAgreementGroup = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_LEGAL_AGREEMENT_GROUP,
    SEARCH_LEGAL_AGREEMENT_GROUP_ERROR
  );
};

export const createLegalAgreementGroup = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_LEGAL_AGREEMENT_GROUP,
    CREATE_LEGAL_AGREEMENT_GROUP_ERROR
  );
};

export const deleteLegalAgreementGroup = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_LEGAL_AGREEMENT_GROUP,
    DELETE_LEGAL_AGREEMENT_GROUP_ERROR
  );
};

export const updateLegalAgreementGroup = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_LEGAL_AGREEMENT_GROUP,
    UPDATE_LEGAL_AGREEMENT_GROUP_ERROR
  );
};

export const getConstantsLegalAgreementGroup = () => ({
  type: GET_CONSTANTS_ATTLEGAL_AGREEMENT_GROP,
});
