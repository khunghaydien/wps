import {
  getRequestList,
  initialRequestList,
  initialStateRequest,
  RequestList,
  RequestListItem as Request,
  RoleRequestListFilterState,
} from '../../models/psa/Request';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PSA/REQUEST/LIST_SUCCESS',
  LIST_UPDATE: 'MODULES/ENTITIES/PSA/REQUEST/LIST_UPDATE',
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/REQUEST/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/PSA/REQUEST/SAVE_SUCCESS',
  SAVE: 'MODULES/UI/PSA/REQUEST/SAVE',
  DELETE: 'MODULES/UI/PSA/REQUEST/DELETE',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/REQUEST/INIT_SUCCESS',
};

export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
export const MAX_RECORD_NUM = 1000;
export const MAX_PAGE_NUM = MAX_RECORD_NUM / PAGE_SIZE;

const listSuccess = (body: RequestList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const saveSuccess: any = (body: Request) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

export const actions = {
  list:
    (
      companyId: string,
      pageNum = 1,
      filterQuery?: RoleRequestListFilterState | Record<string, any>,
      listSize = PAGE_SIZE
    ) =>
    (dispatch: AppDispatch): void | any =>
      getRequestList(companyId, listSize, pageNum, filterQuery)
        .then((res: RequestList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<RequestList> =>
      dispatch(initialize()),

  saveInternally:
    (request: Request) =>
    (dispatch: AppDispatch): Promise<Request> =>
      dispatch(saveSuccess(request)),
};

const initialState = {
  ...initialRequestList,
  request: initialStateRequest,
};

type State = RequestList & {
  request: Request;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
      return {
        ...state,
        request: action.payload,
      };
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        requestList: action.payload,
      };
    default:
      return state;
  }
};
