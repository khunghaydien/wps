import {
  convert,
  FixDailyRequestViewModel,
} from '@apps/approvals-pc/models/attendance/FixDailyRequestViewModel';
import { FixDailyRequest as DomainFixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/REQUEST` as const;

export const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  UNSET: `${ACTION_TYPE_ROOT}/UNSET`,
} as const;

export type State = FixDailyRequestViewModel | null;

type SetAction = {
  type: typeof ACTION_TYPE.SET;
  payload: DomainFixDailyRequest;
};

type UnsetAction = {
  type: typeof ACTION_TYPE.UNSET;
};

type Actions = SetAction | UnsetAction;

export const actions = {
  set: (request: DomainFixDailyRequest): SetAction => ({
    type: ACTION_TYPE.SET,
    payload: request,
  }),
  unset: (): UnsetAction => ({
    type: ACTION_TYPE.UNSET,
  }),
};

export const initialState: State = null;

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTION_TYPE.SET: {
      return convert(action.payload);
    }
    case ACTION_TYPE.UNSET: {
      return initialState;
    }
    default:
      return state;
  }
}
