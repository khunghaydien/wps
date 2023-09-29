import * as RestTime from '@attendance/domain/models/RestTime';

export default <T extends RestTime.RestTime = RestTime.RestTime>(
    restTimeFactory: RestTime.IRestTimeFactory<T> = {
      create: (...args) => RestTime.create(...args) as T,
    }
  ) =>
  (
    {
      maxLength,
    }: {
      maxLength: number;
    } = {
      maxLength: RestTime.MAX_STANDARD_REST_TIME_COUNT,
    }
  ): RestTime.IRestTimesFactory<T> => ({
    maxLength,
    create: () => [],
    filter: (restTimes) => restTimes.filter(RestTime.hasValue),
    update: (restTimes, idx, value) => {
      const arr = [...restTimes];
      arr.splice(idx, 1, {
        ...value,
      });
      return arr;
    },
    insert: (restTimes, idx, value = restTimeFactory.create()) => {
      const arr = [...restTimes];
      arr.splice(idx, 0, value);
      return arr;
    },
    remove: (restTimes, idx) => {
      const arr = [...restTimes];
      arr.splice(idx, 1);
      return arr;
    },
    push: (restTimes, value = restTimeFactory.create()) => {
      const arr = [...restTimes];
      if (arr.length < maxLength) {
        arr.push({ ...value });
      }
      return arr;
    },
    pushLast: (restTimes) => {
      const arr = [...restTimes];
      if (
        arr.length < maxLength &&
        (arr.length === 0 || RestTime.hasValue(arr.at(-1)))
      ) {
        arr.push(restTimeFactory.create());
      }
      return arr;
    },
  });
