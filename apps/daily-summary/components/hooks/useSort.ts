import { useCallback, useState } from 'react';

type Sort = {
  sortKey: 'jobCode' | 'workCategoryCode' | 'taskTime' | null;
  order: 'asc' | 'desc';
  sort: (key: Sort['sortKey']) => void;
  unsort: () => void;
};

export const useSort = (initialOrder: Sort['order'] = 'desc'): Sort => {
  const [sortKey, setSortKey] = useState<Sort['sortKey']>(null);
  const [order, setOrder] = useState(initialOrder);

  const sort = useCallback(
    (key: Sort['sortKey']) => {
      if (sortKey !== key) {
        setSortKey(key);
        setOrder('desc');
        return;
      }
      setOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    },
    [sortKey, setSortKey, setOrder]
  );

  const unsort = useCallback(() => {
    setSortKey(null);
    setOrder('desc');
  }, [setOrder, setSortKey]);

  return { sortKey, order, sort, unsort };
};
