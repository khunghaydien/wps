import moment from 'moment';

import {
  RECEIVE_LOAD_EMP_EVENTS,
  REQUEST_LOAD_EMP_EVENTS,
  SELECT_DAY,
  SWITCH_CALENDAR_MODE,
} from '../actions/events';

// Actions

type SelectDayAction = {
  type: 'SELECT_DAY';
  date: moment.Moment;
};

type SwitchCalendarModeAction = {
  type: 'SWITCH_CALENDAR_MODE';
  calendarMode: 'month' | 'week';
};

type RequestLoadEmpEventsAction = {
  type: 'REQUEST_LOAD_EMP_EVENTS';
};

type ReceiveLoadEmpEventsAction = {
  type: 'RECEIVE_LOAD_EMP_EVENTS';
  empEvents: Record<string, any>;
  receivedAt: string;
};

// Reducers

/**
 * カレンダー選択日
 */
export function selectedDay(
  state: moment.Moment = moment(),
  action: SelectDayAction
) {
  switch (action.type) {
    case SELECT_DAY:
      return action.date.startOf('day');
    default:
      return state.startOf('day');
  }
}

/**
 * カレンダー表示モード
 * month: 月表示
 * week: 週表示
 */
export function calendarMode(
  state: 'month' | 'week' = 'week',
  action: SwitchCalendarModeAction
) {
  switch (action.type) {
    case SWITCH_CALENDAR_MODE:
      return action.calendarMode;
    default:
      return state;
  }
}

/**
 * 予定一覧
 */
export function empEvents(
  state: {
    didInvalidate: boolean;
    records: Record<string, any>;
    lastUpdate?: string;
  } = {
    didInvalidate: false,
    records: {},
  },
  action: RequestLoadEmpEventsAction | ReceiveLoadEmpEventsAction
) {
  switch (action.type) {
    case REQUEST_LOAD_EMP_EVENTS:
      return Object.assign({}, state, {
        didInvalidate: false,
      });
    case RECEIVE_LOAD_EMP_EVENTS:
      return Object.assign({}, state, {
        didInvalidate: false,
        records: (action as ReceiveLoadEmpEventsAction).empEvents,
        lastUpdated: (action as ReceiveLoadEmpEventsAction).receivedAt,
      });
    default:
      return state;
  }
}
