import { catchApiError } from '@commons/actions/app';

import {
  getPaymentMethodListByReportTypeId,
  PaymentMethod,
  ReportPaymentMethod,
  searchPaymentMethodList,
} from '@apps/domain/models/exp/PaymentMethod';

import { AppDispatch } from '../../AppThunk';

type Search = {
  type: typeof ACTIONS.SEARCH;
  payload: PaymentMethod[];
};

type Get = {
  type: typeof ACTIONS.GET;
  payload: ReportPaymentMethod[];
};

export const ACTIONS = {
  SEARCH: 'MODULES/EXP/ENTITIES/PAYMENT_METHOD/SEARCH',
  GET: 'MODULES/EXP/ENTITIES/PAYMENT_METHOD/GET',
} as const;

export const actions = {
  search:
    (ids: string[], companyId: string, active?: boolean) =>
    (dispatch: AppDispatch): void => {
      searchPaymentMethodList(ids, companyId, active)
        .then(({ records }) => {
          dispatch({
            type: ACTIONS.SEARCH,
            payload: records || [],
          });
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  get:
    (expReportTypeId: string) =>
    (dispatch: AppDispatch): void => {
      getPaymentMethodListByReportTypeId(expReportTypeId).then(
        ({ records }) => {
          dispatch({
            type: ACTIONS.GET,
            payload: records || [],
          });
        }
      );
    },
};

const initialState = [];

export default (
  state = initialState,
  action: Search | Get
): PaymentMethod[] | ReportPaymentMethod[] => {
  switch (action.type) {
    case ACTIONS.SEARCH:
      return action.payload;
    case ACTIONS.GET:
      return action.payload;
    default:
      return state;
  }
};
