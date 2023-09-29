import {
  calculateEachRatioOfNonDirectInputTasks,
  calculateEachTaskTimeOfNonDirectInputTasks,
} from '../DailySummary';

describe('calculateEachRatioOfNonDirectInputTasks(taskList)', () => {
  test('calculate each ratio of non-direct-input tasks correctly', () => {
    const taskList = [
      { isDirectInput: false, volume: 100 },
      { isDirectInput: false, volume: 200 },
      { isDirectInput: true, taskTime: 300 },
      { isDirectInput: false, volume: 0 },
    ] as any;

    const newTaskList = calculateEachRatioOfNonDirectInputTasks(taskList);

    expect(newTaskList[0].ratio).toBe(34);
    expect(newTaskList[1].ratio).toBe(66);
  });

  test('should add the round-off errors of ratio to the first non-direct-input task in the list', () => {
    const taskList = [
      { isDirectInput: false, volume: 48 },
      { isDirectInput: false, volume: 102 },
      { isDirectInput: false, volume: 165 },
      { isDirectInput: true, taskTime: 300 },
    ] as any;

    const newTaskList = calculateEachRatioOfNonDirectInputTasks(taskList);

    expect(newTaskList[1].ratio).toBe(32);
    expect(newTaskList[2].ratio).toBe(52);
    // should contain the round-off errors
    expect(newTaskList[0].ratio).toBe(16);
  });

  test('should set ratio to 0 when the sum of volumes of non-direct-input tasks is 0', () => {
    const taskList = [{ isDirectInput: false, volume: 0 }] as any;

    const newTaskList = calculateEachRatioOfNonDirectInputTasks(taskList);

    // should avoid this: 0/0 -> NaN
    expect(newTaskList[0].ratio).toBe(0);
  });
});

describe('calculateEachTaskTimeOfNonDirectInputTasks(realWorkTime, taskList)', () => {
  test('calculate each task-hours of non-direct-input tasks correctly', () => {
    const realWorkTime = 600;
    const taskList = [
      { isDirectInput: false, volume: 100, ratio: 34 },
      { isDirectInput: false, volume: 200, ratio: 66 },
      { isDirectInput: true, taskTime: 300 },
      { isDirectInput: false, volume: 0, ratio: 0 },
    ] as any;

    const newTaskList = calculateEachTaskTimeOfNonDirectInputTasks(
      realWorkTime,
      taskList
    );

    expect(newTaskList[0].taskTime).toBe(102);
    expect(newTaskList[1].taskTime).toBe(198);
  });

  test('should add the round-off errors of task-hours to the first non-direct-input task', () => {
    const realWorkTime = 303;
    const taskList = [
      { isDirectInput: false, volume: 48, ratio: 16 },
      { isDirectInput: false, volume: 102, ratio: 32 },
      { isDirectInput: false, volume: 165, ratio: 52 },
      { isDirectInput: true, taskTime: 300 },
    ] as any;

    const newTaskList = calculateEachTaskTimeOfNonDirectInputTasks(
      realWorkTime,
      taskList
    );

    expect(newTaskList[1].taskTime).toBe(0);
    expect(newTaskList[2].taskTime).toBe(1);
    // should contain the round-off errors
    expect(newTaskList[0].taskTime).toBe(2);
  });

  test('should set task-hours to null if the volume is 0', () => {
    const realWorkTime = 500;
    const taskList = [
      {
        isDirectInput: false,
        volume: 0,
        taskTime: null,
        ratio: 0,
      },
    ] as any;

    const newTaskList = calculateEachTaskTimeOfNonDirectInputTasks(
      realWorkTime,
      taskList
    );

    expect(newTaskList[0].taskTime).toBe(null);
  });

  test('should set each task-hours of non-direct-input tasks to null when the actual work hours is null', () => {
    const realWorkTime = null;
    const taskList = [{ isDirectInput: false, volume: 10, ratio: 100 }] as any;

    const newTaskList = calculateEachTaskTimeOfNonDirectInputTasks(
      realWorkTime,
      taskList
    );

    expect(newTaskList[0].taskTime).toBe(null);
  });

  test('should set each task-hours of non-direct-input tasks to null when the total task-hours of direct-input tasks is longer than actual work hours', () => {
    const realWorkTime = 200;
    const taskList = [
      { isDirectInput: false, volume: 48, ratio: 16 },
      { isDirectInput: false, volume: 102, ratio: 32 },
      { isDirectInput: false, volume: 165, ratio: 52 },
      { isDirectInput: true, taskTime: 300 },
    ] as any;

    const newTaskList = calculateEachTaskTimeOfNonDirectInputTasks(
      realWorkTime,
      taskList
    );

    expect(newTaskList[1].taskTime).toBe(null);
    expect(newTaskList[2].taskTime).toBe(null);
  });
});
