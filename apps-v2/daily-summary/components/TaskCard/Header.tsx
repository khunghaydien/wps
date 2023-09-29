import React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import {
  TASK_INPUT_MODE,
  TaskInputMode,
} from '../../constants/TASK_INPUT_MODE';

import { Button, LinkButton, Text } from '@apps/core';
import { Color } from '@apps/core/styles';
import msg from '@commons/languages';
import TimeUtil from '@commons/utils/TimeUtil';

import defaultPermission from '@apps/domain/models/access-control/Permission';
import { AutoHoursAllocationDictSurplusTime } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import OpenAutoHoursAllocateResultDialogButton from '@apps/time-tracking/AutoHoursAllocateResultDialog/OpenAutoHoursAllocateResultDialogButton';

export type Props = {
  isTemporaryWorkTime: boolean | null | undefined;
  timeOfAttendance: number | null | undefined;
  timeOfTimeTracking: number | null;
  useWorkReportByJob: boolean;
  taskInputMode: TaskInputMode;
  switchTaskInputMode: (arg0: TaskInputMode) => void;
  useTimeAutoWorkingHourAllocation: boolean | null | undefined;
  timeOfExternalTaskTime: number;
  targetDate: string;
  empId: string;
  checkBeforeOpenAutoHoursAllocationResultDialog: () => Promise<boolean>;
  onApplyAllocateResult: (
    arg0: AutoHoursAllocationResult[],
    arg1: AutoHoursAllocationDictSurplusTime
  ) => void;
};

type CardHeaderProps = { onToggle: () => void; isOpen: boolean };

export const HeaderPropsKeys: Array<keyof Props> = [
  'isTemporaryWorkTime',
  'timeOfAttendance',
  'timeOfTimeTracking',
  'useWorkReportByJob',
  'taskInputMode',
  'switchTaskInputMode',
  'useTimeAutoWorkingHourAllocation',
  'timeOfExternalTaskTime',
  'targetDate',
  'empId',
  'checkBeforeOpenAutoHoursAllocationResultDialog',
  'onApplyAllocateResult',
];

