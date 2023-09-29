/* eslint-disable @typescript-eslint/ban-types */
import reduce from 'lodash/reduce';
import uuid from 'uuid';

import Collection from '@attendance/libraries/Collection';
import * as Event from '@attendance/libraries/Event';

export const PUBLICATION_STATE = {
  PROCEED: 'Proceed',
  STOPPED: 'Stopped',
} as const;

type PublicationState = Value<typeof PUBLICATION_STATE>;

type UseCase = (...args: unknown[]) => Promise<unknown>;

type WrappedUseCase<T extends UseCase> = T & {
  eventName: string;
  subscribe: (
    callback: (data: PromiseType<ReturnType<T>>) => void
  ) => () => void;
  state: () => PublicationState;
  startPublication: () => void;
  stopPublication: () => void;
  stopPublicationOnce: () => void;
};

type UseCaseCollection<T extends Record<string, UseCase>> = {
  [P in keyof T]: WrappedUseCase<T[P]>;
};

const wrap = <U extends UseCase>(
  $useCase: U,
  key: string
): WrappedUseCase<U> => {
  let stoppedOnce = false;
  let state: PublicationState = PUBLICATION_STATE.PROCEED;
  const eventName = `${key}-${uuid()}` as const;
  const event = Event.create<PromiseType<ReturnType<U>>>(eventName);
  const useCase = async (...args) => {
    try {
      const result = await $useCase(...args);
      if (state === PUBLICATION_STATE.PROCEED) {
        event.publish(result as PromiseType<ReturnType<U>>);
      }
      return result;
    } finally {
      if (stoppedOnce) {
        useCase.startPublication();
      }
    }
  };
  useCase.eventName = eventName;
  useCase.subscribe = event.subscribe;
  useCase.state = () => state;
  useCase.startPublication = () => {
    state = PUBLICATION_STATE.PROCEED;
    stoppedOnce = false;
  };
  useCase.stopPublication = () => {
    state = PUBLICATION_STATE.STOPPED;
  };
  useCase.stopPublicationOnce = () => {
    useCase.stopPublication();
    stoppedOnce = true;
  };
  return useCase as WrappedUseCase<U>;
};

const compose = <
  T extends Record<string, UseCase>,
  U extends UseCaseCollection<T>
>(
  records: T
): U =>
  reduce(
    records,
    (obj, record, key) => {
      obj[key] = wrap(record as unknown as UseCase, key);
      return obj;
    },
    {}
  ) as U;

export default <
  OriginalUseCase extends Record<string, UseCase>,
  UseCases extends UseCaseCollection<OriginalUseCase> = UseCaseCollection<OriginalUseCase>
>(
  name = 'UseCaseCollection'
): {
  register: (collections: OriginalUseCase) => void;
  (): UseCases;
} => {
  const service = Collection<UseCases>(name);
  const register = (collections: OriginalUseCase): void => {
    const $collection = compose<OriginalUseCase, UseCases>(collections);
    service.register($collection);
  };

  const method = () => service();
  method.register = register;

  return method;
};
