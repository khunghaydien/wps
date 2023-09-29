/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutoHoursAllocationDictSurplusTime } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import {
  applyAllocateResultToTaskList,
  DailySummaryTask,
} from '../DailySummaryTask';
// import { SurplusTimeRegistrationSetting } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

type SampleDailySummaryTaskParam = {
  id?: string;
  jobId: string;
  jobCode?: string;
  jobName?: string;
  workCategoryId: string | null | undefined;
  workCategoryName?: string | null | undefined;
  workCategoryCode?: string | null | undefined;
  isDirectInput: boolean;
  taskTime: number | null | undefined;
  taskNote?: string | null | undefined;
  ratio?: number | null | undefined;
  hasJobType?: boolean;
};

const creatSampleDailySummaryTask = (param: SampleDailySummaryTaskParam) => {
  const task = {
    id: param.id,
    isDirectInput: param.isDirectInput,
    isEditLocked: false,
    jobId: param.jobId,
    jobCode: param.jobCode ? param.jobCode : undefined,
    jobName: param.jobName ? param.jobName : undefined,
    hasJobType: param.hasJobType ? param.hasJobType : undefined,
    isDirectCharged: undefined,
    workCategoryId: param.workCategoryId,
    workCategoryName: param.workCategoryName
      ? param.workCategoryName
      : undefined,
    workCategoryCode: param.workCategoryCode
      ? param.workCategoryCode
      : undefined,
    taskTime: param.taskTime,
    taskNote: param.taskNote || '',
    volume: 0,
    ratio: param.ratio ? param.ratio : 0,
    color: { base: '', linked: '' },
  };
  return task;
};

const getTaskListWithoutID = (taskList: DailySummaryTask[]) => {
  const newResult = [...taskList].map((item) => {
    const newItem = item;
    delete newItem.id;
    return newItem;
  });
  return newResult;
};

describe('Import Same Key', () => {
  test('should add taskTime to the same task found', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      {
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: true,
        taskTime: 60,
        taskNote: 'expected to be kept',
      },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 60 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      {
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: true,
        taskTime: 120,
        taskNote: 'expected to be kept',
      },
    ] as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('Import Diff Key', () => {
  test('should add task when imported diff with original: job ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'B' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
      creatSampleDailySummaryTask({
        jobId: 'B',
        workCategoryId: 'a',
        isDirectInput: true,
        taskTime: 30,
      }),
    ] as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should add task when imported diff with original: workCategory and original ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'b' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
      creatSampleDailySummaryTask({
        jobId: 'A',
        workCategoryId: 'b',
        isDirectInput: true,
        taskTime: 30,
      }),
    ] as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should add task when imported diff with original: isDirectInput ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: false, taskTime: 60 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: false, taskTime: 60 },
      creatSampleDailySummaryTask({
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: true,
        taskTime: 30,
      }),
    ] as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should add single task when imported diff with original: imported multi with same key', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'B' }, workCategory: { id: 'b' }, taskTime: 30 },
      { job: { id: 'B' }, workCategory: { id: 'b' }, taskTime: 90 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 60 },
      creatSampleDailySummaryTask({
        jobId: 'B',
        workCategoryId: 'b',
        isDirectInput: true,
        taskTime: 120,
      }),
    ] as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });
});

