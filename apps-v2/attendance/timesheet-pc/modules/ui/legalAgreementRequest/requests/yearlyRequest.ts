import {
  WorkSystem,
  YearlyOvertime,
} from '@attendance/domain/models/LegalAgreementOvertime';
import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';

// FIXME: このディレクトリ直下に actionType ファイルを作り、それを呼び出すようにする
import ROOT from './actionType';

type State = {
  overtime: YearlyOvertime | null;
  workSystem: WorkSystem | null;
  request: LegalAgreementRequest | null;
};

export type Keys = keyof LegalAgreementRequest;

export type Values = LegalAgreementRequest[keyof LegalAgreementRequest];

const initialState: State = {
  overtime: null,
  workSystem: null,
  request: null,
};

const ACTION_TYPE_ROOT = `${ROOT}/YEARLY-REQUEST` as const;

const ACTION_TYPE = {
  INIT: `${ACTION_TYPE_ROOT}/INIT`,
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
  SETOVERTIME: `${ACTION_TYPE_ROOT}/SETOVERTIME`,
} as const;

type Init = {
  type: typeof ACTION_TYPE.INIT;
  payload: {
    request: LegalAgreementRequest;
  };
};

type Update = {
  type: typeof ACTION_TYPE.UPDATE;
  payload: {
    key: Keys;
    value: Values;
  };
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type SetOvertime = {
  type: typeof ACTION_TYPE.SETOVERTIME;
  payload: { overtime: YearlyOvertime; workSystem: WorkSystem };
};

type Action = Init | Update | Clear | SetOvertime;

export const actions = {
  initialize: (request: LegalAgreementRequest): Init => ({
    type: ACTION_TYPE.INIT,
    payload: {
      request,
    },
  }),
  update: (key: Keys, value: Values): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key,
      value,
    },
  }),
  clear: (): Clear => ({
    type: ACTION_TYPE.CLEAR,
  }),

  setOvertime: (
    overtime: YearlyOvertime,
    workSystem: WorkSystem
  ): SetOvertime => ({
    type: ACTION_TYPE.SETOVERTIME,
    payload: {
      overtime,
      workSystem,
    },
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      const { request } = (action as Init).payload;
      return {
        ...state,
        request: { ...request },
      };
    }

    case ACTION_TYPE.UPDATE: {
      const { request } = state;
      const { key, value } = (action as Update).payload;
      return {
        ...state,
        request: {
          ...request,
          [key]: value,
        },
      };
    }

    case ACTION_TYPE.CLEAR:
      return { ...initialState };

    case ACTION_TYPE.SETOVERTIME: {
      const { overtime, workSystem } = (action as SetOvertime).payload;
      return {
        ...state,
        overtime,
        workSystem,
      };
    }

    default:
      return state;
  }
}
