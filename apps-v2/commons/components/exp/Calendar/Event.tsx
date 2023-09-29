import React, { FC } from 'react';

import { HOURS_HEIGHT } from '@commons/constants/exp/calendar';

import msg from '@commons/languages';
import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';
import CalendarUtil from '@commons/utils/CalendarUtil';

import { Event as EventCard } from './EventCard';

type Props = {
  event: BaseEvent;
  onClickEvent: (event: BaseEvent) => void;
};

const Event: FC<Props> = ({ event, onClickEvent }) => {
  const { end, job, layout, left, start, title, width } = event;
  const eventHeight = layout.endMinutesOfDay - layout.startMinutesOfDay;

  return (
    <EventCard
      top={layout.startMinutesOfDay}
      left={left}
      width={width}
      height={eventHeight}
      hasJob={!!job.id}
      onClick={() => onClickEvent(event)}
    >
      <span>
        {title || msg().Cal_Lbl_NoTitle}
        {eventHeight <
          50 /* threshold for whether the title and time are side-by-side */ && (
          <>&nbsp;</>
        )}
      </span>
      <span>
        {CalendarUtil.format(start.toDate(), {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {layout.endMinutesOfDay - layout.startMinutesOfDay >= HOURS_HEIGHT &&
          ` ${msg().Cal_Lbl_PeriodExpression} ${CalendarUtil.format(
            end.toDate(),
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
