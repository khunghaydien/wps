import React from 'react';

import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';

import { TASK_INPUT_MODE } from '../../constants/TASK_INPUT_MODE';

import { CoreProvider } from '../../../core';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import TaskCard from '../TaskCard';
import storeMock from './mocks/store.mock';
import tasks from './mocks/tasks.mock';

const store = configureStore(storeMock);

const switchTaskInputMode = () => action('switchTaskInputMode');
const editTaskTime = () => action('editTaskTime');
const editTaskWorkCategory = () => action('editTaskWorkCategory');
const editTaskWorkReport = () => action('editTaskWorkReport');
const toggleDirectInput = () => action('toggleDirectInput');
const deleteTask = () => action('deleteTask');
const onDragEnd = () => action('onDragEnd');
const sort = () => action('sort');
const unsort = () => action('unsort');

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
};

export default {
  title: 'daily-summary/TaskCard',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

export const HasJob: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable={false}
    tasks={tasks}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfTimeTracking={590}
    timeOfAttendance={null}
    totalRatio={80}
    order="desc"
    sortKey={null}
    {...handlers}
  />
);

HasJob.storyName = 'has Job';

export const HasJobWithWorkReportInput: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable={false}
    tasks={tasks}
    taskInputMode={TASK_INPUT_MODE.WORK_REPORT}
    timeOfTimeTracking={590}
    timeOfAttendance={null}
    totalRatio={80}
    order="desc"
    sortKey={null}
    {...handlers}
  />
);

HasJobWithWorkReportInput.storyName = 'has Job with work report input';

export const NoJob: Story = () => (
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
    {...handlers}
  />
);

NoJob.storyName = 'no job';

export const _ReadOnly: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask={false}
    readOnly
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable
    tasks={[]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfAttendance={null}
    timeOfTimeTracking={250}
    totalRatio={0}
    order="desc"
    sortKey={null}
    {...handlers}
  />
);

_ReadOnly.storyName = 'readOnly';

export const SortWorkCategoryDesc: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable={false}
    tasks={tasks}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfTimeTracking={590}
    timeOfAttendance={null}
    totalRatio={80}
    order="desc"
    sortKey="workCategoryCode"
    {...handlers}
  />
);

export const SortWorkCategoryAsc: Story = () => (
  <TaskCard
    useWorkReportByJob
    containsNonDirectInputTask
    isTemporaryWorkTime={false}
    isTaskTimeOfRatioInputsAvailable={false}
    tasks={tasks}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    timeOfTimeTracking={590}
    timeOfAttendance={null}
    totalRatio={80}
    order="asc"
    sortKey="workCategoryCode"
    {...handlers}
  />
);
