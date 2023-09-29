import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import ResizeObserver from 'resize-observer-polyfill';

import { State } from '../modules';
import { actions as eventListPopup } from '../modules/ui/eventListPopup';

import MoreLink from '../components/Calendar/MoreLink';

import { isAllDayEvent, toDate } from '../helper';

type OwnProps = Readonly<{
  id?: string;
}>;

const useResizeObserver = (
  callback: () => void,
  element: Element | null | undefined
) => {
  React.useLayoutEffect(() => {
    let observer = new ResizeObserver(callback);
    if (observer) {
      if (element) {
        observer.observe(element);
      }
      observer.observe(window.document.body);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
      // for GC
      observer = undefined;
    };
  }, [callback, element]);
};

const useRect = (ref: { current: Element | null | undefined }): ClientRect => {
  const getRect = (element?: Element | null | undefined) => {
    const defaultValue: ClientRect = {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    } as any;
    return element ? element.getBoundingClientRect() : defaultValue;
  };
  const [rect, setRect] = React.useState(getRect);
  const updateRect = React.useCallback(() => {
    setRect(getRect(ref.current));
  }, [ref.current]);
  useResizeObserver(updateRect, ref.current);
  return rect;
};

const MoreLinkContainer = (props: OwnProps) => {
  const dispatch = useDispatch();

  const date = useSelector((state: State) => state.ui.dailySummary.targetDate);
  const onClickOpenEventList = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Manually firing blur event is needed here since Keyboard Event does not provide positions.
      // If it were not, Event List is displayed at (0,0) of screen.
      e.currentTarget.blur();

      const { top, right } = e.currentTarget.getBoundingClientRect();
      dispatch(eventListPopup.open(toDate(date), top, right));
    },
    [dispatch, date]
  );

  const events = useSelector(
    (state: State) => state.entities.events.records,
    shallowEqual
  );
  const allDayEvents = React.useMemo(() => {
    return events.filter((event) => isAllDayEvent(event));
  }, [events]);

  const ref = React.useRef<any>();
  const rect = useRect(ref);
  React.useEffect(() => {
    dispatch(eventListPopup.move(rect.top, rect.right));
  }, [dispatch, rect]);

  return (
    <MoreLink
      {...props}
      ref={ref}
      onClick={onClickOpenEventList}
      eventsCount={allDayEvents.length}
    />
  );
};

export default MoreLinkContainer;
