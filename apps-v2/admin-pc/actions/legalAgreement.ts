import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'att/legal-agreement';
export const GET_CONSTANTS_LEGALAGREEMENT = 'GET_CONSTANTS_LEGALAGREEMENT';
export const SEARCH_LEGAL_AGREEMENT = 'SEARCH_LEGAL_AGREEMENT';
export const SEARCH_LEGAL_AGREEMENT_ERROR = 'SEARCH_LEGAL_AGREEMENT_ERROR';
export const SEARCH_LEGAL_AGREEMENT_TYPE = 'SEARCH_LEGAL_AGREEMENT_TYPE';
export const CREATE_LEGAL_AGREEMENT = 'CREATE_LEGAL_AGREEMENT';
export const CREATE_LEGAL_AGREEMENT_ERROR = 'CREATE_LEGAL_AGREEMENT_ERROR';
export const DELETE_LEGAL_AGREEMENT = 'DELETE_LEGAL_AGREEMENT';
export const DELETE_LEGAL_AGREEMENT_ERROR = 'DELETE_LEGAL_AGREEMENT_ERROR';
export const UPDATE_LEGAL_AGREEMENT = 'UPDATE_LEGAL_AGREEMENT';
export const UPDATE_LEGAL_AGREEMENT_ERROR = 'UPDATE_LEGAL_AGREEMENT_ERROR';
export const SEARCH_LEGAL_AGREEMENT_TYPE_ERROR =
  'SEARCH_LEGAL_AGREEMENT_TYPE_ERROR';
export const CREATE_HISTORY_LEGAL_AGREEMENT = 'CREATE_HISTORY_LEGAL_AGREEMENT';
export const CREATE_HISTORY_LEGAL_AGREEMENT_ERROR =
  'CREATE_HISTORY_LEGAL_AGREEMENT_ERROR';
export const UPDATE_HISTORY_LEGAL_AGREEMENT = 'UPDATE_HISTORY_LEGAL_AGREEMENT';
export const UPDATE_HISTORY_LEGAL_AGREEMENT_ERROR =
  'UPDATE_HISTORY_LEGAL_AGREEMENT_ERROR';
export const DELETE_HISTORY_LEGAL_AGREEMENT = 'DELETE_HISTORY_LEGAL_AGREEMENT';
export const DELETE_HISTORY_LEGAL_AGREEMENT_ERROR =
  'DELETE_HISTORY_LEGAL_AGREEMENT_ERROR';

export const getConstantsLegalAgreement = () => ({
  type: GET_CONSTANTS_LEGALAGREEMENT,
});

export const searchLegalAgreement = (param) => {
  return base.search(
    FUNC_NAME,
    {
      ...param,
      targetDate: param.targetDate || undefined,
    },
    SEARCH_LEGAL_AGREEMENT,
    SEARCH_LEGAL_AGREEMENT_ERROR
  );
};

export const createLegalAgreement = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_LEGAL_AGREEMENT,
    CREATE_LEGAL_AGREEMENT_ERROR
  );
};

export const deleteLegalAgreement = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_LEGAL_AGREEMENT,
    DELETE_LEGAL_AGREEMENT_ERROR
  );
};

export const updateLegalAgreement = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_LEGAL_AGREEMENT,
    UPDATE_LEGAL_AGREEMENT_ERROR
  );
};

export const searchHistoryLegalAgreement = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_LEGAL_AGREEMENT_TYPE,
    SEARCH_LEGAL_AGREEMENT_TYPE_ERROR
  );
};

export const createHistoryLegalAgreement = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_LEGAL_AGREEMENT,
    CREATE_HISTORY_LEGAL_AGREEMENT_ERROR
  );
};

export const updateHistoryLegalAgreement = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_LEGAL_AGREEMENT,
    UPDATE_HISTORY_LEGAL_AGREEMENT_ERROR
  );
};

export const deleteHistoryLegalAgreement = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_LEGAL_AGREEMENT,
    DELETE_HISTORY_LEGAL_AGREEMENT_ERROR
  );
};
