import React, { ReactElement } from 'react';

import styled from 'styled-components';

import CalendarUtil from '../../../commons/utils/CalendarUtil';
import { AddButton } from '../../../core';

import { State as EventMap } from '../../modules/entities/events';

import DateRow from './DateRow';
import DayHeader from './DayHeader';
import Events from './Events';
import Template from './Template';
import WeekRow, { RightAlign } from './WeekRow';

type Props = Readonly<{
  today: Date;
  date: Date;
  events: EventMap;
  useWorkTime: boolean;
  onClickNewEvent: (date: Date, e: React.MouseEvent) => void;
  onClickOpenEvent: (id: string, e: React.MouseEvent) => void;
  onClickOpenEventList: (date: Date, e: React.MouseEvent) => void;
}>;

const AddEventButton = styled(AddButton)`
  z-index: 2;
`;

const MonthlyView: React.FC<Props> = ({
  today,
  date,
  events,
  useWorkTime,
  onClickNewEvent,
  onClickOpenEvent,
  onClickOpenEventList,
}: Props) => {
  const dates = CalendarUtil.getCalendarAsOf(date);
  return (
    <Template
      dates={dates}
      DaysView={(): ReactElement => <DayHeader dates={dates} />}
      DatesView={(props): ReactElement => (
        <DateRow
          {...props}
          today={today}
          useWorkTime={useWorkTime}
          month={date.getMonth()}
        />
      )}
      WeekView={(props): ReactElement => (
        <>
          <WeekRow
            {...props}
            role="presentation"
            render={(ps): ReactElement => (
              <RightAlign>
                <AddEventButton
                  tabIndex={0}
                  onClick={(e): void => onClickNewEvent(ps.date, e)}
                />
              </RightAlign>
            )}
          />
          <Events
            {...props}
            visibleEventsNumber={3}
            events={events}
            onClickOpenEvent={onClickOpenEvent}
            onClickOpenEventList={onClickOpenEventList}
          />
        </>
      )}
    />
  );
};

export default MonthlyView;
