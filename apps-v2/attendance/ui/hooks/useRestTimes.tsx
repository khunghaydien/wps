import * as React from 'react';

import nanoid from 'nanoid';

import * as DomainRestTime from '@attendance/domain/models/RestTime';

import $createRestTimeFactory from '@attendance/domain/factories/RestTimesFactory';

const ACTION_TYPES = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
} as const;

type RestTimeWithId<TRestTime extends DomainRestTime.RestTime> = {
  id: string;
} & TRestTime;

const useRestTimes = <
  TRestTime extends DomainRestTime.RestTime = DomainRestTime.RestTime
>({
  restTimes,
  maxLength,
  updateRestTimesHandler,
  createRestTimeHandler,
}: {
  restTimes: TRestTime[];
  maxLength?: number;
  updateRestTimesHandler: (restTimes: TRestTime[]) => void;
  createRestTimeHandler?: (...args: unknown[]) => TRestTime;
}): [
  RestTimeWithId<TRestTime>[],
  {
    update: (
      index: number,
      key: keyof TRestTime,
      value: TRestTime[typeof key]
    ) => void;
    add: () => void;
    remove: (index: number) => void;
  }
] => {
  const create = React.useCallback(
    (restTime?: TRestTime) =>
      ({
        ...restTime,
        ...DomainRestTime.create(restTime),
        id: nanoid(8),
      } as unknown as RestTimeWithId<TRestTime>),
    []
  );

  const initialize = React.useCallback(
    (restTimes: TRestTime[]) => restTimes.map(create),
    [create]
  );

  const RestTimeFactory: DomainRestTime.IRestTimeFactory<
    RestTimeWithId<TRestTime>
  > = React.useMemo(
    () => ({
      create: (...args: unknown[]) => ({
        ...create(
          createRestTimeHandler ? createRestTimeHandler(...args) : undefined
        ),
      }),
    }),
    [create, createRestTimeHandler]
  );

  const RestTimesFactory = React.useMemo(
    () =>
      $createRestTimeFactory(RestTimeFactory)({
        maxLength: maxLength ?? DomainRestTime.MAX_STANDARD_REST_TIME_COUNT,
      }),
    [RestTimeFactory, maxLength]
  );

  const actions = React.useMemo(
    () => ({
      update: (
        index: number,
        key: keyof TRestTime,
        value: TRestTime[typeof key]
      ) => ({
        type: ACTION_TYPES.UPDATE,
        payload: { index, key, value },
      }),
      add: () => ({
        type: ACTION_TYPES.ADD,
      }),
      remove: (index: number) => ({
        type: ACTION_TYPES.REMOVE,
        payload: index,
      }),
    }),
    []
  );

  const [state, dispatch] = React.useReducer(
    (
      state: RestTimeWithId<TRestTime>[] = [],
      action: Action<typeof actions>
    ): RestTimeWithId<TRestTime>[] => {
      switch (action.type) {
        case ACTION_TYPES.UPDATE: {
          const { index, key, value } = action.payload;
          const restTime = state?.at(index);
          if (!restTime) {
            return state;
          }
          return RestTimesFactory.update(state, index, {
            ...restTime,
            [key]: value,
          });
        }
        case ACTION_TYPES.ADD: {
          return RestTimesFactory.push(state);
        }
        case ACTION_TYPES.REMOVE: {
          const index = action.payload;
          return RestTimesFactory.remove(state, index);
        }
        default:
          return state;
      }
    },
    restTimes,
    initialize
  );

  const update = React.useCallback(
    (index: number, key: keyof TRestTime, value: TRestTime[typeof key]) => {
      dispatch(actions.update(index, key, value));
    },
    [actions]
  );

  const add = React.useCallback(() => {
    dispatch(actions.add());
  }, [actions]);

  const remove = React.useCallback(
    (index: number) => {
      dispatch(actions.remove(index));
    },
    [actions]
  );

  React.useEffect(() => {
    updateRestTimesHandler(
      state.map(({ id: _, ...restTime }) => restTime as unknown as TRestTime)
    );
  }, [state]);

  return [
    state,
    {
      add,
      remove,
      update,
    },
  ];
};

export default useRestTimes;