const S = {
  Header: styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 8px 20px;
    border-radius: 8px;
    background: ${Color.base};

    ::after {
      display: block;
      content: '';
      width: 0;
      clear: both;
    }
  `,

  HeaderLeft: styled.div`
    float: left;
    height: 40px;
    display: flex;
    align-items: center;
  `,
  ModeSwitcher: styled.div`
    margin-left: 30px;

    button {
      border-color: #2782ed;
      border-left-width: 0;
      border-radius: 0;

      &:first-child {
        border-left-width: 1px;
        border-radius: 4px 0 0 4px;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
      }
    }
  `,

  ToggleButtonWrapper: styled.div`
    float: right;
    margin-left: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,

  HeaderRight: styled.div`
    float: right;
    height: 40px;
    display: flex;
    align-items: center;
  `,
  Times: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 30px;
    line-height: 19px;
  `,
  TimeLabel: styled.div`
    display: flex;
    justify-content: flex-end;
  `,
  Label: styled.span`
    margin-right: auto;
  `,
  Colon: styled.span`
    margin-left: 5px;
    margin-right: 5px;
  `,
  Time: styled(Text)`
    width: 36px;
    text-align: center;
  `,
  AutoHoursAllocate: styled.div`
    margin-left: 20px;
  `,
};

const ModeSwitcher: React.FC<
  Pick<Props, 'taskInputMode' | 'switchTaskInputMode'>
> = ({ taskInputMode, switchTaskInputMode }) => (
  <S.ModeSwitcher>
    <Button
      key="WORK_TIME"
      onClick={() => switchTaskInputMode(TASK_INPUT_MODE.WORK_DURATION)}
      color={
        taskInputMode === TASK_INPUT_MODE.WORK_DURATION ? 'primary' : 'default'
      }
    >
      {msg().Trac_Lbl_WorkDuration}
    </Button>
    <Button
      key="WORK_REPORT"
      onClick={() => switchTaskInputMode(TASK_INPUT_MODE.WORK_REPORT)}
      color={
        taskInputMode === TASK_INPUT_MODE.WORK_REPORT ? 'primary' : 'default'
      }
    >
      {msg().Trac_Lbl_WorkReport}
    </Button>
  </S.ModeSwitcher>
);

const Header: React.FC<Props & CardHeaderProps> = ({
  timeOfAttendance,
  isTemporaryWorkTime,
  timeOfTimeTracking,
  useWorkReportByJob,
  taskInputMode,
  switchTaskInputMode,
  useTimeAutoWorkingHourAllocation,
  timeOfExternalTaskTime,
  empId,
  targetDate,
  checkBeforeOpenAutoHoursAllocationResultDialog,
  onApplyAllocateResult,
  onToggle,
  isOpen,
}) => {
  const formattedTimeTracking = React.useMemo(() => {
    return !isNil(timeOfTimeTracking)
      ? TimeUtil.toHHmm(timeOfTimeTracking)
      : '-';
  }, [timeOfTimeTracking]);

  const formattedAttendance = React.useMemo(() => {
    return TimeUtil.toHHmm(timeOfAttendance);
  }, [timeOfAttendance]);

  const getTextColor = React.useCallback(
    (number: number | null | undefined): 'disable' | 'primary' => {
      return number !== 0 ? 'primary' : 'disable';
    },
    []
  );

  return (
    <S.Header>
      <S.HeaderLeft>
        <Text bold size="xl">
          {msg().Trac_Lbl_DailyTimeTrack}
        </Text>

        {useWorkReportByJob && (
          <ModeSwitcher
            taskInputMode={taskInputMode}
            switchTaskInputMode={switchTaskInputMode}
          />
        )}
      </S.HeaderLeft>

      <S.ToggleButtonWrapper>
        <LinkButton onClick={onToggle} size="large">
          {isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
        </LinkButton>
      </S.ToggleButtonWrapper>

      <S.HeaderRight>
        <S.Times>
          <S.TimeLabel>
            <S.Label>{msg().Trac_Lbl_TimeOfTimeTracking}</S.Label>
            <S.Colon>:</S.Colon>
            <S.Time size="large" bold color={getTextColor(timeOfTimeTracking)}>
              {formattedTimeTracking}
            </S.Time>
          </S.TimeLabel>
          {timeOfAttendance !== null && (
            <S.TimeLabel>
              <S.Label>
                {isTemporaryWorkTime
                  ? msg().Cal_Lbl_TemporaryWorkHours
                  : msg().Trac_Lbl_TimeOfAttendance}
              </S.Label>
              <S.Colon>:</S.Colon>
              <S.Time size="large" bold color={getTextColor(timeOfAttendance)}>
                {formattedAttendance}
              </S.Time>
            </S.TimeLabel>
          )}
        </S.Times>

        {useTimeAutoWorkingHourAllocation && (
          <S.AutoHoursAllocate>
            <OpenAutoHoursAllocateResultDialogButton
              color="primary"
              empId={empId}
              targetDate={targetDate}
              timeOfAttendance={timeOfAttendance}
              timeOfExternalTaskTime={timeOfExternalTaskTime}
              onApply={onApplyAllocateResult}
              userPermission={defaultPermission}
              checkBeforeOpen={checkBeforeOpenAutoHoursAllocationResultDialog}
            />
          </S.AutoHoursAllocate>
        )}
      </S.HeaderRight>
    </S.Header>
  );
};

const HOCHeader = (contentProps: Props) =>
  function HeaderWithProps(cardHeaderProps: CardHeaderProps) {
    const props: Props & CardHeaderProps = {
      ...contentProps,
      ...cardHeaderProps,
    };
    return <Header {...props} />;
  };

export default HOCHeader;
