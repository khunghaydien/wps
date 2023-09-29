import { LegalAgreementRequestList } from '@attendance/domain/models/LegalAgreementRequest';

import ROOT from './actionType';

type State = LegalAgreementRequestList;

const initialState: State = {
  requests: [],
  availableRequestTypes: null,
};

const ACTION_TYPE_ROOT = `${ROOT}/LIST` as const;

const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: LegalAgreementRequestList;
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = Set | Clear;

export const actions = {
  set: (list: LegalAgreementRequestList): Set => ({
    type: ACTION_TYPE.SET,
    payload: list,
  }),
  clear: (): Clear => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.SET:
      return {
        ...(action as Set).payload,
      };

    case ACTION_TYPE.CLEAR:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}
