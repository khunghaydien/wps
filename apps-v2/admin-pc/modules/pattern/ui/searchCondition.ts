import { SearchCondition } from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import * as WorkingType from '@attendance/domain/models/WorkingType';

import ROOT from './actionType';

export type Condition = Omit<
  SearchCondition,
  'companyId' | 'codes' | 'isSearchCodeForPartialMatch'
> & { code: string };

// 表示側の問題（admin-pc 配下に限った設計上の問題）で WORK_SYSTEM_TYPE を変更しています。
// 問題はドメインに関係ないので ViewModel に近い modules に置くことにしました。
export const WORK_SYSTEM_TYPE = {
  ...WorkingType.WORK_SYSTEM_TYPE,
  JP_Flex_Without_Core: 'JP:FlexWithoutCore',
} as const;

type State = {
  origin: Condition;
  new: Condition;
};

export const initCondition = {
  targetDate: null,
  code: null,
  name: null,
  workSystem: null,
  withoutCore: null,
};

export const initialState: State = {
  origin: initCondition,
  new: initCondition,
};

export const ACTION_TYPE = {
  INIT: `${ROOT}/SEARCH_CONDITION/INITIALIZE`,
  SET_ORIGIN: `${ROOT}/SEARCH_CONDITION/SET_ORIGIN`,
  SET_NEW: `${ROOT}/SEARCH_CONDITION/SET_NEW`,
} as const;

// Actions
type Initialize = {
  type: typeof ACTION_TYPE.INIT;
  payload?: State;
};

type SetOrigin = {
  type: typeof ACTION_TYPE.SET_ORIGIN;
  payload: State['origin'];
};

type SetNew = {
  type: typeof ACTION_TYPE.SET_NEW;
  payload: {
    key: string;
    value: string;
  };
};

type Action = Initialize | SetOrigin | SetNew;

export const actions = {
  initialize: (values?: State) => ({
    type: ACTION_TYPE.INIT,
    payload: values,
  }),
  setOrigin: (values: State['origin']) => ({
    type: ACTION_TYPE.SET_ORIGIN,
    payload: values,
  }),
  setNew: (key: string, value: string): SetNew => ({
    type: ACTION_TYPE.SET_NEW,
    payload: {
      key,
      value,
    },
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT:
      return (action as Initialize).payload || initialState;

    case ACTION_TYPE.SET_ORIGIN:
      return {
        ...state,
        origin: (action as SetOrigin).payload,
      };

    case ACTION_TYPE.SET_NEW: {
      const { key, value } = (action as SetNew).payload;

      let withoutCore = state.new.withoutCore;
      if (key === 'workSystem') {
        if (value) {
          if (value === WORK_SYSTEM_TYPE.JP_Flex) {
            withoutCore = false;
          } else if (value === WORK_SYSTEM_TYPE.JP_Flex_Without_Core) {
            withoutCore = true;
          } else {
            withoutCore = null;
          }
        } else {
          withoutCore = null;
        }
      }

      return {
        ...state,
        new: {
          ...state.new,
          [key]: value,
          withoutCore,
        },
      };
    }

    default:
      return state;
  }
};
