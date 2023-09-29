import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import { State } from '../modules';

import PsaEventPopup from '../../psa-pc/sub-apps/event-popoup/action-dispatchers/PsaEventPopup';
import App from '../action-dispatchers/App';

import Planner from '../components/Planner';

function mapStateToProps(state: State) {
  return {
    calendarMode: state.calendarMode,
    empEvents: state.empEvents.records,
    userSetting: state.userSetting,
    selectedDay: state.selectedDay,
    eventEditPopup: state.eventEditPopup,
  };
}

const PlannerContainer: React.FC<Record<string, unknown>> = () => {
  const props = useSelector(mapStateToProps, shallowEqual);
  const dispatch = useDispatch();
  const app = useMemo(() => App(dispatch), [dispatch]);
  const psaEventPopup = useMemo(() => PsaEventPopup(dispatch), [dispatch]);

  const openPopup = useCallback(
    (event: CalendarEvent, layout: { left: number; top: number }) => {
      if (event.createdServiceBy === 'teamspiritPSA' && event.id) {
        (dispatch as (arg0: Promise<void>) => Promise<void>)(
          psaEventPopup.getPsaEvent(event.id, layout.top, layout.left)
        );
      } else {
        app.openEventEditPopup(event, layout);
      }
    },
    [dispatch, app, psaEventPopup]
  );

  return <Planner {...props} openPopup={openPopup} />;
};

export default PlannerContainer;
