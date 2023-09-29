import { endOfMonth, startOfMonth } from 'date-fns';

import snapshotDiff from 'snapshot-diff';

import reducer, { action, initialState as state } from '../index';

const initialState = {
  ...state,
  startDate: startOfMonth(new Date(2021, 0, 15)),
  endDate: endOfMonth(new Date(2021, 0, 15)),
  summaryPeriod: {
    startDate: startOfMonth(new Date(2021, 0, 15)),
    endDate: endOfMonth(new Date(2021, 0, 15)),
  },
};

describe('reducer', () => {
  test(`action.SELECT_DEST_TASK`, () => {
    // Arrange
    const nextTask = {
      jobId: '1',
      jobCode: 'wpb-995',
      jobName: 'time tracking job transfer',
      workCategoryId: '2',
      workCategoryCode: 'wsp-testing',
      workCategoryName: 'Testing',
      validFrom: '2021-04-01',
      validTo: '2021-04-30',
    };

    // Run
    const next = reducer(initialState, action.SELECT_DEST_TASK(nextTask));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  test(`action.SELECT_SRC_TASK`, () => {
    // Arrange
    const nextTask = {
      jobId: '1',
      jobCode: 'wpb-995',
      jobName: 'time tracking job transfer',
      workCategoryId: '2',
      workCategoryCode: 'wsp-testing',
      workCategoryName: 'Testing',
    };

    // Run
    const next = reducer(initialState, action.SELECT_SRC_TASK(nextTask));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  test(`action.SELECT_START_DATE`, () => {
    // Arrange
    const date = new Date(2020, 11, 1);

    // Run
    const next = reducer(initialState, action.SELECT_START_DATE(date));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  test(`action.SELECT_END_DATE`, () => {
    // Arrange
    const date = new Date(2020, 11, 31);

    // Run
    const next = reducer(initialState, action.SELECT_END_DATE(date));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  test(`action.SELECT_SUMMARY`, () => {
    // Arrange
    const summary = {
      summaryId: 'id',
      summaryPeriod: {
        startDate: new Date(2021, 0, 10),
        endDate: new Date(2021, 0, 20),
      },
    };
    // Run
    const next = reducer(initialState, action.SELECT_SUMMARY(summary));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  test(`action.RESET`, () => {
    // Arrange
    const currentState = {
      ...initialState,
      srcTask: {
        ...initialState.srcTask,
        sourceJobId: 'source',
      },
      destTask: {
        ...initialState.destTask,
        sourceJobId: 'destination',
      },
    };

    // Run
    const next = reducer(currentState, action.RESET());

    // Assert
    expect(snapshotDiff(currentState, next)).toMatchSnapshot();
  });
});
