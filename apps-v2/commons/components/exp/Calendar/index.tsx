import React, { FC } from 'react';

import { isSameDay } from 'date-fns';

import styled from 'styled-components';

import { HOURS_HEIGHT } from '@commons/constants/exp/calendar';

import withLoadingHOC from '@commons/components/withLoading';
import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';

import 'element-scroll-polyfill';
import AllDayEvents from './AllDayEvents';
import Event from './Event';
import Time from './Time';
import TimeHorizontalRule from './TimeHorizontalRule';
import { toDate } from '@apps/daily-summary/helper';

const S = {
  Wrapper: styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow-y: scroll;
  `,
  StickyItem: styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    background: #fff;
  `,
  TimeTable: styled.div`
    position: absolute;
    display: grid;
    width: 100%;
    background: #fff;
    grid-template-columns: 54px 1fr;
  `,
  CalendarColumn: styled.div`
    position: relative;
    display: grid;
    height: 100%;
    border-right: 1px solid #ddd;
    overflow: hidden;
    grid-template-rows: repeat(24, ${HOURS_HEIGHT}px);

    &:last-of-type {
      border-right: none;
    }
  `,
  GridRow: styled.div.attrs<{ row: number }>(({ row }) => ({
    style: {
      gridRow: `${row} / span 1`,
    },
  }))<{ row: number }>`
    border-bottom: 1px solid #ddd;

    /* 24 hours columns exist. */
    &:nth-of-type(24) {
      border-bottom: none;
    }
  `,
};
const useScrollIntoView = (allDayEvents = []) => {
  const offsetRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (offsetRef.current && scrollRef.current) {
      scrollRef.current.scroll(0, 0);
      scrollRef.current.scrollBy(0, offsetRef.current.clientHeight * -1);
    }
  }, allDayEvents);

  return [offsetRef, scrollRef];
};

type Props = {
  allDayEvents: BaseEvent[];
  allDayEventsCount: number;
  normalEvents: BaseEvent[];
  // hours
  scrollTo: number;
  targetDate: string;
  today?: Date;
  onClickEvent: (event: BaseEvent) => void;
};

const Calendar: FC<Props> = ({
  allDayEvents,
  allDayEventsCount,
  normalEvents,
  scrollTo,
  targetDate,
  today = new Date(),
  onClickEvent,
}) => {
  const [offsetRef, scrollRef] = useScrollIntoView([allDayEvents]);

  return (
    <S.Wrapper ref={scrollRef}>
      <S.StickyItem ref={offsetRef}>
        <AllDayEvents
          allDayEventsCount={allDayEventsCount}
          allDayEvents={allDayEvents}
          onClickEvent={onClickEvent}
        />
      </S.StickyItem>
      <div>
        <S.TimeTable>
          <S.CalendarColumn>
            {[...Array(23)].map((_, row) => (
              <Time hour={row + 1} key={row} />
            ))}
          </S.CalendarColumn>
          <S.CalendarColumn>
            {[...Array(24)].map((__, hour) =>
              hour === scrollTo ? (
                <S.GridRow row={hour + 1} key={hour} />
              ) : (
                <S.GridRow row={hour + 1} key={hour} />
              )
            )}
            {normalEvents.map((event) => (
              <Event event={event} key={event.id} onClickEvent={onClickEvent} />
            ))}
          </S.CalendarColumn>
          {isSameDay(today, toDate(targetDate)) && <TimeHorizontalRule />}
        </S.TimeTable>
      </div>
    </S.Wrapper>
  );
};

export default withLoadingHOC(Calendar);