describe('Surplus Time Registration Setting', () => {
  test('should not add surplusTimeTask when has no surplusTimeRegistrationSetting', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 15 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 20 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: null,
      jobCode: null,
      jobName: null,
      workCategoryId: null,
      workCategoryCode: null,
      workCategoryName: null,
      hasJobType: false,
    } as any;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 35 },
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should not add surplusTimeTask when timeOfAttendance is null ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 100 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'B',
      jobCode: 'jobCodeB',
      jobName: 'jobNameB',
      workCategoryId: 'b',
      workCategoryCode: 'workCategoryCodeB',
      workCategoryName: 'workCategoryNameB',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = null as any;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 130 },
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should not add surplusTimeTask when has ratioInput in original', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      {
        id: 'id1',
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: true,
        ratio: null,
        taskTime: 200,
      },
      {
        id: 'id2',
        jobId: 'B',
        workCategoryId: 'b',
        isDirectInput: false,
        ratio: 20,
        taskTime: 60,
      },
      {
        id: 'id3',
        jobId: 'C',
        workCategoryId: 'c',
        isDirectInput: false,
        ratio: 80,
        taskTime: 240,
      },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 100 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'A',
      workCategoryId: 'a',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = 500;
    const expected: DailySummaryTask[] = [
      {
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: true,
        ratio: null,
        taskTime: 300,
      },
      {
        jobId: 'B',
        workCategoryId: 'b',
        isDirectInput: false,
        ratio: 20,
        taskTime: 40,
      },
      {
        jobId: 'C',
        workCategoryId: 'c',
        isDirectInput: false,
        ratio: 80,
        taskTime: 160,
      },
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should not add surplusTimeTask when has no surplusTime: equal timeOfAttendance', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 100 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'B',
      workCategoryId: 'b',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = 130;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 130 },
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should not add surplusTimeTask when has no surplusTime: larger than timeOfAttendance', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 101 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'B',
      workCategoryId: 'b',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = 130;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 131 },
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should add surplusTimeTask when has surplusTime: diff key with original ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 100 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'B',
      jobCode: 'jobCodeB',
      jobName: 'jobNameB',
      workCategoryId: 'b',
      workCategoryCode: 'workCategoryCodeB',
      workCategoryName: 'workCategoryNameB',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = 131;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 130 },
      creatSampleDailySummaryTask({
        jobId: 'B',
        jobCode: 'jobCodeB',
        jobName: 'jobNameB',
        workCategoryId: 'b',
        workCategoryCode: 'workCategoryCodeB',
        workCategoryName: 'workCategoryNameB',
        isDirectInput: false,
        taskTime: 1,
        ratio: 100,
        hasJobType: true,
      }),
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });

  test('should add surplusTimeTask when has surplusTime: same key with original ', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 100 },
    ] as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'A' }, workCategory: { id: 'a' }, taskTime: 30 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime = {
      jobId: 'A',
      workCategoryId: 'a',
      hasJobType: true,
    } as any;
    const timeOfAttendance: number | null | undefined = 200;
    const expected: DailySummaryTask[] = [
      { jobId: 'A', workCategoryId: 'a', isDirectInput: true, taskTime: 130 },
      creatSampleDailySummaryTask({
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: false,
        taskTime: 70,
        ratio: 100,
        hasJobType: true,
      }),
    ] as any;
    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );
    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });
});

describe('Re-calculation', () => {
  test('should re-calculate taskTime of Non DirectInput Tasks', () => {
    // Arrange
    const originalTaskList: DailySummaryTask[] = [
      {
        id: 'id1',
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: false,
        ratio: 60,
        taskTime: 60,
      },
      {
        id: 'id2',
        jobId: 'B',
        workCategoryId: 'b',
        isDirectInput: false,
        ratio: 40,
        taskTime: 40,
      },
    ].map(creatSampleDailySummaryTask) as any;
    const allocatedResult: AutoHoursAllocationResult[] = [
      { job: { id: 'C' }, workCategory: { id: 'c' }, taskTime: 41 },
    ] as any;
    const surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime =
      null;
    const timeOfAttendance: number | null | undefined = 100;
    const expected: DailySummaryTask[] = [
      {
        jobId: 'A',
        workCategoryId: 'a',
        isDirectInput: false,
        ratio: 60,
        taskTime: 36, // <- あまりの分数が追加される
      },
      {
        jobId: 'B',
        workCategoryId: 'b',
        isDirectInput: false,
        ratio: 40,
        taskTime: 23,
      },
      {
        jobId: 'C',
        workCategoryId: 'c',
        isDirectInput: true,
        taskTime: 41,
      },
    ].map(creatSampleDailySummaryTask) as any;

    // Act
    const result = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // remove id to Assert because Id is uuid
    const resultWithoutId = getTaskListWithoutID(result);
    // Assert
    expect(resultWithoutId).toEqual(expected);
  });
});
