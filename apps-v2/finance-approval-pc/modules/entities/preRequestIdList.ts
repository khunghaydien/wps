import { Reducer } from 'redux';

import {
  FinanceApprovalRequestIds,
  getPreRequestIdList,
  OrderBy,
  SearchConditions,
  SortBy,
} from '@apps/domain/models/exp/FinanceApproval';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PRE_REQUEST_ID_LIST/LIST_SUCCESS',
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
      dispatch: AppDispatch
    ): Promise<{ payload: FinanceApprovalRequestIds; type: string }> => {
      return getPreRequestIdList(
        companyId,
        sortBy,
        orderBy,
        advSearchConditions
      ).then((res: FinanceApprovalRequestIds) => dispatch(listSuccess(res)));
    },
};

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
