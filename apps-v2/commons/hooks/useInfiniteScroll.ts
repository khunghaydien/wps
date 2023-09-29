import { MutableRefObject, useEffect, useRef, useState } from 'react';

type Props = {
  hasMore: boolean; // if turn off, will stop watching intersection changes
  reset?: boolean; // if is true, will reset page to 0
};

/**
 * When target is intersecting with container, switch to a new page and load more items.
 *
 * @example
 * const [listItems, setListItems] = useState([]);
 * const [hasMore, setHasMore] = useState(true);
 * const [loaderRef, containerRef, page] = useInfiniteScroll({ hasMore });
 *
 * useEffect(() => {
 *   // when page change, fetch new items and turn on/off hasMore accordingly
 *    setListItems([...listItems, ...newItems]);
 *    setHasMore(hasMore);
 * }, [page])
 *
 * return (
 *   <div ref={containerRef}>
 *     {listItems.map(item => ...)}  // render list items
 *     <div ref={loaderRef}>Loading…</div>}  // render loader (target)
 *   </div>
 * );
 */
const useInfiniteScroll = (
  props: Props
): [
  MutableRefObject<HTMLDivElement>,
  MutableRefObject<HTMLDivElement>,
  number
] => {
  const loaderRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();
  const containerRef: MutableRefObject<HTMLDivElement> =
    useRef<HTMLDivElement>();
  const [page, setPage] = useState(0);
  const { hasMore, reset } = props;

  if (reset && page !== 0) {
    setPage(0);
  }

  useEffect(() => {
    const loader = loaderRef.current;
    const container = containerRef.current;

    if (!loader || !container) {
      return;
    }

    const options = {
      root: container,
      rootMargin: '0px',
      threshold: 0,
    };

    let previousY;
    let previousRatio = 0;

    const callback = (entries) => {
      entries.forEach(
        ({ isIntersecting, intersectionRatio, boundingClientRect = {} }) => {
          const { y } = boundingClientRect as any;
          if (
            isIntersecting &&
            (!previousY || previousY > y) &&
            intersectionRatio >= previousRatio
          ) {
            setPage((page) => page + 1);
          }
          previousY = y;
          previousRatio = intersectionRatio;
        }
      );
    };

    const observer = new IntersectionObserver(
      callback,
      options as IntersectionObserverInit
    );
    observer.observe(loader as HTMLElement);

    if (!hasMore) {
      observer.disconnect();
    }

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, [hasMore]);

  return [loaderRef, containerRef, page];
};

export default useInfiniteScroll;
