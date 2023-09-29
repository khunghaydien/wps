import msg from '../../../commons/languages';
import { showToastWithType } from '../../../commons/modules/toast';

import {
  getResourceManagerListByProjectManagerId,
  initialStateResourceManagerList,
  ResourceManagerList,
} from '../../models/psa/ResourceManager';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS_LIST: 'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/GET_SUCCESS_LIST',
  SAVE_SUCCESS_LIST: 'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/SAVE_SUCCESS_LIST',
  INIT_SUCCESS_LIST: 'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/INIT_SUCCESS_LIST',
  CLEAR_SUCCESS_LIST:
    'MODULES/ENTITIES/PSA/RESOURCE_MANAGER/CLEAR_SUCCESS_LIST',
};

const getSuccessList = (body: ResourceManagerList) => ({
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
    (dispatch: AppDispatch): Promise<ResourceManagerList> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<ResourceManagerList> =>
      dispatch(clear()),

  getListByProjectManagerId:
    (projectManagerId: string) =>
    (dispatch: AppDispatch): void | any =>
      getResourceManagerListByProjectManagerId(projectManagerId)
        .then((res: any) => {
          if (res.members && res.members.length === 0) {
            dispatch(
              showToastWithType(
                msg().Psa_Err_RequireAssociatedResourceManager,
                4000,
                'error'
              )
            );
          }
          dispatch(getSuccessList(res.members));
        })
        .catch((err) => {
          throw err;
        }),
};

const initialState = {
  resourceManagerList: initialStateResourceManagerList,
};

type State = {
  resourceManagerList: ResourceManagerList;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS_LIST:
    case ACTIONS.INIT_SUCCESS_LIST:
      return {
        ...state,
        resourceManagerList: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS_LIST:
      return initialState;
    default:
      return state;
  }
};
