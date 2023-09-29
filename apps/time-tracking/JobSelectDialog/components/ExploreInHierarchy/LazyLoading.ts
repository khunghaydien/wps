import * as React from 'react';

import useAsyncGenerator from '../../hooks/useAsyncGenerator';

type Enumerable<T> = AsyncGenerator<T, void, void> | T[];

type Props<T> = {
  it: Enumerable<T>;
  children: React.FC<{ items: T[]; isDone: boolean }>;
};

async function* asAsyncGenerator<T>(items: T[]): AsyncGenerator<T, void, void> {
  for (const item of items) {
    yield item;
  }
}

const LazyLoading = <T>({ it, children }: Props<T>) => {
  const source = React.useMemo(() => {
    return Array.isArray(it) ? asAsyncGenerator(it) : it;
  }, [Array.isArray(it)]);

  const [items, isDone] = useAsyncGenerator<T>(source);

  return children({ items, isDone });
};

export default LazyLoading;
