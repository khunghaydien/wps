import { useCallback, useMemo, useState } from 'react';

import orderBy from 'lodash/orderBy';
import take from 'lodash/take';
import nanoid from 'nanoid';

type Iterable<T> = AsyncGenerator<T, void, void> | Array<T>;

type SearchQuery<T> = Readonly<{ parent: T | undefined; codeOrName: string }>;

interface Leveled<T> {
  key: string;
  level: number;
  value: Iterable<T>;
  searchQuery: SearchQuery<T>;
}

type LeveledItems<T> = Leveled<T>;

interface LevelState<T> {
  readonly state: readonly LeveledItems<T>[];
  readonly current: T | null | undefined;
  readonly selectedItems: readonly T[];
  select: (level: number, item: T) => void;
  search: (key: string, parent: T | undefined, codeOrName: string) => void;
  clear: () => void;
  initialize: () => () => void;
}

interface Options<T> {
  searchChildren: (arg0: { parent?: T; codeOrName?: string }) => Iterable<T>;
}

export const useLevelState = <T extends { hasChildren: boolean }>(
  options: Options<T>
): LevelState<T> => {
  const [state, setState] = useState<readonly LeveledItems<T>[]>([]);
  const [selectedItems, setSelectedItems] = useState<readonly T[]>([]);
  const [current, setCurrent] = useState<T>(null);

  // The reference of options is always changed since it is created
  // everytime the component is rendered.
  // So it requires to memoize options only once.
  const { searchChildren } = useMemo(() => options, []);

  const defaultSearchQuery: SearchQuery<T> = {
    parent: undefined,
    codeOrName: '',
  };

  const setFirstLevel = useCallback(
    (children: Iterable<T>, codeOrName = ''): void => {
      setState([
        {
          level: 0,
          value: children,
          key: nanoid(),
          searchQuery: { ...defaultSearchQuery, codeOrName },
        },
      ]);
    },
    []
  );

  const setLevel = useCallback((parentLevel: number, parent: T): void => {
    setSelectedItems((selectedItems: readonly T[]) => [
      ...take(selectedItems, parentLevel),
      parent,
    ]);
    setCurrent(parent);
  }, []);

  const setChildren = useCallback(
    (
      parentLevel: number,
      children: Iterable<T>,
      searchQuery: SearchQuery<T>
    ) => {
      setState((state: readonly LeveledItems<T>[]) => {
        return orderBy(
          [
            ...state.filter((items) => items.level < parentLevel + 1),
            {
              level: parentLevel + 1,
              value: children,
              key: nanoid(),
              searchQuery,
            },
          ],
          (items) => items.level
        );
      });
    },
    []
  );

  const unsetChildren = useCallback((parentLevel: number) => {
    setState((state: readonly LeveledItems<T>[]) => {
      return orderBy(
        [...state.filter((items) => items.level < parentLevel + 1)],
        (items) => items.level
      );
    });
  }, []);

  const updateState = useCallback(
    async (parentLevel?: number, parent?: T) => {
      if (!parentLevel && !parent) {
        const children = await searchChildren({ parent });
        setFirstLevel(children);
      } else {
        setLevel(parentLevel, parent);
        if (parent.hasChildren) {
          const children = await searchChildren({ parent });
          setChildren(parentLevel, children, {
            ...defaultSearchQuery,
            parent,
          });
        } else {
          unsetChildren(parentLevel);
        }
      }
    },
    [searchChildren, setChildren, setFirstLevel, setLevel, unsetChildren]
  );

  const select = useCallback(updateState, [updateState]);

  const clear = useCallback(() => {
    setSelectedItems([]);
    setCurrent(null);
    setState([]);
  }, []);

  const search = useCallback(
    async (key: string, parent: T | undefined, codeOrName: string) => {
      const children = await searchChildren({ parent, codeOrName });
      if (parent) {
        const parentLevel =
          state.findIndex((leveledItem) => leveledItem.key === key) - 1;
        setLevel(parentLevel, parent);
        setChildren(parentLevel, children, { parent, codeOrName });
      } else {
        clear();
        setFirstLevel(children, codeOrName);
      }
    },
    [state, searchChildren, setLevel, setChildren, clear, setFirstLevel]
  );

  const initialize = useCallback(() => {
    updateState();
    return clear;
  }, [updateState, clear]);

  return {
    state,
    select,
    selectedItems,
    search,
    clear,
    current,
    initialize,
  };
};
