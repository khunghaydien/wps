import React, { FC } from 'react';

import { action } from '@storybook/addon-actions';

import { TASK_INPUT_MODE } from '../../constants/TASK_INPUT_MODE';

import { CoreProvider } from '../../../core';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import TaskRow from '../TaskCard/TaskRow';
import storeMock from './mocks/store.mock';
import tasks from './mocks/tasks.mock';

interface FCStory extends FC {
  storyName?: string;
}

const draggablePropsMock = {
  'data-rbd-drag-handle-draggable-id': 'f7b95240-98fc-4af8-b9c8-c94576e33e2a',
  'data-rbd-drag-handle-context-id': '0',
  'aria-describedby': 'rbd-hidden-text-0-hidden-text-0',
  role: 'button',
  tabIndex: 0,
  draggable: false,
  onDragStart: () => {},
};

const handlers = {
  onClickToggle: () => action('onClickToggle'),
  onKeyDown: () => action('onKeyDown'),
  onSelectTaskTime: () => action('onSelectTaskTime'),
  onSelectWorkCategory: () => action('onSelectWorkCategory'),
  onChangeWorkReport: () => action('onChangeWorkReport'),
  onDelete: () => action('onDelete'),
};

const store = configureStore(storeMock);

export default {
  title: 'daily-summary/TaskCard/Row',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

export const Default: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[1]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

Default.storyName = 'default';

export const NoWorkCategory: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[0]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

NoWorkCategory.storyName = 'no work category';

export const RatioInput: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[3]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

RatioInput.storyName = 'ratio input';

export const WorkReportInput: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[3]}
    taskInputMode={TASK_INPUT_MODE.WORK_REPORT}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

WorkReportInput.storyName = 'work report input';

export const NoJobType: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[4]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

NoJobType.storyName = 'no job type';

export const EditLocked: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={{ ...tasks[0], isEditLocked: true }}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

EditLocked.storyName = 'edit locked';

export const __ReadOnly: FCStory = () => (
  <TaskRow
    index={0}
    isDragging={false}
    readOnly
    readOnlyRatePicker={false}
    isTaskTimeOfRatioInputsAvailable
    task={tasks[4]}
    taskInputMode={TASK_INPUT_MODE.WORK_DURATION}
    dragHandleProps={draggablePropsMock}
    {...handlers}
  />
);

__ReadOnly.storyName = 'readOnly';
