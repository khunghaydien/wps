import { useCallback, useMemo, useState } from 'react';

import isNil from 'lodash/isNil';

type Item<T> = {
  level: number;
  item: T;
};

export interface Breadcrumb<T extends { id: string }> {
  reset: () => void;
  visit: (level: number, item?: T) => void;
  leave: (level: number) => void;
  isVisited: (item: T) => boolean;
  current: T | null | undefined;
}

const useBreadcrumb = <T extends { id: string }>(): Breadcrumb<T> => {
  const [visitedItems, setVisitedItems] = useState<Item<T>[]>([]);
  const reset = useCallback(() => {
    setVisitedItems((_) => []);
  }, []);
  const visit = useCallback((level: number, item?: T): void => {
    setVisitedItems((oldVisitedItems: Item<T>[]) => {
      if (isNil(item)) {
        return [];
      }

      const found = oldVisitedItems.find((visited) => visited.level === level);
      if (found) {
        const newVisitedItems = oldVisitedItems.filter(
          (visited) => visited.level < found.level
        );
        return [{ level, item }, ...newVisitedItems];
      } else {
        return [{ level, item }, ...oldVisitedItems];
      }
    });
  }, []);
  const leave = useCallback((level: number) => {
    setVisitedItems((oldVisitedItems: Item<T>[]) =>
      oldVisitedItems.filter((item) => item.level < level)
    );
  }, []);
  const isVisited = useCallback(
    (item: T): boolean => {
      return visitedItems.map((visited) => visited.item.id).includes(item.id);
    },
    [visitedItems]
  );
  const current = useMemo(() => {
    const [head, ..._] = visitedItems;
    return head ? head.item : null;
  }, [visitedItems]);

  return {
    reset,
    visit,
    leave,
    isVisited,
    current,
  };
};

export default useBreadcrumb;
