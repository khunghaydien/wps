import { INTEGRATION_SERVICE_LABELS } from '@apps/domain/models/exp/PaymentMethod';

import * as base from '@admin-pc/actions/base';

type SearchParam = {
  companyId: string;
};

export type CreateUpdateParam = {
  id?: string;
  companyId: string;
  code: string;
  name_L0: string;
  name_L1?: string;
  name_L2?: string;
  description_L0?: string;
  description_L1?: string;
  description_L2?: string;
  active: boolean;
  reimbursement: boolean;
  integrationService: keyof typeof INTEGRATION_SERVICE_LABELS;
  accountCode: string;
  accountName: string;
  subAccountCode: string;
  subAccountName: string;
};

type DeleteParam = {
  id: string;
};

const FUNC_NAME = 'exp/payment-method';
export const CREATE_PAYMENT_METHOD = 'CREATE_PAYMENT_METHOD';
export const DELETE_PAYMENT_METHOD = 'DELETE_PAYMENT_METHOD';
export const SEARCH_PAYMENT_METHOD = 'SEARCH_PAYMENT_METHOD';
export const UPDATE_PAYMENT_METHOD = 'UPDATE_PAYMENT_METHOD';
export const CREATE_PAYMENT_METHOD_ERROR = 'CREATE_PAYMENT_METHOD_ERROR';
export const DELETE_PAYMENT_METHOD_ERROR = 'DELETE_PAYMENT_METHOD_ERROR';
export const SEARCH_PAYMENT_METHOD_ERROR = 'SEARCH_PAYMENT_METHOD_ERROR';
export const UPDATE_PAYMENT_METHOD_ERROR = 'UPDATE_PAYMENT_METHOD_ERROR';

export const create = (param: CreateUpdateParam) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_PAYMENT_METHOD,
    CREATE_PAYMENT_METHOD_ERROR
  );
};

export const del = (param: DeleteParam) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_PAYMENT_METHOD,
    DELETE_PAYMENT_METHOD_ERROR
  );
};

export const search = (param: SearchParam) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_PAYMENT_METHOD,
    SEARCH_PAYMENT_METHOD_ERROR
  );
};

export const update = (param: CreateUpdateParam) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_PAYMENT_METHOD,
    UPDATE_PAYMENT_METHOD_ERROR
  );
};
