import { bindActionCreators, Dispatch } from 'redux';

import {
  addMonths,
  addWeeks,
  getDay,
  getMonth,
  getYear,
  parse,
} from 'date-fns';
import moment from 'moment';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import CalendarUtil from '../../commons/utils/CalendarUtil';

import { UserSetting } from '../../domain/models/UserSetting';

import { actions as EventListPopupActions } from '../modules/ui/eventListPopup';

import { selectDay, switchCalendarMode } from '../actions/events';

import Events from './Events';
import TimeTrackAlert from './TimeTrackAlert';

const isNextOrPrevMonth = (current: Date, dest: Date): boolean => {
  return (
    getYear(current) !== getYear(dest) ||
    getMonth(current) !== getMonth(dest) ||
    getDay(current) !== getDay(dest)
  );
};

interface Calendar {
  /**
   * Load resources needed to display calendar
   */
  loadData: (targetDate: Date, empId?: string) => Promise<void>;

  /**
   * Open event list
   */
  openEventList: (date: Date, top: number, left: number) => void;

  /**
   * Open an event
   */
  openEvent: () => Promise<void>;

  /**
   * Close event list
   */
  closeEventList: () => void;

  /**
   * Close an event
   */
  closeEvent: () => Promise<void>;

  /**
   * Go next Month
   */
  goNextMonth: (current: Date, empId?: string) => Promise<void>;

  /**
   * Go prev Month
   */
  goPrevMonth: (current: Date, empId?: string) => Promise<void>;

  /**
   * Go next Week
   */
  goNextWeek: (current: Date, empId?: string) => Promise<void>;

  /**
   * Go prev Week
   */
  goPrevWeek: (current: Date, empId?: string) => Promise<void>;

  /**
   * Go Today
   */
  goToday: (empId?: string) => Promise<void>;

  /**
   * Go targetDate
   */
  goTargetDate: (
    targetDate: string,
    current: number,
    empId?: string
  ) => Promise<void>;
}

export default (userSetting: UserSetting, dispatch: Dispatch): Calendar => {
  const app = bindActionCreators(
    { loadingStart, loadingEnd, catchApiError },
    dispatch
  );
  const eventListPopup = bindActionCreators(EventListPopupActions, dispatch);
  const calendar = bindActionCreators(
    { selectDay, switchCalendarMode },
    dispatch
  );
  const events = Events(dispatch);
  const timeTrackAlert = TimeTrackAlert(dispatch);

  const loadData = async (targetDate: Date, empId?: string): Promise<void> => {
    const period = CalendarUtil.getCalendarPeriodAsOf(targetDate);

    const resources = [
      {
        required: true,
        load: (): Promise<void> => events.loadEventsBetween(period, empId),
      },
      {
        required: userSetting.useWorkTime,
        load: (): Promise<void> =>
          timeTrackAlert.loadTimeTrackAlerts(period, empId),
      },
    ]
      .filter(({ required }) => required)
      .map((resource) => resource.load());

    await Promise.all(resources);
  };

  return {
    /**
     * Load resources needed to display calendar
     */
    loadData,

    /**
     * Open event list
     */
    openEventList: (date: Date, top: number, left: number): void => {
      eventListPopup.open(date, top, left);
    },

    /**
     * Open an event
     */
    openEvent: async (): Promise<void> => {
      throw new Error('Not Implemented');
    },

    /**
     * Close event list
     */
    closeEventList: (): void => {
      eventListPopup.close();
    },

    /**
     * Close an event
     */
    closeEvent: async (): Promise<void> => {
      throw new Error('Not Implemented');
    },

    /**
     * Go next Month
     */
    goNextMonth: async (current: Date, empId?: string): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment(current).add(1, 'M'));
        await loadData(addMonths(current, 1), empId);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Go prev Month
     */
    goPrevMonth: async (current: Date, empId?: string): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment(current).add(-1, 'M'));
        await loadData(addMonths(current, -1), empId);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Go next Week
     */
    goNextWeek: async (current: Date, empId?: string): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment(current).add(1, 'w'));

        const next = addWeeks(current, 1);
        if (isNextOrPrevMonth(current, next)) {
          await loadData(next, empId);
        }
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Go prev Week
     */
    goPrevWeek: async (current: Date, empId?: string): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment(current).add(-1, 'w'));

        const prev = addWeeks(current, -1);
        if (isNextOrPrevMonth(current, prev)) {
          await loadData(prev, empId);
        }
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Go Today
     */
    goToday: async (empId?: string): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment());
        await loadData(new Date(), empId);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Go targetDate
     */
    goTargetDate: async (
      targetDate: string,
      current: number,
      empId?: string
    ): Promise<void> => {
      try {
        app.loadingStart();

        calendar.selectDay(moment(targetDate).date(current));
        await loadData(parse(targetDate), empId);
      } catch (e) {
        app.catchApiError(e);
      } finally {
        app.loadingEnd();
      }
    },
  };
};
