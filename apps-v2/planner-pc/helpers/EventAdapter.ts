import _ from 'lodash';
import find from 'lodash/fp/find';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/fp/flow';
import values from 'lodash/fp/values';
import moment from 'moment';

import eventTemplate from '../constants/eventTemplate';

import {
  CalendarEvent,
  convertEventsFromRemote,
} from '../models/calendar-event/CalendarEvent';

import { EventViewModel } from '../modules/entities/events';

// NOTE
// Do not forget handle the following process if you consider deleting or refactoring EventAdapter.
const adjustEndDateOfAllDayEvent = (
  momentObj: string | moment.Moment
): string | moment.Moment => {
  if (
    typeof momentObj === 'object' &&
    !_.isEmpty(momentObj) &&
    momentObj.isValid()
  ) {
    /**
     * endDateTime in Event Object where isAllDays is true should be minus one day.
     * For example, if users input 7/5 ~ 7/8 with enabling isAllDay,
     * then the internal data is 7/5 00:00 ~ 7/9 00:00 for consistency with Event object whose has time range.
     *
     * However, users may expect 7/8 as endDateTime, so displaying the internal data directly looks unnatural.
     * Thus, we have to apply -1 day for endDateTime to make endDateTime show intuitive.
     */
    return momentObj.clone().add(-1, 'd');
  } else {
    return '';
  }
};

export const onClickEventAdapter =
  (
    events: ReadonlyArray<EventViewModel>,
    onClickEvent: (
      calendarEvent: CalendarEvent,
      syntheticMouseEvent: React.MouseEvent
    ) => void
  ) =>
  (id: string, e: React.MouseEvent): void => {
    const target = flow(
      values,
      flatten,
      find((ev) => ev.id === id)
    )(events);
    const eventMap = convertEventsFromRemote(target ? [target] : [], 0);
    const [event] = flow(values, flatten)(eventMap);

    if (event.isAllDay) {
      event.end = adjustEndDateOfAllDayEvent(event.end);
    }

    if (target && !target.isReadOnly) {
      onClickEvent(event, e);
    }
  };

export const onClickNewEventAdapter =
  (
    events: ReadonlyArray<EventViewModel>,
    onClickEvent: (
      calendarEvent: CalendarEvent,
      syntheticMouseEvent: React.MouseEvent
    ) => void
  ) =>
  (clickedDate: Date, e: React.MouseEvent): void => {
    const newEvent = _.cloneDeep(eventTemplate);
    const date = moment(clickedDate);
    newEvent.start = date;
    newEvent.end = date;
    newEvent.isAllDay = true;

    onClickEvent(newEvent, e);
  };
