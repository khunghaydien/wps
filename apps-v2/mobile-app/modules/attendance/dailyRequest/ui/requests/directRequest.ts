import nanoid from 'nanoid';

import * as DomainDirectRequest from '@attendance/domain/models/AttDailyRequest/DirectRequest';

import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

const createRestTimesFactory = $createRestTimesFactory();

export type RestTime =
  DomainDirectRequest.DirectRequest['directApplyRestTimes'][number] & {
    id: string;
  };

export type RestTimes = RestTime[];

export type DirectRequest = Omit<
  DomainDirectRequest.DirectRequest,
  'directApplyRestTimes'
> & {
  directApplyRestTimes: RestTimes;
};

export type State = {
  request: DirectRequest | null;
};

export const initialState: State = {
  request: null,
};

type Keys = keyof DirectRequest;

type Values = DirectRequest[keyof DirectRequest];

const ACTION_TYPE_ROOT =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/DIRECT_REQUEST' as const;

const ACTION_TYPE = {
  INITIALIZE: `${ACTION_TYPE_ROOT}/INITIALIZE`,
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INITIALIZE;
  payload: {
    request: DomainDirectRequest.DirectRequest;
    maxRestTimesCount: number;
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

type Action = Initialize | Update | Clear;

export const INITIALIZE: Initialize['type'] = ACTION_TYPE.INITIALIZE;

export const UPDATE: Update['type'] = ACTION_TYPE.UPDATE;

export const CLEAR: Clear['type'] = ACTION_TYPE.CLEAR;

export const appendId = <T>(record: T) => ({ ...record, id: nanoid(8) });

export const actions = {
  initialize: (
    request: DomainDirectRequest.DirectRequest,
    maxRestTimesCount: number
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      maxRestTimesCount,
    },
  }),

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
  }),

  clear: (): Clear => ({
    type: CLEAR,
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request, maxRestTimesCount } = action.payload;
      const RestTimesFactory = createRestTimesFactory({
        maxLength: maxRestTimesCount,
      });
      return {
        request: {
          ...request,
          directApplyRestTimes: RestTimesFactory.pushLast(
            request.directApplyRestTimes
          ).map(appendId),
        },
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          request: {
            ...request,
            [key]: value,
          },
        };
      }
    }

    case CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
