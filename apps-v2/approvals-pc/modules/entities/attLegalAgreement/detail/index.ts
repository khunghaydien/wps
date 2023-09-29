import { LegalAgreementRequest } from '@apps/attendance/domain/models/approval/LegalAgreementRequest';

import ROOT from '../actionType';

/** Define constants */
const ACTION_TYPE_ROOT = `${ROOT}/DETAIL` as const;
export const ACTION_TYPE = {
  FETCH_SUCCESS: `${ACTION_TYPE_ROOT}/FETCH_SUCCESS`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

/** Define actions */
type FetchSuccessAction = {
  type: typeof ACTION_TYPE.FETCH_SUCCESS;
  payload: LegalAgreementRequest;
};

type ClearAction = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Actions = FetchSuccessAction | ClearAction;

export const actions = {
  fetchSuccess: (res: LegalAgreementRequest): FetchSuccessAction => ({
    type: ACTION_TYPE.FETCH_SUCCESS,
    payload: res,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

/** Define reducer */
type State = LegalAgreementRequest | null;

const initialState: State = null;

export default (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTION_TYPE.FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTION_TYPE.CLEAR:
      return initialState;
    default:
      return state;
  }
};
