import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';

import { State } from '../../modules';
import { actions as eventListPopup } from '../../modules/exp/ui/eventListPopup';

import MoreAllDayEvents from '../../components/exp/Calendar/MoreAllDayEvents';
import Popup from '../../components/exp/Calendar/Popup';

type StateProps = {
  common: State;
};

type OwnProps = {
  onClickEvent: (event: BaseEvent) => void;
};

const mapStateToProps = (state: StateProps) => ({
  date: state.common.exp.ui.eventListPopup.date,
  isOpen: state.common.exp.ui.eventListPopup.isOpen,
  top: state.common.exp.ui.eventListPopup.top,
  left: state.common.exp.ui.eventListPopup.left,
  events: state.common.exp.entities.events.records,
});

const CalendarEventListPopupContainer: React.FC<OwnProps> = (ownProps) => {
  const { onClickEvent } = ownProps;
  const { isOpen, top, left, events, ...props } = useSelector(
    mapStateToProps,
    shallowEqual
  );

  const dispatch = useDispatch();

  const eventsOfDay = useMemo(
    () => events.filter((event) => event.layout.containsAllDay),
    [events]
  );

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
      <MoreAllDayEvents
        {...props}
        events={eventsOfDay}
        onClickClose={onClickClose}
        onClickEvent={onClickEvent}
      />
    </Popup>
  );
};

export default CalendarEventListPopupContainer;
