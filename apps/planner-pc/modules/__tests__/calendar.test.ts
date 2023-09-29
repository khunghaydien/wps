import moment from 'moment';

import snapshotDiff from 'snapshot-diff';

import {
  RECEIVE_LOAD_EMP_EVENTS,
  REQUEST_LOAD_EMP_EVENTS,
  SELECT_DAY,
  SWITCH_CALENDAR_MODE,
} from '../../actions/events';

import { calendarMode, empEvents, selectedDay } from '../calendar';
import { events } from './calendar.payloads';

describe('selectedDay()', () => {
  test(SELECT_DAY, () => {
    // Arrange
    const prev = moment('2019-12-30');

    // Act
    const next = selectedDay(prev, {
      type: SELECT_DAY,
      date: moment('2019-12-31'),
    });

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});

describe('calendarMode()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = calendarMode(undefined, { type: '@@INIT' });
    expect(snapshotDiff('', next)).toMatchSnapshot();
  });
  test(SWITCH_CALENDAR_MODE, () => {
    // Arrange
    const prev = 'month';

    // Act
    const next = calendarMode(prev, {
      type: SWITCH_CALENDAR_MODE,
      calendarMode: 'week',
    });

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});

describe('empEvents()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = empEvents(undefined, { type: '@@INIT' });
    expect(snapshotDiff('', next)).toMatchSnapshot();
  });
  test(REQUEST_LOAD_EMP_EVENTS, () => {
    // Arrange
    const prev = {
      didInvalidate: false,
      records: {},
    };

    // Act
    const next = empEvents(prev, {
      type: REQUEST_LOAD_EMP_EVENTS,
    });

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(RECEIVE_LOAD_EMP_EVENTS, () => {
    // Arrange
    const prev = [
      {
        type: REQUEST_LOAD_EMP_EVENTS,
      },
    ].reduce(empEvents, {
      didInvalidate: false,
      records: {},
    });

    // Act
    const next = empEvents(prev, {
      type: RECEIVE_LOAD_EMP_EVENTS,
      empEvents: events,
      receivedAt: null,
    });

    // Assert
    expect(
      snapshotDiff(
        {
          didInvalidate: false,
          records: {},
        },
        next
      )
    ).toMatchSnapshot();
  });
});
