import React, { FC, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { EVENT_WIDTH } from '@commons/constants/exp/calendar';

import {
  fetchCalendarEvent,
  startCalendarLoading,
} from '@commons/action-dispatchers/ExpCalendar';
import Calendar from '@commons/components/exp/Calendar';
import CopyCalendarScheduleDialog from '@commons/components/exp/Form/Dialog/CopyCalendarSchedule';
import CalendarEventListPopupContainer from '@commons/containers/exp/CalendarEventListPopupContainer';
import {
  addPositionAndWidth,
  BaseEvent,
} from '@commons/models/DailySummary/BaseEvent';
import { actions as eventActions } from '@commons/modules/exp/entities/events';
import { actions as eventListPopUpActions } from '@commons/modules/exp/ui/eventListPopup';
import { formatScheduleSummary } from '@commons/utils/exp/CalenderUtil';

import { State } from '../../modules';

import { isAllDayEvent } from '@apps/daily-summary/helper';

type StateProps = {
  common: State;
};

type Props = {
  isLoading: boolean;
  isRecordLoading: boolean;
  loadingAreas: string[];
  targetDate: string;
};

const CalendarContainer: FC<Props> = (props) => {
  const { isLoading, isRecordLoading, loadingAreas, targetDate } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleSummary, setScheduleSummary] = useState('');
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const events = useSelector(
    (state: StateProps) => state.common.exp.entities.events.records,
    shallowEqual
  );

  const normalEvents = React.useMemo(() => {
    const filtered = events.filter((event) => !isAllDayEvent(event));
    return addPositionAndWidth(filtered, EVENT_WIDTH);
  }, [events]);

  const allDayEvents = React.useMemo(
    () => events.filter((event) => isAllDayEvent(event)),
    [events]
  );

  const allDayEventsCount = React.useMemo(() => {
    const { length } = allDayEvents;
    return length > 3 ? 4 : length;
  }, [allDayEvents]);

  useEffect(() => {
    if (isRecordLoading) dispatch(startCalendarLoading());
  }, []);

  useEffect(() => {
    if (!isRecordLoading && targetDate)
      dispatch(fetchCalendarEvent(targetDate, loadingAreas));
    return () => {
      dispatch(eventActions.reset());
    };
  }, [dispatch, isRecordLoading, targetDate]);

  const onClickEvent = (event: BaseEvent) => {
    dispatch(eventListPopUpActions.close());
    onToggleDialog();
    const scheduleSummary = formatScheduleSummary(event);
    setScheduleSummary(scheduleSummary);
  };

  const onToggleDialog = () => {
    setDialogOpen((open) => !open);
  };

  return (
    <>
      <Calendar
        normalEvents={normalEvents}
        allDayEvents={allDayEvents}
        allDayEventsCount={allDayEventsCount}
        isLoading={isLoading}
        loadingAreas={loadingAreas}
        scrollTo={7}
        targetDate={targetDate}
        onClickEvent={onClickEvent}
      />
      <CalendarEventListPopupContainer onClickEvent={onClickEvent} />
      <CopyCalendarScheduleDialog
        hide={onToggleDialog}
        isOpen={dialogOpen}
        scheduleSummary={scheduleSummary}
      />
    </>
  );
};

export default CalendarContainer;
