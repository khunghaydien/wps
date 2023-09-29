import * as React from 'react';

import { isSameDay } from 'date-fns';
import moment from 'moment';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import {
  ALL_DAY_EVENT_HEIGHT,
  MAX_ALL_DAY_EVENT,
  WEEKLY_CALENDAR_HEADER_HEIGHT as HEADER_MIN_HEIGHT,
} from '../../constants/calendar';

import Tooltip from '../../../commons/components/Tooltip';
import msg from '../../../commons/languages';
import CalendarUtil from '../../../commons/utils/CalendarUtil';
import DateUtil from '../../../commons/utils/DateUtil';
import TextUtil from '../../../commons/utils/TextUtil';
import { AddButton, LinkButton } from '../../../core';

import { EventViewModel } from '../../modules/entities/events';

import DailySummaryTriggerContainer from '../../containers/DailySummaryTriggerContainer';
import TimeTrackAlert from '../../containers/Notifications/TimeTrackAlertContainer';

import { doesHiddenEventsExist } from '../../helpers';
import { AllDayEvent } from './EventCard';

type Props = Readonly<{
  today: Date;
  allDayEventsByDay: ReadonlyArray<ReadonlyArray<EventViewModel>>;
  allDayEvents: ReadonlyArray<EventViewModel>;
  weekDates: ReadonlyArray<Date>;
  allDayEventLayouts: {
    [K in string]: number;
  };
  allDayEventMaxRow: number;
  useWorkTime: boolean;
  onClickNewEvent: (
    moment: moment.Moment,
    syntheticMouseEvent: React.MouseEvent,
    isAllDay?: boolean
  ) => void;
  onClickOpenEvent: (
    arg0: string,
    syntheticMouseEvent: React.MouseEvent
  ) => void;
  onClickOpenEventList: (date: Date, e: React.MouseEvent) => void;
}>;

const StickyItem = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  background: #fff;
`;

const Header = styled.div<{ maxRow: number }>`
  display: grid;
  grid-template-columns: 54px repeat(7, 1fr);
  min-height: ${HEADER_MIN_HEIGHT}px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  grid-template-rows: ${HEADER_MIN_HEIGHT}px;
  ${({ maxRow }): string =>
    maxRow > 0 &&
    `grid-template-rows: ${HEADER_MIN_HEIGHT}px repeat(${maxRow}, ${ALL_DAY_EVENT_HEIGHT}px);`}
`;

type WeekItemProps = {
  column: number;
  row: number;
  isToday?: boolean;
  style?: Record<string, string>;
};

const WeekItem = styled.div.attrs<WeekItemProps>(({ column, row }) => ({
  style: {
    gridColumn: `${column} / span 1`,
    gridRow: `${row} / span 5`,
  },
}))<WeekItemProps>`
  border-right: ${(props): string =>
    props.column === 8 ? 'none' : '1px solid #ddd'};
  ${(props): FlattenSimpleInterpolation | string =>
    props.isToday
      ? css`
          background: #e5f3ff;
        `
      : ''}
`;

const ColumnHeader = styled.div`
  position: relative;
  height: ${HEADER_MIN_HEIGHT}px;
  font-size: 10px;
  line-height: 18px;
`;

const DateView = styled.div<{
  isSunday?: boolean;
  isSaturday?: boolean;
  isToday?: boolean;
  useWorkTime?: boolean;
}>`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: ${({ isSunday, isSaturday, isToday }): string => {
    if (isSunday) {
      return '#d97474';
    } else if (isSaturday) {
      return '#4d97d9';
    } else if (isToday) {
      return '#006dcc';
    }
    return '#666';
  }};

  &:hover {
    background: ${({ useWorkTime }): string =>
      useWorkTime ? '#f3f2f2;' : 'none'};
    cursor: ${({ useWorkTime }): string =>
      useWorkTime ? 'pointer' : 'default'};
  }
`;

const Notifications = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 4px;
`;

const EventRegisterButton = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 4px;
`;

const More = styled.div.attrs<{
  column: number;
}>((props) => ({
  style: {
    gridColumn: `${props.column} / span 1`,
    gridRow: `5 / span 1`,
  },
}))<{
  column: number;
}>`
  margin-right: 9px;
  width: fit-content;
  cursor: pointer;
`;

const StyledLinkButton = styled(LinkButton)`
  padding: 1px 0 2px 7px;
`;

const WeekDay = styled.span`
  text-transform: uppercase;
`;

const Day = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const AllDayEvents: React.FC<Props> = (props: Props) => {
  return (
    <StickyItem>
      <Header maxRow={props.allDayEventMaxRow}>
        {/* Empty cell */}
        <WeekItem style={{ cursor: 'default' }} row={1} column={1} />
        {props.weekDates.map((day, i) => {
          const isSunday = day.getDay() === 0;
          const isSaturday = day.getDay() === 6;
          const isToday = isSameDay(day, props.today);
          return (
            <WeekItem row={1} column={i + 2} isToday={isToday}>
              <ColumnHeader as={DailySummaryTriggerContainer} date={day}>
                <Notifications>
                  <TimeTrackAlert date={day} />
                </Notifications>
                <EventRegisterButton>
                  <AddButton
                    onClick={(e): void => {
                      e.stopPropagation();
                      props.onClickNewEvent(moment(day), e, true);
                    }}
                  />
                </EventRegisterButton>
                <DateView
                  isSunday={isSunday}
                  isSaturday={isSaturday}
                  isToday={isToday}
                  useWorkTime={props.useWorkTime}
                >
                  <WeekDay>{DateUtil.formatW(day.toISOString())}</WeekDay>
                  <Day>
                    {day.getDate() === 1
                      ? CalendarUtil.format(day, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : DateUtil.formatD(day.toISOString())}
                  </Day>
                </DateView>
              </ColumnHeader>
            </WeekItem>
          );
        })}
        {props.allDayEvents.map(
          (event) =>
            props.allDayEventLayouts[event.id] < MAX_ALL_DAY_EVENT && (
              <AllDayEvent
                row={props.allDayEventLayouts[event.id] + 2}
                column={event.startDateTimeOfWeek.getDay() + 2}
                span={event.periodOfWeek}
                readonly={event.isReadOnly}
                isEditing={event.isEditing}
                onClick={(e): void => props.onClickOpenEvent(event.id, e)}
              >
                <span>{event.title || msg().Cal_Lbl_NoTitle}</span>
                {!event.isAllDay && event.createdServiceBy !== 'teamspiritPSA' && (
                  <span>
                    &nbsp;
                    {CalendarUtil.format(event.startDateTime, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </AllDayEvent>
            )
        )}
        {props.allDayEventsByDay.map(
          (events, i) =>
            doesHiddenEventsExist(
              events,
              props.allDayEventLayouts,
              MAX_ALL_DAY_EVENT
            ) && (
              <More column={i + 2}>
                <Tooltip
                  // 0 can not set as id because it is a falsy value
                  id={i + 1}
                  align="top"
                  content={msg().Cal_Lbl_SeePlans}
                  style={{ fontSize: '10px' }}
                >
                  <StyledLinkButton
                    tabIndex={0}
                    size="small"
                    onClick={(e): void =>
                      props.onClickOpenEventList(props.weekDates[i], e)
                    }
                  >
                    {TextUtil.nl2br(
                      TextUtil.template(msg().Cal_Lbl_Plans, events.length)
                    )}
                  </StyledLinkButton>
                </Tooltip>
              </More>
            )
        )}
      </Header>
    </StickyItem>
  );
};

export default AllDayEvents;
