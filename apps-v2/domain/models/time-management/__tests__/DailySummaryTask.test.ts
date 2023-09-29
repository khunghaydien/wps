import sumBy from 'lodash/sumBy';

import {
  addErrorOfTotalTaskTime,
  calculateTaskTimesOfNonDirectInput,
  findLargestRatioTask,
  isPercentageFull,
  isTaskTimeOfNonDirectInputsAvailable,
  makeRatioInputTaskTimeTo0,
  sumRatio,
} from '../DailySummaryTask';

describe('isPercentageFull', () => {
  test('should return true if percentage sum of task is 100', () => {
    const tasks = [
      { isDirectInput: false, ratio: 35 },
      { isDirectInput: false, ratio: 10 },
      { isDirectInput: true, taskTime: 300 },
      { isDirectInput: false, ratio: 55 },
    ] as any;

    const isFull = isPercentageFull(tasks);

    expect(isFull).toBe(true);
  });

  test('should return false if percentage sum of task is not 100', () => {
    const tasks = [
      { isDirectInput: false, ratio: 11 },
      { isDirectInput: false, ratio: 13 },
      { isDirectInput: true, taskTime: 20000000000 },
      { isDirectInput: false, ratio: 23 },
    ] as any;

    const isFull = isPercentageFull(tasks);

    expect(isFull).toBe(false);
  });
});

describe('isTaskTimeOfNonDirectInputsAvailable', () => {
  it.each`
    realWorkTime | totalTaskTime | expected
    ${300}       | ${299}        | ${true}
    ${300}       | ${300}        | ${true}
    ${300}       | ${301}        | ${true}
    ${300}       | ${null}       | ${true}
    ${null}      | ${400}        | ${false}
    ${null}      | ${null}       | ${false}
  `(
    'should be $expected, given realWorkTime($realWorkTime) and total task time($totalTaskTime)',
    ({ realWorkTime, totalTaskTime, expected }) => {
      // Arrange
      const tasks = [
        { isDirectInput: false, taskTime: 0, ratio: 30 },
        { isDirectInput: false, taskTime: 0, ratio: 20 },
        { isDirectInput: false, taskTime: 0, ratio: 50 },
        { isDirectInput: true, taskTime: totalTaskTime, ratio: 0 },
      ] as any;

      // Act
      const actual = isTaskTimeOfNonDirectInputsAvailable(tasks, realWorkTime);

      // Assert
      expect(actual).toBe(expected);
    }
  );

  it('should be false if ratio input is less than 100%', () => {
    // Arrange
    const realWorkTime = 300;
    const tasks = [
      { isDirectInput: false, taskTime: 0, ratio: 30 },
      { isDirectInput: false, taskTime: 0, ratio: 20 },
      { isDirectInput: false, taskTime: 0, ratio: 20 },
      { isDirectInput: true, taskTime: 200, ratio: 0 },
    ] as any;

    // Act
    const actual = isTaskTimeOfNonDirectInputsAvailable(tasks, realWorkTime);

    // Assert
    expect(actual).toBe(false);
  });

  it('should be false if ratio input is more than 100%', () => {
    // Arrange
    const realWorkTime = 300;
    const tasks = [
      { isDirectInput: false, taskTime: 0, ratio: 32 },
      { isDirectInput: false, taskTime: 0, ratio: 20 },
      { isDirectInput: false, taskTime: 0, ratio: 90 },
      { isDirectInput: true, taskTime: 200, ratio: 0 },
    ] as any;

    // Act
    const actual = isTaskTimeOfNonDirectInputsAvailable(tasks, realWorkTime);

    // Assert
    expect(actual).toBe(false);
  });
});

