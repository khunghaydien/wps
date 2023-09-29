import { bindActionCreators, Dispatch } from 'redux';

import { catchBusinessError, confirm } from '../../commons/actions/app';
import msg from '../../commons/languages';
import { actions as appActions } from '../../commons/modules/app';
import CalendarUtil from '../../commons/utils/CalendarUtil';

import PlannerEventRepository from '../../repositories/PlannerEventRepository';

import { Event } from '../../domain/models/time-management/Event';
import { convertEventsFromRemote } from '../models/calendar-event/CalendarEvent';

import { actions } from '../modules/entities/events';

import {
  receiveEmpEventsPosts,
  requestEmpEventsPosts,
} from '../actions/events';

const App = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      ...appActions,
      catchBusinessError,
      confirm,
    },
    dispatch
  );

interface Events {
  loadEvents: (targetDate: Date, empId?: string) => Promise<void>;
  loadEventsBetween: (
    period: {
      readonly startDate: Date;
      readonly endDate: Date;
    },
    empId?: string
  ) => Promise<void>;
  removeEvent: (
    event: Event,
    targetDate: Date,
    empId?: string
  ) => Promise<void>;
}

export default (dispatch: Dispatch): Events => {
  const app = App(dispatch);

  const loadEvents = async (
    period: {
      readonly startDate: Date;
      readonly endDate: Date;
    },
    empId?: string
  ): Promise<void> => {
    const { events, messages } = await PlannerEventRepository.fetch({
      startDate: period.startDate.toISOString(),
      endDate: period.endDate.toISOString(),
      empId,
    });
    dispatch(actions.fetchSuccess(events, period.startDate, period.endDate));

    // TODO
    // Remove the following code.
    // The following line is not recommended and planned to be removed by epic/GENIE-11663
    dispatch(receiveEmpEventsPosts(convertEventsFromRemote(events, 0)));

    // Even if the status is success, it may have failed partially.
    // e.g. couldn't import calendar events from other services
    for (const o of messages) {
      app.catchBusinessError(
        msg().Cal_Lbl_CalendarEventSyncErrorTitle,
        o.message,
        null,
        {
          isContinuable: true,
        }
      );
    }
  };

  return {
    loadEvents: async (targetDate: Date, empId?: string): Promise<void> => {
      dispatch(requestEmpEventsPosts());

      app.loadingStart();
      try {
        // TODO
        // Consider the design about dependency on `period`.
        //
        // `period` is used entire of Events action-dispatcher.
        // So Events action-dispatcher should depend on `period` object,
        // or methods of its should depend on `period`.
        const period = CalendarUtil.getCalendarPeriodAsOf(targetDate);
        await loadEvents(period, empId);
      } catch (e) {
        dispatch(app.catchApiError(e, { isContinuable: false }));
      } finally {
        app.loadingEnd();
      }
    },

    loadEventsBetween: async (
      period: {
        readonly startDate: Date;
        readonly endDate: Date;
      },
      empId?: string
    ): Promise<void> => {
      dispatch(requestEmpEventsPosts());

      app.loadingStart();
      try {
        await loadEvents(period, empId);
      } catch (e) {
        dispatch(app.catchApiError(e, { isContinuable: false }));
      } finally {
        app.loadingEnd();
      }
    },

    removeEvent: async (
      event: Event,
      targetDate: Date,
      empId?: string
    ): Promise<void> => {
      const yes = await app.confirm(msg().Cal_Msg_DeleteEvent);
      if (!yes) {
        return;
      }

      app.loadingStart();
      try {
        await PlannerEventRepository.delete(event.id);

        // TODO
        // Consider the design about dependency on `period`.
        //
        // `period` is used entire of Events action-dispatcher.
        // So Events action-dispatcher should depend on `period` object,
        // or methods of its should depend on `period`.
        const period = CalendarUtil.getCalendarPeriodAsOf(targetDate);
        await loadEvents(period, empId);
      } catch (e) {
        app.catchApiError(e, { isContinuable: true });
      } finally {
        app.loadingEnd();
      }
    },
  };
};
