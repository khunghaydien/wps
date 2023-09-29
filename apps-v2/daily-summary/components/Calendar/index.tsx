import React from 'react';

import { isSameDay } from 'date-fns';

import styled from 'styled-components';

import { HOURS_HEIGHT } from '../../constants/calendar';

import { BaseEvent } from '../../../commons/models/DailySummary/BaseEvent';

import 'element-scroll-polyfill';
import { toDate } from '../../helper';
import AllDayEvents from './AllDayEvents';
import Event from './Event';
import Time from './Time';
import TimeHorizontalRule from './TimeHorizontalRule';

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
const useScrollIntoView = (inputs: any[] = []) => {
  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const offsetRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (targetRef.current && offsetRef.current && scrollRef.current) {
      scrollRef.current.scroll(0, 0);
      targetRef.current.scrollIntoView();
      scrollRef.current.scrollBy(0, offsetRef.current.clientHeight * -1);
    }
  }, inputs);

  return [targetRef, offsetRef, scrollRef];
};

type Props = {
  allDayEventsCount: number;
  allDayEvents: BaseEvent[];
  normalEvents: BaseEvent[];
  // hours
  scrollTo: number;
  targetDate: string;
  today?: Date;
};

const Calendar = ({ today = new Date(), ...props }: Props) => {
  const [targetRef, offsetRef, scrollRef] = useScrollIntoView([
    props.allDayEvents,
  ]);

  return (
    <S.Wrapper ref={scrollRef}>
      <S.StickyItem ref={offsetRef}>
        <AllDayEvents
          allDayEventsCount={props.allDayEventsCount}
          allDayEvents={props.allDayEvents}
        />
      </S.StickyItem>
      <div>
        {/*
        // @ts-ignore remove this property */}
        <S.TimeTable allDayEventMaxRow={props.allDayEventsCount}>
          <S.CalendarColumn>
            {[...Array(23)].map((_, row) => (
              <Time hour={row + 1} key={row} />
            ))}
          </S.CalendarColumn>
          <S.CalendarColumn>
            {[...Array(24)].map((__, hour) =>
              hour === props.scrollTo ? (
                <S.GridRow row={hour + 1} ref={targetRef} key={hour} />
              ) : (
                <S.GridRow row={hour + 1} key={hour} />
              )
            )}
            {props.normalEvents.map((event) => (
              <Event event={event} key={event.id} />
            ))}
          </S.CalendarColumn>
          {isSameDay(today, toDate(props.targetDate)) && <TimeHorizontalRule />}
        </S.TimeTable>
      </div>
    </S.Wrapper>
  );
};

export default Calendar;
