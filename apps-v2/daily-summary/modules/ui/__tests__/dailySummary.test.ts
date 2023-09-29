import snapshotDiff from 'snapshot-diff';

import reducer, { ACTION, actions, initialState } from '../dailySummary';
import { fromRemote, job, state } from './mocks/dailySummary';

jest.mock('uuid/v4', () => {
  return (): string => 'testid#xxx';
});
jest.mock('nanoid', () => {
  return (): string => 'testid#xxx';
});

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION.ADD_JOB_TO_TASK_LIST, () => {
    // Arrange
    const prev = state;

    // Action
    const next = reducer(prev as any, actions.addJobToTaskList(job as any));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION.DELETE_TASK, () => {
    // Arrange
    const prev = state;

    // Action
    const next = reducer(prev as any, actions.deleteTask(2));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION.UPDATE, () => {
    // Arrange
    const prev = state;

    // Action
    const next = (
      [
        actions.update('targetDate', '2019-10-10'),
        actions.update('note', 'UPDATE NOTE'),
        actions.update('realWorkTime', 400),
      ] as any
    ).reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION.UPDATE_TASK, () => {
    // Arrange
    const prev = state;

    // Action
    const next = (
      [
        actions.updateTask(1, 'taskTime', 500),
        actions.updateTask(2, 'taskTime', 600),
        actions.updateTask(1, 'ratio', 35),
        actions.updateTask(1, 'isDirectInput', false),
      ] as any
    ).reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(`${ACTION.UPDATE_TASK} - total ratio is not 100%`, () => {
    // Arrange
    const prev = {
      ...state,
      taskList: [
        ...state.taskList,
        {
          id: '4',
          jobId: '003',
          jobCode: 'CODE003',
          jobName: 'JOB0003',
          hasJobType: false,
          isDirectCharged: false,
          workCategoryId: '003',
          workCategoryName: 'WC003',
          workCategoryCode: 'WC_CODE003',
          isDirectInput: false,
          ratio: 100,
          taskTime: 300,
          workCategoryList: [],
        },
      ],
    };

    // Action
    const next = (
      [
        actions.updateTask(1, 'taskTime', 50),
        actions.updateTask(1, 'ratio', 100),
        actions.updateTask(1, 'isDirectInput', false),
      ] as any
    ).reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION.TOGGLE_DIRECT_INPUT, () => {
    // Arrange
    const prev = state;

    // Action
    const next = reducer(prev as any, actions.toggleDirectInput(2));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(`${ACTION.SORT} - jobCode - desc`, () => {
    // Arrange
    const tasks = [{ jobCode: 3 }, { jobCode: 1 }, { jobCode: 2 }] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('jobCode', 'desc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  test(`${ACTION.SORT} - jobCode - asc`, () => {
    // Arrange
    const tasks = [{ jobCode: 3 }, { jobCode: 1 }, { jobCode: 2 }] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('jobCode', 'asc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  test(`${ACTION.SORT} - workCategoryCode - desc`, () => {
    // Arrange
    const tasks = [
      { workCategoryCode: 3 },
      { workCategoryCode: 1 },
      { workCategoryCode: 2 },
      { workCategoryCode: 4, hasJobType: true },
      { workCategoryCode: 4, hasJobType: false },
    ] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('workCategoryCode', 'desc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  test(`${ACTION.SORT} - workCategoryCode - asc`, () => {
    // Arrange
    const tasks = [
      { workCategoryCode: 3 },
      { workCategoryCode: 4, hasJobType: false },
      { workCategoryCode: 1 },
      { workCategoryCode: 2 },
      { workCategoryCode: 4, hasJobType: true },
    ] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('workCategoryCode', 'asc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  test(`${ACTION.SORT} - taskTime - desc`, () => {
    // Arrange
    const tasks = [
      { taskTime: 180, ratio: null, isDirectInput: true },
      { taskTime: 60, ratio: null, isDirectInput: true },
      { taskTime: 200, ratio: null, isDirectInput: true },
      { taskTime: 190, ratio: 30, isDirectInput: false },
      { taskTime: 190, ratio: 40, isDirectInput: false },
      { taskTime: 120, ratio: null, isDirectInput: true },
    ] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('taskTime', 'desc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  test(`${ACTION.SORT} - taskTime - asc`, () => {
    // Arrange
    const tasks = [
      { taskTime: 180, ratio: null, isDirectInput: true },
      { taskTime: 60, ratio: null, isDirectInput: true },
      { taskTime: 200, ratio: null, isDirectInput: true },
      { taskTime: 190, ratio: 40, isDirectInput: false },
      { taskTime: 190, ratio: 30, isDirectInput: false },
      { taskTime: 120, ratio: null, isDirectInput: true },
    ] as any;
    const state = {
      ...initialState,
      taskList: tasks,
    };

    // Action
    const next = reducer(state, actions.sort('taskTime', 'asc'));

    // Assert
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });

  describe(ACTION.FETCH_SUCCESS, () => {
    test('targetDate matched', () => {
      // Arrange
      const prev = { ...initialState, targetDate: '2020-02-05' };

      // Action
      const next = reducer(
        prev,
        actions.fetchSuccess(fromRemote as any, '2020-02-05')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    test('targetDate did not match', () => {
      // Arrange
      const prev = { ...initialState, targetDate: '2020-02-05' };

      // Action
      const next = reducer(
        prev,
        actions.fetchSuccess(fromRemote as any, '2020-02-06')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });

  describe(ACTION.SET_IS_ENABLE_END_STAMP, () => {
    test('targetDate matched', () => {
      // Arrange
      const prev = { ...initialState, targetDate: '2020-02-05' };

      // Action
      const next = reducer(
        prev,
        actions.setIsEnableEndStamp(true, '2020-02-05')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    test('targetDate did not match', () => {
      // Arrange
      const prev = { ...initialState, targetDate: '2020-02-05' };

      // Action
      const next = reducer(
        prev,
        actions.setIsEnableEndStamp(true, '2020-02-06')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });
});
