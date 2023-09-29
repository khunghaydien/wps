import {
  getResourceGroupList,
  initialResourceGroupList,
  ResourceGroupList,
} from '../../models/psa/ResourceGroup';

import { GET_RESOURCE_GROUP } from '../../../admin-pc/actions/resourceGroup';
import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS_LIST: 'MODULES/ENTITIES/PSA/RESOURCE_GROUP/GET_SUCCESS_LIST',
  INIT_SUCCESS_LIST: 'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/INIT_SUCCESS_LIST',
  CLEAR_SUCCESS_LIST:
    'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/CLEAR_SUCCESS_LIST',
};

const getSuccessList = (body: ResourceGroupList) => ({
  type: ACTIONS.GET_SUCCESS_LIST,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS_LIST,
  payload: [],
});

const clear: any = () => ({
  type: ACTIONS.CLEAR_SUCCESS_LIST,
  payload: [],
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ResourceGroupList> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<ResourceGroupList> =>
      dispatch(clear()),

  getResourceGroups:
    (companyId: string, ownerId?: string) =>
    (dispatch: AppDispatch): void | any =>
      getResourceGroupList(companyId, ownerId)
        .then((res: any) => {
          dispatch(getSuccessList(res.groups));
        })
        .catch((err) => {
          throw err;
        }),
};

const initialState = {
  groups: initialResourceGroupList,
  detail: [],
};

type State = {
  groups: ResourceGroupList;
  detail: any;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS_LIST:
    case ACTIONS.INIT_SUCCESS_LIST:
      return {
        ...state,
        groups: action.payload,
      };
    case GET_RESOURCE_GROUP:
      return {
        ...state,
        detail: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS_LIST:
      return initialState;
    default:
      return state;
  }
};
