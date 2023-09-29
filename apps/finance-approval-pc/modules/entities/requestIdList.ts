import { Dispatch, Reducer } from 'redux';

import {
  FinanceApprovalRequestIds,
  getRequestIdList,
  OrderBy,
  SearchConditions,
  SortBy,
} from '../../../domain/models/exp/FinanceApproval';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/REQUEST_ID_LIST/LIST_SUCCESS',
};

const listSuccess = (financeApprovalRequestIds: FinanceApprovalRequestIds) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: financeApprovalRequestIds,
});

export const actions = {
  list:
    (
      companyId: string,
      sortBy?: SortBy,
      orderBy?: OrderBy,
      advSearchConditions?: SearchConditions
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<{ payload: FinanceApprovalRequestIds; type: string }> => {
      return getRequestIdList(
        companyId,
        sortBy,
        orderBy,
        advSearchConditions
      ).then((res: FinanceApprovalRequestIds) => dispatch(listSuccess(res)));
    },
};

// NOTE: it's not really good to a employee has multiple value.
// Since the API returns multiple values at the same time, we are daringly doing this.
const initialState = {
  totalSize: 0,
  requestIdList: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<FinanceApprovalRequestIds, any>;
