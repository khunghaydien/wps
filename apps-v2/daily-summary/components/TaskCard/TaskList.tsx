import React from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from 'react-beautiful-dnd';

import { createGlobalStyle } from 'styled-components';

import { TaskInputMode } from '../../constants/TASK_INPUT_MODE';

import { DailySummaryTask } from '@apps/domain/models/time-management/DailySummaryTask';
import { WorkCategory } from '@apps/domain/models/time-tracking/WorkCategory';

import DraggableTaskRow from './DraggableTaskRow';
import {
  useFocusSequentially,
  useIsReadOnlyRatePicker,
} from './TaskList.hooks';

type Props = Readonly<{
  readOnly?: boolean;
  isTaskTimeOfRatioInputsAvailable: boolean;
  tasks: DailySummaryTask[];
  taskInputMode: TaskInputMode;
  editTaskTime: (
    index: number,
    value: string | number,
    minutes?: number
  ) => void;
  editTaskWorkCategory: (index: number, option: WorkCategory) => void;
  editTaskWorkReport: (index: number, value: string) => void;
  toggleDirectInput: (index: number) => void;
  deleteTask: (index: number) => void;
  onDragEnd: (tasks: DailySummaryTask[]) => void;
}>;

const CursorStyle = createGlobalStyle`
  body {
    cursor: move !important;
  }
`;

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TaskList = React.memo<Props>(
  (props) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const isReadOnlyRatePicker = useIsReadOnlyRatePicker(props.tasks);
    const [refs, focusNextElement] = useFocusSequentially(props.tasks.length);

    const onDragEnd: OnDragEndResponder = React.useCallback(
      ({ destination, source }) => {
        setIsDragging(false);
        if (!destination) {
          return;
        }

        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }

        const reorderedList = reorder(
          props.tasks,
          source.index,
          destination.index
        );

        props.onDragEnd(reorderedList);
      },
      [props.tasks, props.onDragEnd]
    );

    const onDragStart: OnDragStartResponder = React.useCallback(() => {
      setIsDragging(true);
    }, []);

    return (
      <>
        {isDragging && <CursorStyle />}
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="general">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {props.tasks.map((task, i) => (
                  <DraggableTaskRow
                    key={i}
                    ref={refs[i]}
                    index={i}
                    task={task}
                    taskInputMode={props.taskInputMode}
                    readOnly={props.readOnly}
                    isReadOnlyRatePicker={isReadOnlyRatePicker(i)}
                    isTaskTimeOfRatioInputsAvailable={
                      props.isTaskTimeOfRatioInputsAvailable
                    }
                    deleteTask={props.deleteTask}
                    editTaskTime={props.editTaskTime}
                    editTaskWorkCategory={props.editTaskWorkCategory}
                    editTaskWorkReport={props.editTaskWorkReport}
                    toggleDirectInput={props.toggleDirectInput}
                    focusNextElement={focusNextElement(i)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tasks === nextProps.tasks &&
    prevProps.taskInputMode === nextProps.taskInputMode &&
    prevProps.editTaskTime === nextProps.editTaskTime &&
    prevProps.editTaskWorkCategory === nextProps.editTaskWorkCategory &&
    prevProps.editTaskWorkReport === nextProps.editTaskWorkReport &&
    prevProps.toggleDirectInput === nextProps.toggleDirectInput
);

export default TaskList;
