import { catchApiError } from '../../../commons/actions/app';

import { getPsaSetting, PsaSetting } from '../../models/psa/PsaSetting';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SETTING_SUCCESS: 'MODULES/ENTITIES/PSA/SETTING/GET_SETTING_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/SETTING/INIT_SUCCESS',
};

export const getPsaSettingSuccess = (body: PsaSetting) => ({
  type: ACTIONS.GET_SETTING_SUCCESS,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});
// eslint-disable-next-line import/prefer-default-export
export const actions = {
  get:
    (companyId: string) =>
    (dispatch: AppDispatch): Promise<any> =>
      getPsaSetting(companyId)
        .then((res: PsaSetting) => dispatch(getPsaSettingSuccess(res)))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<PsaSetting> =>
      dispatch(initialize()),
};

const initialState = {};

type State = PsaSetting | Record<string, any>;

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SETTING_SUCCESS:
      return action.payload;
    case ACTIONS.INIT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
