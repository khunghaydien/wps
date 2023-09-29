import * as React from 'react';

import { addHours, endOfDay, isAfter, isSameDay, subMinutes } from 'date-fns';
import moment from 'moment';

import styled from 'styled-components';

import {
  ALL_DAY_EVENT_HEIGHT,
  HOURS_HEIGHT_ON_WEEKLY_CALENDAR as HOURS_HEIGHT,
  WEEKLY_CALENDAR_HEADER_HEIGHT as HEADER_MIN_HEIGHT,
} from '../../constants/calendar';

import msg from '../../../commons/languages';
import CalendarUtil from '../../../commons/utils/CalendarUtil';

import { EventViewModel } from '../../modules/entities/events';

import { toClosestToWeeklyCalendarsMinutes as toClosestValue } from '../../helpers';
import { Event } from './EventCard';
import TimeHorizontalRule from './TimeHorizontalRule';

type Props = Readonly<{
  today: Date;
  dayEvents: ReadonlyArray<ReadonlyArray<EventViewModel>>;
  weekDates: ReadonlyArray<Date>;
  allDayEventMaxRow: number;
  onClickNewEvent: (
    moment: moment.Moment,
    syntheticMouseEvent: React.MouseEvent,
    isAllDay?: boolean
  ) => void;
  onClickOpenEvent: (
    arg0: string,
    syntheticMouseEvent: React.MouseEvent
  ) => void;
}>;

const Calendar = styled.div<{ allDayEventMaxRow: number }>`
  position: absolute;
  display: grid;
  width: 100%;
  min-height: calc(100vh - ${HEADER_MIN_HEIGHT}px);
  background: #fff;
  border-bottom: 1px solid #ddd;
  grid-template-columns: 54px repeat(7, 1fr);
  ${({ allDayEventMaxRow }): string => {
    const top =
      allDayEventMaxRow > 0
        ? HEADER_MIN_HEIGHT + ALL_DAY_EVENT_HEIGHT * allDayEventMaxRow
        : HEADER_MIN_HEIGHT;
    return `top: ${top}px;`;
  }}
`;

const CalendarColumn = styled.div`
  position: relative;
  display: grid;
  height: 100%;
  border-right: 1px solid #ddd;
  overflow: hidden;
  grid-template-rows: repeat(24, ${HOURS_HEIGHT}px);

  &:last-child {
    border-right: none;
  }
`;

const GridRow = styled.div.attrs<{ row: number }>(({ row }) => ({
  style: {
    gridRow: `${row} / span 1`,
  },
}))<{ row: number }>`
  border-bottom: 1px solid #ddd;
`;

const Time = styled.div.attrs<{ row: number }>((props) => ({
  style: {
    gridColumn: `1 / span 1`,
    gridRow: `${props.row} / span 1`,
  },
}))<{ row: number }>`
  display: flex;
  justify-content: center;
  position: relative;
`;

const TimeText = styled.span`
  position: absolute;
  top: 44px;
  line-height: 13px;
  font-size: 10px;
  color: #666;
`;

const WeeklyCalendar: React.FC<Props> = (props: Props) => {
  return (
    <Calendar allDayEventMaxRow={props.allDayEventMaxRow}>
      <CalendarColumn>
        {[...Array(23)].map((_, row) => (
          <Time row={row + 1}>
            <TimeText>
              {CalendarUtil.format(
                new Date(props.today.getTime()).setHours(row + 1, 0),
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h24',
                } as Intl.DateTimeFormatOptions
              )}
            </TimeText>
          </Time>
        ))}
      </CalendarColumn>
      {[...Array(7)].map((_, day) => (
        <CalendarColumn>
          {[...Array(24)].map((__, hour) => (
            <GridRow
              row={hour + 1}
              onClick={(e): void =>
                props.onClickNewEvent(
                  moment(addHours(props.weekDates[day], hour)),
                  e
                )
              }
            />
          ))}
          {props.dayEvents[day].map((event) => (
            <Event
              top={toClosestValue(getStartTimeInMinutes(event))}
              // @ts-ignore
              left={event.left}
              // @ts-ignore
              width={event.width}
              height={toClosestValue(event.minutes)}
              onClick={(e): void => props.onClickOpenEvent(event.id, e)}
              hasJob={!!event.jobId}
              readonly={event.isReadOnly}
              isEditing={event.isEditing}
            >
              <span>
                {event.title || msg().Cal_Lbl_NoTitle}
                {toClosestValue(event.minutes) < HOURS_HEIGHT && (
                  <React.Fragment key="space">&nbsp;</React.Fragment>
                )}
              </span>
              <span>
                {CalendarUtil.format(event.startDateTime, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {toClosestValue(event.minutes) >= HOURS_HEIGHT &&
                  ` ${msg().Cal_Lbl_PeriodExpression} ${CalendarUtil.format(
                    event.endDateTime,
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}`}
              </span>
            </Event>
          ))}
        </CalendarColumn>
      ))}
      {props.weekDates.some((date) => isSameDay(date, props.today)) && (
        <TimeHorizontalRule date={props.today} />
      )}
    </Calendar>
  );
};

function getStartTimeInMinutes(event: EventViewModel): number {
  // 予定開始日の 23:30 の Date
  const at2330 = subMinutes(endOfDay(event.startDateTimeOfDay), 30);
  const isAfter2330 = isAfter(event.startDateTimeOfDay, at2330);

  if (isAfter2330) {
    // 23:30 以降の予定であれば、UI上の開始位置を23:30の位置にする
    return at2330.getHours() * 60 + at2330.getMinutes();
  }

  return (
    event.startDateTimeOfDay.getHours() * 60 +
    event.startDateTimeOfDay.getMinutes()
  );
}

export default WeeklyCalendar;
