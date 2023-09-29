import {
  CapabilityInfo,
  getCapabilityInfo,
  initialCapabilityInfo,
} from '../../models/psa/CapabilityInfo';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/CAPABILITY_INFO/GET_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/CAPABILITY_INFO/INIT_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/ENTITIES/PSA/CAPABILITY_INFO/CLEAR_SUCCESS',
};

const getSuccess = (body: CapabilityInfo) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const clear: any = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
  payload: [],
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<CapabilityInfo> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<CapabilityInfo> =>
      dispatch(clear()),

  get:
    (empId: string, psaGroupId: string) =>
    (dispatch: AppDispatch): void | any =>
      getCapabilityInfo(empId, psaGroupId)
        .then((res: any) => dispatch(getSuccess(res.profile)))
        .catch((err) => {
          throw err;
        }),
};

const initialState = initialCapabilityInfo;

type State = CapabilityInfo;

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.INIT_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
