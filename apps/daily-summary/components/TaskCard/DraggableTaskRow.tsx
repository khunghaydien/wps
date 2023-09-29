import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import styled from 'styled-components';

import { TaskInputMode } from '../../constants/TASK_INPUT_MODE';

import { Color } from '@apps/core/styles';

import { DailySummaryTask } from '@apps/domain/models/time-management/DailySummaryTask';
import { WorkCategory } from '@apps/domain/models/time-tracking/WorkCategory';

import TaskRow from './TaskRow';

type Props = Readonly<{
  index: number;
  task: DailySummaryTask;
  taskInputMode: TaskInputMode;
  readOnly?: boolean;
  isReadOnlyRatePicker: boolean;
  isTaskTimeOfRatioInputsAvailable: boolean;
  editTaskTime: (
    index: number,
    value: string | number,
    minutes?: number
  ) => void;
  editTaskWorkCategory: (index: number, option: WorkCategory) => void;
  editTaskWorkReport: (index: number, value: string) => void;
  toggleDirectInput: (index: number) => void;
  deleteTask: (index: number) => void;
  focusNextElement: (arg0: React.KeyboardEvent<HTMLInputElement>) => void;
}>;

const S = {
  TaskRowWrapper: styled.div`
    border-bottom: 1px solid ${Color.border1};
  `,
};

const DraggableTaskRow = React.memo(
  React.forwardRef<HTMLInputElement, Props>(
    (
      {
        index,
        task,
        taskInputMode,
        readOnly,
        isReadOnlyRatePicker,
        isTaskTimeOfRatioInputsAvailable,
        ...props
      },
      ref
    ) => {
      return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided, snapshot) => (
            <S.TaskRowWrapper
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <TaskRow
                ref={ref}
                index={index}
                isDragging={snapshot.isDragging}
                isTaskTimeOfRatioInputsAvailable={
                  isTaskTimeOfRatioInputsAvailable
                }
                dragHandleProps={provided.dragHandleProps}
                readOnly={readOnly}
                readOnlyRatePicker={isReadOnlyRatePicker}
                task={task}
                taskInputMode={taskInputMode}
                onClickToggle={props.toggleDirectInput}
                onDelete={props.deleteTask}
                onKeyDown={props.focusNextElement}
                onSelectTaskTime={props.editTaskTime}
                onSelectWorkCategory={props.editTaskWorkCategory}
                onChangeWorkReport={props.editTaskWorkReport}
              />
            </S.TaskRowWrapper>
          )}
        </Draggable>
      );
    }
  ),
  (prevProps, nextProps) =>
    prevProps.index === nextProps.index &&
    prevProps.task === nextProps.task &&
    prevProps.taskInputMode === nextProps.taskInputMode &&
    prevProps.isReadOnlyRatePicker === nextProps.isReadOnlyRatePicker &&
    prevProps.editTaskTime === nextProps.editTaskTime &&
    prevProps.editTaskWorkCategory === nextProps.editTaskWorkCategory &&
    prevProps.editTaskWorkReport === nextProps.editTaskWorkReport &&
    prevProps.toggleDirectInput === nextProps.toggleDirectInput
);

export default DraggableTaskRow;
