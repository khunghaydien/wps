import React from 'react';

import { HOURS_HEIGHT } from '../../constants/calendar';

import msg from '../../../commons/languages';
import { BaseEvent } from '../../../commons/models/DailySummary/BaseEvent';
import CalendarUtil from '../../../commons/utils/CalendarUtil';

import { Event as EventCard } from './EventCard';

type Props = {
  event: BaseEvent;
};

const Event = ({ event }: Props) => {
  const eventHeight =
    event.layout.endMinutesOfDay - event.layout.startMinutesOfDay;
  return (
    <EventCard
      top={event.layout.startMinutesOfDay}
      left={event.left}
      width={event.width}
      height={eventHeight}
      hasJob={!!event.job.id}
    >
      <span>
        {event.title || msg().Cal_Lbl_NoTitle}
        {eventHeight <
          50 /* threshold for whether the title and time are side-by-side */ && (
          <>&nbsp;</>
        )}
      </span>
      <span>
        {CalendarUtil.format(event.start.toDate(), {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {event.layout.endMinutesOfDay - event.layout.startMinutesOfDay >=
          HOURS_HEIGHT &&
          ` ${msg().Cal_Lbl_PeriodExpression} ${CalendarUtil.format(
            event.end.toDate(),
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          )}`}
      </span>
    </EventCard>
  );
};

export default Event;
