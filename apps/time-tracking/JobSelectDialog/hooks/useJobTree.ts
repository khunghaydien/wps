import { useCallback, useState } from 'react';

import take from 'lodash/take';
import nanoid from 'nanoid';

import { Jobable } from '@apps/domain/models/time-tracking/Job';

type SearchQuery<T> = {
  parent?: T | undefined;
  codeOrName: string;
};

type KeyedArray<T> = {
  key: string;
  value: AsyncGenerator<T, void, void> | Array<T>;
  searchQuery: SearchQuery<T>;
};

interface JobTreeState<T extends { id: string }> {
  readonly state: ReadonlyArray<KeyedArray<T>>;
  getLevelByKey: (key: string) => number;
  append: (arg0: AsyncGenerator<T, void, void>, arg1: SearchQuery<T>) => void;
  remove: (key: string) => void;
  removeBelow: (key: string) => void;
  reset: () => void;
}

export type JobTree<T extends Jobable> = JobTreeState<T>['state'];

const useJobTree = <T extends Jobable>(): JobTreeState<T> => {
  const [tree, setTree] = useState<JobTree<T>>([]);
  const append = useCallback(
    (target: AsyncGenerator<T, void, void>, searchQuery: SearchQuery<T>) => {
      const key = nanoid();
      setTree((ts: JobTree<T> = []) => {
        return [...ts, { key, value: target, searchQuery }];
      });
    },
    []
  );
  const getLevelByKey = useCallback(
    (key: string) => tree.findIndex((jobs) => jobs.key === key),
    [tree]
  );
  const remove = useCallback((key: string) => {
    setTree((ts: JobTree<T> = []) => {
      const index = ts.findIndex((jobs) => jobs.key === key);
      return index > -1 ? [...take(ts, index)] : ts;
    });
  }, []);
  const removeBelow = useCallback((key: string) => {
    setTree((ts: JobTree<T> = []) => {
      const index = ts.findIndex((jobs) => jobs.key === key);
      return index > -1 ? [...take(ts, index + 1)] : ts;
    });
  }, []);
  const reset = useCallback(() => {
    setTree((_) => []);
  }, []);
  return {
    state: tree,
    getLevelByKey,
    append,
    remove,
    removeBelow,
    reset,
  };
};

export default useJobTree;
