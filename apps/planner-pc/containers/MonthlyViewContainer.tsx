import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import { State } from '../modules';

import Calendar from '../action-dispatchers/Calendar';

import MonthlyView from '../components/MonthlyView';

import { calculatePopupPosition } from '../helpers';
import {
  onClickEventAdapter,
  onClickNewEventAdapter,
} from '../helpers/EventAdapter';
import { Ui } from '../styles';

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
    date: state.selectedDay.toDate(),
    events: state.entities.events,
  };
};

const MonthlyViewContainer: React.FC<OwnProps> = ({
  onClickEvent,
}: OwnProps) => {
  const props = useSelector(mapStateToProps);
  const userSetting = useSelector((state: State) => state.userSetting);

  const dispatch = useDispatch();
  const calendar = Calendar(userSetting, dispatch);

  const onClickOpenEventList = useCallback(
    (clickedDate: Date, e: React.MouseEvent) => {
      // Manually firing blur event is needed here since Keyboard Event does not provide positions.
      // If it were not, Event List is displayed at (0,0) of screen.
      // @ts-ignore FIXME Specify a proper type to currentTarget
      e.currentTarget.blur();

      const { top, left } = calculatePopupPosition(
        Ui.eventList.height,
        Ui.eventList.width,
        e
      );
      calendar.openEventList(clickedDate, top, left);
    },
    [dispatch]
  );

  // TODO
  // Remove this callback.
  //
  // This callback was added for backward compatibility.
  // In the near future, this callback is going to be removed with EventEditPopup
  const onClickOpenEvent = useCallback(
    onClickEventAdapter(props.events as any, onClickEvent),
    [onClickEvent, props.events /* shallow equal */, dispatch]
  );

  const onClickNewEvent = useCallback(
    onClickNewEventAdapter(props.events as any, onClickEvent),
    [onClickEvent]
  );

  return useMemo(
    () => (
      <MonthlyView
        today={new Date()}
        {...props}
        useWorkTime={userSetting.useWorkTime}
        onClickOpenEventList={onClickOpenEventList}
        onClickOpenEvent={onClickOpenEvent}
        onClickNewEvent={onClickNewEvent}
      />
    ),
    [onClickOpenEventList, onClickOpenEvent, onClickNewEvent]
  );
};

export default MonthlyViewContainer;
