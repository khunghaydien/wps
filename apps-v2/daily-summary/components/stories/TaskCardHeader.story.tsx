import React from 'react';

import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';

import { TASK_INPUT_MODE } from '../../constants/TASK_INPUT_MODE';

import { CoreProvider } from '../../../core';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import TaskCard from '../TaskCard';
import storeMock from './mocks/store.mock';

const store = configureStore(storeMock);

export default {
  title: 'daily-summary/TaskCard/Header',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

const switchTaskInputMode = () => action('switchTaskInputMode');
const editTaskTime = () => action('editTaskTime');
const editTaskWorkCategory = () => action('editTaskWorkCategory');
const editTaskWorkReport = () => action('editTaskWorkReport');
const toggleDirectInput = () => action('toggleDirectInput');
const deleteTask = () => action('deleteTask');
const onDragEnd = () => action('onDragEnd');
const sort = () => action('sort');
const unsort = () => action('unsort');
const onApplyAllocateResult = () => {};
const checkBeforeOpenAutoHoursAllocationResultDialog =
  (() => {}) as () => Promise<boolean>;

const handlers = {
  switchTaskInputMode,
  editTaskTime,
  editTaskWorkCategory,
  editTaskWorkReport,
  toggleDirectInput,
  deleteTask,
  onDragEnd,
  sort,
  unsort,
  onApplyAllocateResult,
  checkBeforeOpenAutoHoursAllocationResultDialog,
};

export const _0000: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfTimeTracking={0}
    timeOfAttendance={null}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={true}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={0}
    {...handlers}
  />
);

_0000.storyName = '00:00';

export const OnlyTimeTracking: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={null}
    timeOfTimeTracking={250}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={true}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={250}
    {...handlers}
  />
);

OnlyTimeTracking.storyName = 'Only TimeTracking';

export const HasAttendance: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={250}
    timeOfTimeTracking={420}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={true}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={420}
    {...handlers}
  />
);

HasAttendance.storyName = 'hasAttendance';

export const OnDuty: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={250}
    timeOfTimeTracking={500}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={true}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={500}
    {...handlers}
  />
);

OnDuty.storyName = 'on Duty';

export const NoTimeTracking: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={250}
    timeOfTimeTracking={null}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={true}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={0}
    {...handlers}
  />
);

NoTimeTracking.storyName = 'No TimeTracking';

export const NoAutoWorkingHourAllocationUsed: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={250}
    timeOfTimeTracking={100}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={false}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={100}
    {...handlers}
  />
);

NoAutoWorkingHourAllocationUsed.storyName = 'No AutoWorkingHourAllocation Used';

export const NoWorkReportByJobUsed: Story = () => (
  <TaskCard
    useWorkReportByJob={false}
    containsNonDirectInputTask
    isTemporaryWorkTime
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={250}
    timeOfTimeTracking={100}
    totalRatio={100}
    order="desc"
    sortKey={null}
    useTimeAutoWorkingHourAllocation={false}
    targetDate="2022-2-21"
    empId="dummyEmpId"
    timeOfExternalTaskTime={100}
    {...handlers}
  />
);

NoWorkReportByJobUsed.storyName = 'No WorkReportByJob Used';
