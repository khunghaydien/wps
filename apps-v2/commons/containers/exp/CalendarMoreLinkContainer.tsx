import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import ResizeObserver from 'resize-observer-polyfill';

import { actions as eventListPopup } from '@commons/modules/exp/ui/eventListPopup';

import { State } from '../../modules';

import MoreLink from '../../components/exp/Calendar/MoreLink';

import { isAllDayEvent, toDate } from '@apps/daily-summary/helper';

type StateProps = {
  common: State;
};

type Props = Readonly<{
  id?: string;
}>;

const useResizeObserver = (
  callback: () => void,
  element: Element | null | undefined
) => {
  useLayoutEffect(() => {
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

const useRect = (ref: { current: Element | null | undefined }): DOMRect => {
  const getRect = (element?: Element | null | undefined) => {
    const defaultValue = {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => JSON.stringify(''),
    };
    return element ? element.getBoundingClientRect() : defaultValue;
  };
  const [rect, setRect] = useState(getRect);
  const updateRect = useCallback(() => {
    setRect(getRect(ref.current));
  }, [ref.current]);
  useResizeObserver(updateRect, ref.current);
  return rect;
};

const MoreLinkContainer: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const date = useSelector(
    (state: StateProps) => state.common.exp.entities.events.targetDate
  );
  const events = useSelector(
    (state: StateProps) => state.common.exp.entities.events.records,
    shallowEqual
  );

  const allDayEvents = useMemo(() => {
    return events.filter((event) => isAllDayEvent(event));
  }, [events]);

  const onClickOpenEventList = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // Manually firing blur event is needed here since Keyboard Event does not provide positions.
      // If it were not, Event List is displayed at (0,0) of screen.
      e.currentTarget.blur();

      const { top, right } = e.currentTarget.getBoundingClientRect();
      dispatch(eventListPopup.open(toDate(date), top, right));
    },
    [dispatch, date]
  );

  const ref = useRef();
  const rect = useRect(ref);
  useEffect(() => {
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
