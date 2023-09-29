import { catchApiError } from '../../../commons/actions/app';

import {
  getPsaAccessSetting,
  PsaAccessSetting,
  PsaPermissionType,
} from '../../models/psa/PsaAccess';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

function convertToPascalCase(key: string) {
  return (
    'can' +
    key[0] +
    key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .substr(1)
  );
}

export const ACTIONS = {
  GET_ACCESS_SETTING_SUCCESS:
    'MODULES/ENTITIES/PSA/ACCESS_SETTING/GET_ACCESS_SETTING_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/ACCESS_SETTING/INIT_SUCCESS',
};

export const getPsaAccessSettingSuccess = (body: any) => ({
  type: ACTIONS.GET_ACCESS_SETTING_SUCCESS,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});
// eslint-disable-next-line import/prefer-default-export
export const actions = {
  get:
    (
      empId: string,
      psaPermissions: Array<PsaPermissionType>,
      psaGroupId: string
    ) =>
    (dispatch: AppDispatch): Promise<any> =>
      getPsaAccessSetting(empId, psaPermissions, psaGroupId)
        .then((res: PsaAccessSetting) => {
          const result = {};
          psaPermissions.forEach((key, i) => {
            result[convertToPascalCase(key)] = res[i];
          });
          dispatch(getPsaAccessSettingSuccess(result));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<PsaAccessSetting> =>
      dispatch(initialize()),
};

const initialState = {};

type State = PsaAccessSetting | Record<string, any>;

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_ACCESS_SETTING_SUCCESS:
      return action.payload;
    case ACTIONS.INIT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
