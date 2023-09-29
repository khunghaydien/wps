import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import { State } from '../modules';
import { toKey } from '../modules/entities/events';

import Calendar from '../action-dispatchers/Calendar';

import EventList from '../components/EventList';
import Popup from '../components/Popup';

import { orderEventsOfDay } from '../helpers';
import { onClickEventAdapter } from '../helpers/EventAdapter';

type OwnProps = {
  // TODO
  // Stop receiving `onClickEvent` from upper stream.
  readonly onClickEvent: (
    selectedEvent: CalendarEvent,
    e: React.MouseEvent
  ) => void;
};

const mapStateToProps = (state: State) => {
  return {
    date: state.ui.eventListPopup.date,
    isOpen: state.ui.eventListPopup.isOpen,
    top: state.ui.eventListPopup.top,
    left: state.ui.eventListPopup.left,
    events: state.entities.events,
    calendarMode: state.calendarMode,
    eventEditPopup: state.ui.eventEditPopup,
  };
};

const EventListPopupContainer = ({ onClickEvent }: OwnProps) => {
  const { isOpen, top, left, events, calendarMode, eventEditPopup, ...props } =
    useSelector(mapStateToProps, shallowEqual);
  const userSetting = useSelector((state: State) => state.userSetting);

  const dispatch = useDispatch();
  const calendar = Calendar(userSetting, dispatch);

  const eventsOfDay = useMemo(() => {
    const eventList = orderEventsOfDay(events[toKey(props.date)] || []);
    if (calendarMode === 'week') {
      return eventList.filter((event) => !event.isLessThanDay);
    }
    return eventList;
  }, [props.date, events, calendarMode]);

  // TODO
  // Remove this callback.
  //
  // This callback was added for backward compatibility.
  // In the near future, this callback is going to be removed with EventEditPopup
  const onClickOpen = useCallback(
    onClickEventAdapter(eventsOfDay, onClickEvent),
    [onClickEvent, eventsOfDay /* shallow equal */, props.date, dispatch]
  );

  const onClickClose = useCallback(() => {
    if (!eventEditPopup.isOpen) {
      calendar.closeEventList();
    }
  }, [eventEditPopup.isOpen, dispatch]);

  return (
    <Popup
      isOpen={isOpen}
      onClickOutside={onClickClose}
      top={`${top}px`}
      left={`${left}px`}
    >
      <EventList
        {...props}
        events={eventsOfDay}
        onClickOpen={onClickOpen}
        onClickClose={calendar.closeEventList}
      />
    </Popup>
  );
};

export default EventListPopupContainer;
