import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { actions as eventListPopup } from '../modules/ui/eventListPopup';

import EventList from '../components/EventList';
import Popup from '../components/Popup';

const mapStateToProps = (state: State) => {
  return {
    date: state.ui.eventListPopup.date,
    isOpen: state.ui.eventListPopup.isOpen,
    top: state.ui.eventListPopup.top,
    left: state.ui.eventListPopup.left,
    events: state.entities.events.records,
  };
};

const EventListPopupContainer = () => {
  const { isOpen, top, left, events, ...props } = useSelector(
    mapStateToProps,
    shallowEqual
  );

  const dispatch = useDispatch();

  const eventsOfDay = useMemo(() => {
    return events.filter((event) => event.layout.containsAllDay);
  }, [events]);

  const onClickClose = useCallback(() => {
    dispatch(eventListPopup.close());
  }, [dispatch]);

  return (
    <Popup
      isOpen={isOpen}
      onClickOutside={onClickClose}
      top={`${top}px`}
      left={`${left}px`}
    >
      <EventList
        {...props}
        events={eventsOfDay as any}
        onClickClose={onClickClose}
      />
    </Popup>
  );
};

export default EventListPopupContainer;
