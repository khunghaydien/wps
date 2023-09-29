import * as React from 'react';

import styled from 'styled-components';

import {
  TASK_INPUT_MODE,
  TaskInputMode,
} from '../../constants/TASK_INPUT_MODE';

import { Card, Icons, Text } from '@apps/core';
import { Color } from '@apps/core/styles';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import { DailySummaryTask } from '@apps/domain/models/time-management/DailySummaryTask';
import { WorkCategory } from '@apps/domain/models/time-tracking/WorkCategory';

import AddJobButtonContainer from '../../containers/AddJobButtonContainer';

import HOCHeader, { HeaderPropsKeys, Props as HeaderProps } from './Header';
import TaskList from './TaskList';

type Props = Readonly<
  HeaderProps & {
    containsNonDirectInputTask: boolean;
    readOnly?: boolean;
    isTaskTimeOfRatioInputsAvailable: boolean;
    tasks: DailySummaryTask[];
    taskInputMode: TaskInputMode;
    totalRatio: number;
    sortKey: 'jobCode' | 'workCategoryCode' | 'taskTime' | null;
    order: 'asc' | 'desc';
    sort: (key: 'jobCode' | 'workCategoryCode' | 'taskTime') => void;
    unsort: () => void;
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
  }
>;

const S = {
  Wrapper: styled.div`
    width: 100%;
  `,
  Columns: styled.div`
    position: sticky;
    top: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 731px;
    height: 26px;
    background: ${Color.pane};
    border-top: 1px solid ${Color.border1};
    border-bottom: 1px solid ${Color.border1};
  `,
  Job: styled.div`
    flex: 1 1 auto;
    width: 100%;
    min-width: 195px;
    margin: 0 0 0 26px;
  `,
  WorkCategory: styled.div`
    flex: 1 1 auto;
    width: 100%;
    min-width: 195px;
  `,
  WorkReport: styled.div`
    flex: 1 1 auto;
    width: 100%;
    min-width: 195px;
  `,
  TimeTracking: styled.div<{ narrow: boolean }>`
    flex: 0 0 ${({ narrow }) => (narrow ? 222 : 252)}px;
  `,
  TaskRowWrapper: styled.div`
    border-bottom: 1px solid ${Color.border1};
  `,
  NoTaskMessage: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
  `,
  AddJobButtonWrapper: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  `,
  TooltipWrapper: styled.div`
    position: absolute;

    /* padding */
    right: 20px;
  `,
  TotalMessageWrapper: styled.div`
    display: flex;
    align-items: center;
  `,
  Percentage: styled(Text)`
    width: 40px;
    text-align: right;
  `,
  MarginRight: styled.div<{ value: string }>`
    margin-right: ${({ value }) => `${value}px`};
  `,
  ListHeaderLabel: styled.label`
    display: flex;
    align-items: center;
    width: fit-content;
  `,
  SortLabel: styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
  `,
  SortButton: styled.button`
    margin-left: 12px;
    background-color: transparent;
    border: none;
    outline: none;
    padding: 0;
    appearance: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  `,
  SortArrow: styled(({ isSorted: _0, order: _1, ...props }) => (
    <Icons.Arrow {...props} />
  ))<{
    isSorted: boolean;
    order: 'asc' | 'desc';
  }>`
    fill: ${({ isSorted }) => (isSorted ? '#2782ED' : '#C5DEFC')};
    transform: rotateX(
      ${({ order }) => (order === 'desc' ? '0deg' : '180deg')}
    );
  `,
};

const TotalMessage = ({
  isFull,
  totalRatio,
}: {
  isFull: boolean;
  totalRatio: number;
}) => {
  return (
    <S.TotalMessageWrapper>
      {!isFull && (
        <S.MarginRight value="4">
          <Icons.Attention color="error" />
        </S.MarginRight>
      )}
      <S.MarginRight value="4">
        <Text size="large">{`${msg().Trac_Lbl_PercentageTotal}:`}</Text>
      </S.MarginRight>
      <S.Percentage
        bold
        color={isFull ? 'primary' : 'error'}
        size="large"
      >{`${totalRatio}%`}</S.Percentage>
    </S.TotalMessageWrapper>
  );
};

const TaskCard = ({
  taskInputMode,
  sort,
  unsort,
  sortKey,
  order,
  ...props
}: Props) => {
  const CardHeader = React.useMemo(
    () => HOCHeader({ taskInputMode, ...props }),
    /* propsは実行の都度生成されるのでuseMemoのdepsには不適格 */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [taskInputMode, ...HeaderPropsKeys.map((key) => props[key])]
  );

  const isFull = React.useMemo(() => {
    return props.totalRatio === 100;
  }, [props.totalRatio]);

  return (
    <S.Wrapper>
      <Card defaultOpen header={CardHeader}>
        <S.Columns>
          <S.Job>
            <S.SortLabel>
              <Text size="medium" color="action">
                {msg().Trac_Lbl_Job}
              </Text>
              <S.SortButton onClick={() => sort('jobCode')}>
                <S.SortArrow
                  isSorted={sortKey === 'jobCode'}
                  order={sortKey === 'jobCode' ? order : 'desc'}
                />
              </S.SortButton>
            </S.SortLabel>
          </S.Job>

          {taskInputMode === TASK_INPUT_MODE.WORK_DURATION && (
            <S.WorkCategory>
              <S.SortLabel>
                <Text size="medium" color="action">
                  {msg().Trac_Lbl_WorkCategory}
                </Text>
                <S.SortButton onClick={() => sort('workCategoryCode')}>
                  <S.SortArrow
                    isSorted={sortKey === 'workCategoryCode'}
                    order={sortKey === 'workCategoryCode' ? order : 'desc'}
                  />
                </S.SortButton>
              </S.SortLabel>
            </S.WorkCategory>
          )}
          {taskInputMode === TASK_INPUT_MODE.WORK_REPORT && (
            <S.WorkReport>
              <S.ListHeaderLabel>
                <Text size="medium" color="action">
                  {msg().Trac_Lbl_WorkReport}
                </Text>
              </S.ListHeaderLabel>
            </S.WorkReport>
          )}

          <S.TimeTracking narrow={props.readOnly}>
            {taskInputMode === TASK_INPUT_MODE.WORK_DURATION && (
              <S.SortLabel>
                <Text size="medium" color="action">
                  {msg().Trac_Lbl_TimeTrack}
                </Text>
                <S.SortButton onClick={() => sort('taskTime')}>
                  <S.SortArrow
                    isSorted={sortKey === 'taskTime'}
                    order={sortKey === 'taskTime' ? order : 'desc'}
                  />
                </S.SortButton>
              </S.SortLabel>
            )}
          </S.TimeTracking>
        </S.Columns>

        {props.tasks.length > 0 ? (
          <TaskList
            readOnly={props.readOnly}
            tasks={props.tasks}
            taskInputMode={taskInputMode}
            isTaskTimeOfRatioInputsAvailable={
              props.isTaskTimeOfRatioInputsAvailable
            }
            deleteTask={props.deleteTask}
            editTaskTime={props.editTaskTime}
            editTaskWorkCategory={props.editTaskWorkCategory}
            editTaskWorkReport={props.editTaskWorkReport}
            toggleDirectInput={props.toggleDirectInput}
            onDragEnd={props.onDragEnd}
          />
        ) : (
          <S.NoTaskMessage>
            <Text color="primary" size="medium">
              {msg().Trac_Lbl_NoJobItem}
            </Text>
          </S.NoTaskMessage>
        )}
        <S.AddJobButtonWrapper>
          <AddJobButtonContainer unsort={unsort} />
          {props.containsNonDirectInputTask && (
            <S.TooltipWrapper>
              {!isFull ? (
                <Tooltip
                  id="total-message"
                  align="top right"
                  content={msg().Trac_Lbl_PercentageTotalErr}
                >
                  <div>
                    <TotalMessage
                      isFull={isFull}
                      totalRatio={props.totalRatio}
                    />
                  </div>
                </Tooltip>
              ) : (
                <TotalMessage isFull={isFull} totalRatio={props.totalRatio} />
              )}
            </S.TooltipWrapper>
          )}
        </S.AddJobButtonWrapper>
      </Card>
    </S.Wrapper>
  );
};

export default TaskCard;