describe('calculateTaskTimesOfNonDirectInput()', () => {
  it('should distribute the rest of times excluding direct input to tasks of ratio input', () => {
    // Arrange
    const realWorkTime = 373;
    const tasks = [
      { isDirectInput: false, taskTime: 0, ratio: 30 },
      { isDirectInput: false, taskTime: 0, ratio: 20 },
      { isDirectInput: false, taskTime: 0, ratio: 50 },
      { isDirectInput: true, taskTime: 130, ratio: 0 },
      { isDirectInput: true, taskTime: 50, ratio: 0 },
    ] as any;

    // Act
    const actual = calculateTaskTimesOfNonDirectInput(tasks, realWorkTime);

    // Assert
    expect(actual).toEqual([
      {
        isDirectInput: false,
        ratio: 30,
        taskTime: 57,
      },
      {
        isDirectInput: false,
        ratio: 20,
        taskTime: 38,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 96,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 130,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 50,
      },
    ]);
  });
  it('should set to 0 to task time if the task ratio was inputted 0%', () => {
    // Arrange
    const realWorkTime = 300;
    const tasks = [
      { isDirectInput: false, taskTime: 0, ratio: 100 },
      { isDirectInput: false, taskTime: 180, ratio: 0 },
    ] as any;

    // Act
    const actual = calculateTaskTimesOfNonDirectInput(tasks, realWorkTime);

    // Assert
    expect(actual).toEqual([
      {
        isDirectInput: false,
        ratio: 100,
        taskTime: 300,
      },
      {
        isDirectInput: false,
        ratio: 0,
        taskTime: 0,
      },
    ]);
  });
  it('should round the fraction part of task times', () => {
    // Arrange
    const realWorkTime = 343;
    const tasks = [
      { isDirectInput: false, taskTime: 0, ratio: 30 },
      { isDirectInput: false, taskTime: 0, ratio: 20 },
      { isDirectInput: false, taskTime: 0, ratio: 50 },
      { isDirectInput: true, taskTime: 130, ratio: 0 },
      { isDirectInput: true, taskTime: 50, ratio: 0 },
    ] as any;

    // Act
    const actual = calculateTaskTimesOfNonDirectInput(tasks, realWorkTime);

    // Assert
    const result = sumBy(actual, (task) => task.taskTime);
    expect(realWorkTime - result).toBe(2);
  });
  it('should set all task times of ratio input 0 if there are no hours to be allocated', () => {
    // Arrange
    const realWorkTime = 343;
    const tasks = [
      { isDirectInput: true, taskTime: 343, ratio: null },
      { isDirectInput: true, taskTime: 0, ratio: null },
      { isDirectInput: false, taskTime: 0, ratio: 50 },
      { isDirectInput: true, taskTime: 130, ratio: 0 },
      { isDirectInput: true, taskTime: 50, ratio: 0 },
    ] as any;

    // Act
    const actual = calculateTaskTimesOfNonDirectInput(tasks, realWorkTime);

    // Assert
    expect(actual).toEqual([
      {
        isDirectInput: true,
        ratio: null,
        taskTime: 343,
      },
      {
        isDirectInput: true,
        ratio: null,
        taskTime: 0,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 0,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 130,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 50,
      },
    ]);
  });
});

describe('addErrorOfTotalTaskTime()', () => {
  it('should add rounded value to target task', () => {
    // Arrange
    const realWorkTime = 373;
    const targetTask = {
      isDirectInput: false,
      ratio: 20,
      taskTime: 38,
    } as any;
    const tasks = [
      {
        isDirectInput: false,
        ratio: 30,
        taskTime: 57,
      },
      {
        isDirectInput: false,
        ratio: 20,
        taskTime: 38,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 96,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 130,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 50,
      },
    ] as any;

    // Act
    const actual = addErrorOfTotalTaskTime(tasks, realWorkTime, targetTask);

    // Arrange
    expect(actual).toEqual({
      isDirectInput: false,
      ratio: 20,
      taskTime: 40,
    });
  });
});

describe('findLargestRatioTask', () => {
  it('should return null if empty tasks is given', () => {
    // Arrange
    const tasks = [];

    // Act
    const actual = findLargestRatioTask(tasks);

    // Assert
    expect(actual).toBeNull();
  });
  it('should return null if no ratio task is found', () => {
    // Arrange
    const tasks = [
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 130,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 50,
      },
    ] as any;

    // Act
    const actual = findLargestRatioTask(tasks);

    // Assert
    expect(actual).toBeNull();
  });
  it('should find the ratio input task which has the largest ratio in a given tasks', () => {
    // Arrange
    const tasks = [
      {
        isDirectInput: false,
        ratio: 30,
        taskTime: 57,
      },
      {
        isDirectInput: false,
        ratio: 20,
        taskTime: 38,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 96,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 130,
      },
      {
        isDirectInput: true,
        ratio: 0,
        taskTime: 50,
      },
    ] as any;

    // Act
    const actual = findLargestRatioTask(tasks);

    // Assert
    expect(actual).toEqual({
      isDirectInput: false,
      ratio: 50,
      taskTime: 96,
    });
  });
});

describe('sumRatio', () => {
  it('should sum ratio of ratio input tasks', () => {
    // Arrange
    const tasks = [
      {
        isDirectInput: false,
        ratio: 20,
        taskTime: 50,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 0,
      },
      {
        isDirectInput: false,
        ratio: 30,
        taskTime: null,
      },
      {
        isDirectInput: true,
        ratio: 30,
        taskTime: 50,
      },
    ] as any;

    // Act
    const actual = sumRatio(tasks);

    // Assert
    expect(actual).toBe(100);
  });
});

describe('makeRatioInputTaskTimeTo0', () => {
  it('should make taskTime of ratio input task to 0', () => {
    // Arrange
    const tasks = [
      {
        isDirectInput: false,
        ratio: 20,
        taskTime: 50,
      },
      {
        isDirectInput: false,
        ratio: 50,
        taskTime: 0,
      },
      {
        isDirectInput: false,
        ratio: 30,
        taskTime: null,
      },
      {
        isDirectInput: true,
        ratio: 30,
        taskTime: 50,
      },
    ] as any;

    // Act
    const actual = makeRatioInputTaskTimeTo0(tasks);

    // Assert
    const nonDirectInputTasks = actual.filter((task) => !task.isDirectInput);
    for (const task of nonDirectInputTasks) {
      expect(task.taskTime).toBe(0);
    }
  });
});
