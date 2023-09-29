/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import reduce from 'lodash/reduce';

export default <Collection>(
  collectionName: string
): {
  register: (collection: Collection) => void;
  (): Collection;
} => {
  let $collection: Collection;
  const method = () => {
    if (!$collection) {
      throw new Error(`${collectionName} is not initialized.`);
    }
    return $collection;
  };

  method.register = (collection) => {
    $collection = collection;
  };

  return method;
};

type BoundType<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any) => any
    ? ReturnType<T[K]>
    : T[K] extends object
    ? BoundType<T[K]>
    : never;
};

export const bind = <T extends object>(
  collection: T,
  args0: any
): BoundType<T> =>
  reduce(
    collection,
    (obj, record, key) => {
      if (typeof record === 'function') {
        obj[key] = record(args0);
      } else {
        obj[key] = bind(record as unknown as object, args0);
      }
      return obj;
    },
    {} as BoundType<T>
  );
