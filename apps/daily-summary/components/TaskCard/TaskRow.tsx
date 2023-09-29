import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

import styled, { css } from 'styled-components';

import {
  TASK_INPUT_MODE,
  TaskInputMode,
} from '../../constants/TASK_INPUT_MODE';

import {
  IconButton,
  Icons,
  RatePicker,
  Text,
  TextField,
  TimePicker,
  ToggleSwitchButton,
} from '../../../core';
import Tooltip from '@apps/commons/components/Tooltip';
import { Switch } from '@apps/core/blocks/buttons/ToggleSwitchButton';
import { Color } from '@apps/core/styles';
import msg from '@commons/languages';
import TimeUtil from '@commons/utils/TimeUtil';

import {
  DailySummaryTask,
  hasWorkCategory,
} from '@apps/domain/models/time-management/DailySummaryTask';
import { WorkCategory } from '@apps/domain/models/time-tracking/WorkCategory';

import WorkCategoryDropdownContainer from '../../containers/WorkCategoryDropdownContainer';

import DragHandler from '../../images/drag_handler.svg';

type Props = {
  index: number;
  readOnly?: boolean;
  readOnlyRatePicker: boolean;
  isTaskTimeOfRatioInputsAvailable: boolean;
  task: DailySummaryTask;
  taskInputMode: TaskInputMode;
  isDragging: boolean;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  onClickToggle: (index: number) => void;
  onDelete: (index: number) => void;
  onKeyDown: (arg0: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelectTaskTime: (
    index: number,
    value: string | number,
    minutes?: number
  ) => void;
  onSelectWorkCategory: (index: number, option: WorkCategory) => void;
  onChangeWorkReport: (index: number, value: string) => void;
};

const ColumnCommon = styled.div`
  min-height: 48px;
  padding: 8px 0;
` as React.ComponentType<{ children: React.ReactNode }>;

const S = {
  Wrapper: styled.div<{ isDragging: boolean }>`
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-width: 731px;
    min-height: 48px;
    background: ${Color.base};
    cursor: pointer;
    &:hover {
      background: #f3f2f2;
    }

    ${({ isDragging }) =>
      isDragging &&
      css`
        background: #ebf3f7;
      `}
  `,

  DragHandlerWrapper: styled.div`
    display: flex;
    align-items: center;
    margin: 0 0 0 8px;
    padding: 17px 0; // (48px - 14px) / 2
  `,

  JobWrapper: styled(ColumnCommon)`
    flex: 1 1 195px;
    min-width: 195px;
    width: 100%;
    height: 32px;
    margin: 0 0 0 12px;
  `,

  Job: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,

  WorkCategory: styled(ColumnCommon)`
    flex: 1 1 195px;
    min-width: 195px;
    width: 100%;
    margin: 0 0 0 40px;

    /**
     * Center vertically
     */
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  `,

  Attribute: styled(ColumnCommon)`
    flex: 0 0 32px;
    margin: 0 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  LockedIcon: styled(Icons.Locked)`
    fill: #828282;
  `,

  Toggle: styled(ColumnCommon)`
    flex: 0 0 64px;
  `,

  TaskTime: styled(ColumnCommon)`
    flex: 0 0 120px;
    margin: 0 0 0 12px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  `,

  Time: styled.div`
    width: 36px;
    margin: 0 0 0 12px;
    text-align: center;
  `,

  WorkReport: styled(ColumnCommon)`
    flex: 1 1 431px; // 195px + 4px + 32px + 4px + 64px + 12px + 120px
    min-width: 431px;
    width: 100%;
    margin: 0 0 0 40px;
    padding: 6px 0; // (48px - 34px) / 2
    line-height: 1;
  `,
  WorkReportTextField: styled(TextField)`
    min-height: 34px;
    line-height: 1.5;
  `,

  DeleteButton: styled.div`
    flex: 0 0 16px;
    margin: 0 20px;
    padding: 16px 0; // (48px - 16px) / 2
  `,
  DeleteButtonSpacer: styled.div`
    flex: 0 0 26px;
    width: 26px;
    min-width: 26px;
    max-width: 26px;
  `,

  IconButton: styled(IconButton)`
    width: 16px;
    height: 16px;
  `,

  Text: styled(Text)`
    width: 100%;
    cursor: text;
  `,
  InheritText: styled(Text)`
    color: inherit;
  `,
  TooltipContent: styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 190px;
  `,
};

const Options: [Switch, Switch] = [
  { icon: Icons.Clock, value: 'time' },
  { icon: Icons.Percent, value: 'rate' },
];

const TaskRow = React.forwardRef<HTMLInputElement, Props>(
  ({ task, index, taskInputMode, ...props }, ref) => {
    const timeInputMode = React.useMemo(
      () => (task.isDirectInput ? 'time' : 'rate'),
      [task.isDirectInput]
    );

    return (
      <S.Wrapper isDragging={props.isDragging}>
        <S.DragHandlerWrapper key="dragHandler" {...props.dragHandleProps}>
          <DragHandler />
        </S.DragHandlerWrapper>
        <S.JobWrapper key="job">
          <Tooltip
            id={task.jobId}
            content={
              <S.TooltipContent tabIndex={0}>
                <S.InheritText size="small">{task.jobCode}</S.InheritText>
                <S.InheritText size="large">{task.jobName}</S.InheritText>
              </S.TooltipContent>
            }
            align="top left"
          >
            <S.Job>
              <S.Text size="small">{task.jobCode}</S.Text>
              <S.Text size="large">{task.jobName}</S.Text>
            </S.Job>
          </Tooltip>
        </S.JobWrapper>

        {taskInputMode === TASK_INPUT_MODE.WORK_DURATION && (
          <React.Fragment key="inputWorkDuration">
            <S.WorkCategory key="workCategory">
              {hasWorkCategory(task) && (
                <WorkCategoryDropdownContainer
                  jobId={task.jobId}
                  selected={task}
                  onSelect={(wc) => {
                    props.onSelectWorkCategory(index, wc);
                  }}
                  readOnly={props.readOnly || task.isEditLocked}
                />
              )}
            </S.WorkCategory>
            <S.Attribute key="attribute">
              {task.isEditLocked && (
                <Tooltip
                  id={`${task.jobId}-${task.workCategoryId}`}
                  content={
                    <S.TooltipContent tabIndex={0}>
                      <S.InheritText size="large">
                        {msg().Time_Lbl_LockedJobToolTip}
                      </S.InheritText>
                    </S.TooltipContent>
                  }
                  align="top left"
                >
                  <S.LockedIcon size="medium" />
                </Tooltip>
              )}
            </S.Attribute>
            <S.Toggle key="toggle">
              <ToggleSwitchButton
                disabled={props.readOnly || task.isEditLocked}
                options={Options}
                onClick={() => {
                  props.onClickToggle(index);
                }}
                value={timeInputMode}
              />
            </S.Toggle>
            <S.TaskTime key="taskTime">
              {task.isDirectInput ? (
                <TimePicker
                  key="time-picker"
                  ref={ref}
                  readOnly={props.readOnly || task.isEditLocked}
                  minMinutes={30}
                  maxMinutes={1441}
                  maxValidMinutes={1441}
                  placeholder="0"
                  value={TimeUtil.toHHmm(task.taskTime)}
                  onKeyDown={props.onKeyDown}
                  onSelect={(value, minutes) => {
                    props.onSelectTaskTime(index, value, minutes);
                  }}
                />
              ) : (
                <RatePicker
                  key="rate-picker"
                  ref={ref}
                  placeholder="0"
                  readOnly={
                    props.readOnly ||
                    props.readOnlyRatePicker ||
                    task.isEditLocked
                  }
                  value={String(task.ratio)}
                  onKeyDown={props.onKeyDown}
                  onSelect={(value) => {
                    props.onSelectTaskTime(index, value);
                  }}
                />
              )}
              {task.isDirectInput ? (
                <S.Time />
              ) : (
                <S.Time>
                  {props.isTaskTimeOfRatioInputsAvailable ? (
                    <Text size="large">{TimeUtil.toHHmm(task.taskTime)}</Text>
                  ) : (
                    '-'
                  )}
                </S.Time>
              )}
            </S.TaskTime>
          </React.Fragment>
        )}

        {taskInputMode === TASK_INPUT_MODE.WORK_REPORT && (
          <React.Fragment key="inputWorkReport">
            <S.WorkReport>
              <S.WorkReportTextField
                resize="vertical"
                maxRows={3}
                readOnly={props.readOnly}
                value={task.taskNote}
                onChange={(e) =>
                  props.onChangeWorkReport(index, e.currentTarget.value)
                }
              />
            </S.WorkReport>
          </React.Fragment>
        )}

        {!props.readOnly ? (
          <S.DeleteButton key="delete" onClick={() => props.onDelete(index)}>
            <S.IconButton icon={Icons.Delete} />
          </S.DeleteButton>
        ) : (
          <S.DeleteButtonSpacer key="deleteSpacer" />
        )}
      </S.Wrapper>
    );
  }
);

export default TaskRow;
