import React, { useEffect } from 'react';

async function* chunk<T>(
  it: AsyncGenerator<T, void, void>,
  size: number,
  initialChunkSize: number
): AsyncGenerator<T[], void, void> {
  let arr = [];
  let chunkSize = initialChunkSize;
  for await (const x of it) {
    arr.push(x);
    if (arr.length >= chunkSize) {
      yield arr;
      arr = [];
      chunkSize = size;
    }
  }
  yield arr;
}

function useAsyncGenerator<T>(
  it: AsyncGenerator<T, void, void>
): [T[], boolean] {
  const isMounted = React.useRef(true);
  const [items, setItems] = React.useState<T[]>([]);
  const [isDone, setIsDone] = React.useState<boolean>(false);
  const [_state, setState] = React.useState();

  useEffect(() => {
    const timeout = setTimeout(async function () {
      try {
        for await (const xs of chunk(it, 1000, 30)) {
          if (isMounted.current) {
            setItems((is) => [...is, ...xs]);
          }
        }
        if (isMounted.current) {
          setIsDone((_) => true);
        }
      } catch (e) {
        setState(() => {
          // idiom to catch thrown errors from hooks in error boundary
          throw e;
        });
      }
    }, 0);
    return (): void => {
      isMounted.current = false;
      it.return();
      clearTimeout(timeout);
    };
  }, []);

  return [items, isDone];
}

export default useAsyncGenerator;
