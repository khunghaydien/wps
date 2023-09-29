import * as React from 'react';

import styled from 'styled-components';

import AttTimeField from '@apps/commons/components/fields/AttTimeField';
import msg from '@apps/commons/languages';
import LinkButton from '@apps/core/blocks/buttons/LinkButton';
import TextField from '@apps/core/elements/TextField';

import { DailyObjectivelyEventLogDeviationReasons } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';
import { RestTimes } from '@attendance/domain/models/RestTime';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import DailyDeviatedReason from '@apps/attendance/timesheet-pc/components/dialogs/DailyAttTimeDialog/Content/Fields/DailyDeviatedReason';

import $FieldItem from './FieldItem';
import ObjectivelyEventLog from './Fields/ObjectivelyEventLog';
import OtherRestTime from './Fields/OtherRestTime';
import RestTime from './Fields/RestTime';
import {
  DeviationReason,
  EditingDailyAttendanceTimeViewModel as DailyAttTimeViewModel,
} from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';
import * as helper from '@attendance/ui/helpers/dailyRecord';

const FieldItem = styled($FieldItem)<{ enabledRestReason: boolean }>`
  &&& {
    .content {
      ${({ enabledRestReason }) => (enabledRestReason ? 'width: 530px;' : '')};
    }
  }
`;

const Section = styled.div`
  border-bottom: 1px solid #d8dde6;
  :last-child {
    border: 0px;
  }

  // ReadOnly の書式をそろえている
  textarea:disabled,
  input:disabled,
  button[readonly] {
    border-color: rgba(216, 221, 230, 0.2);
    background: rgba(255, 255, 255, 0.2);
    color: #000;
  }
`;

const ObjectivelyEventLogContainer = styled.div`
  padding-top: 14px;
`;

const ClockInContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Content: React.FC<{
  loading: boolean;
  enabledObjectivelyEventLog: boolean;
  readOnly: boolean;
  lockedDailyRecord: boolean;
  lockedSummary: boolean;
  enabledRestReason: boolean;
  enabledDeviationReason: boolean;
  enabledDeviationReasonText: boolean;
  maxRestTimesCount: number;
  dailyAttTime: DailyAttTimeViewModel;
  restTimeReasons: RestTimeReason[];
  dailyDeviatedReasons: DailyObjectivelyEventLogDeviationReasons;
  onUpdateRemarks: (value: string) => void;
  onUpdateDeviationReasonId: (value: string) => void;
  onUpdateDeviationReason: (
    name: 'entering' | 'leaving',
    key: keyof DeviationReason,
    value: string
  ) => void;
  onUpdateClockTime: (arg0: string, arg1: unknown) => void;
  onAddRestTime: () => void;
  onDeleteRestTime: (idx: number) => void;
  onUpdateRestTime: (
    idx: number,
    restTime: DailyAttTimeViewModel['restTimes'][number]
  ) => void;
  onOpenDailyObjectivelyEventLogDialog: () => void;
}> = ({
  loading = false,
  enabledObjectivelyEventLog,
  readOnly,
  maxRestTimesCount,
  dailyAttTime,
  restTimeReasons,
  dailyDeviatedReasons,
  lockedSummary,
  lockedDailyRecord,
  enabledRestReason,
  enabledDeviationReason,
  enabledDeviationReasonText,
  onUpdateRemarks,
  onUpdateDeviationReason,
  onUpdateClockTime,
  onAddRestTime,
  onDeleteRestTime,
  onUpdateRestTime,
  onUpdateDeviationReasonId,
  onOpenDailyObjectivelyEventLogDialog,
}) => {
  const { restTimes, dailyObjectivelyEventLog } = dailyAttTime;
  return (
    <>
      <Section key="clock-in">
        <FieldItem
          label={msg().Att_Lbl_TimeIn}
          key="clock-in"
          enabledRestReason={enabledRestReason}
        >
          <ClockInContainer>
            <AttTimeField
              value={helper.time.toHHmm(dailyAttTime.startTime)}
              onBlur={(value) =>
                onUpdateClockTime(
                  'startTime',
                  helper.time.toNumberOrNull(value)
                )
              }
              disabled={
                loading || lockedSummary || lockedDailyRecord || readOnly
              }
            />
            {enabledObjectivelyEventLog ? (
              <LinkButton
                onClick={onOpenDailyObjectivelyEventLogDialog}
                disabled={loading}
              >
                {msg().Att_Btn_ObjectivelyEventLog}
              </LinkButton>
            ) : null}
          </ClockInContainer>
          {enabledObjectivelyEventLog ? (
            <ObjectivelyEventLogContainer>
              <ObjectivelyEventLog
                type={'entering'}
                records={dailyObjectivelyEventLog?.logs}
                inputTime={dailyAttTime.startTime}
                reason={
                  !dailyObjectivelyEventLog?.deviatedEnteringTimeReason?.text
                    ? dailyObjectivelyEventLog?.deviatedEnteringTimeReason
                        ?.value
                    : dailyObjectivelyEventLog?.deviatedEnteringTimeReason?.text
                }
              />
            </ObjectivelyEventLogContainer>
          ) : (
            ''
          )}
        </FieldItem>
        {enabledObjectivelyEventLog &&
        (enabledDeviationReason || enabledDeviationReasonText) ? (
          <FieldItem
            label={msg().Att_Lbl_DeviatedReason}
            key="deviated-entering-time-reason"
            enabledRestReason={enabledRestReason}
          >
            {enabledDeviationReason && (
              <DailyDeviatedReason
                type={'entering'}
                value={dailyObjectivelyEventLog?.deviatedEnteringTimeReason}
                disabled={loading || lockedSummary || readOnly}
                lockedSummary={lockedSummary}
                id={dailyDeviatedReasons?.id}
                deviatedReasons={dailyDeviatedReasons?.deviationReasons}
                onUpdateDeviationReason={onUpdateDeviationReason}
                onUpdateDeviationReasonId={onUpdateDeviationReasonId}
              />
            )}
            {enabledDeviationReasonText && (
              <TextField
                minRows={3}
                value={
                  dailyObjectivelyEventLog?.deviatedEnteringTimeReason?.text
                }
                onChange={(event) => {
                  onUpdateDeviationReason(
                    'entering',
                    'text',
                    event.target.value
                  );
                }}
                disabled={loading || lockedSummary || readOnly}
              />
            )}
          </FieldItem>
        ) : (
          ''
        )}
      </Section>

      <Section key="clock-out">
        <FieldItem
          label={msg().Att_Lbl_TimeOut}
          key="clock-out"
          enabledRestReason={enabledRestReason}
        >
          <AttTimeField
            value={helper.time.toHHmm(dailyAttTime.endTime)}
            onBlur={(value) =>
              onUpdateClockTime('endTime', helper.time.toNumberOrNull(value))
            }
            disabled={loading || lockedSummary || lockedDailyRecord || readOnly}
          />
          {enabledObjectivelyEventLog ? (
            <ObjectivelyEventLogContainer>
              <ObjectivelyEventLog
                type={'leaving'}
                records={dailyObjectivelyEventLog?.logs}
                inputTime={dailyAttTime.endTime}
                reason={
                  !dailyObjectivelyEventLog?.deviatedLeavingTimeReason?.text
                    ? dailyObjectivelyEventLog?.deviatedLeavingTimeReason?.value
                    : dailyObjectivelyEventLog?.deviatedLeavingTimeReason?.text
                }
              />
            </ObjectivelyEventLogContainer>
          ) : (
            ''
          )}
        </FieldItem>
        {enabledObjectivelyEventLog &&
        (enabledDeviationReason || enabledDeviationReasonText) ? (
          <FieldItem
            label={msg().Att_Lbl_DeviatedReason}
            key="deviated-leaving-time-reason"
            enabledRestReason={enabledRestReason}
          >
            {enabledDeviationReason && (
              <DailyDeviatedReason
                type={'leaving'}
                value={dailyObjectivelyEventLog?.deviatedLeavingTimeReason}
                disabled={loading || lockedSummary || readOnly}
                lockedSummary={lockedSummary}
                id={dailyDeviatedReasons?.id}
                deviatedReasons={dailyDeviatedReasons?.deviationReasons}
                onUpdateDeviationReason={onUpdateDeviationReason}
                onUpdateDeviationReasonId={onUpdateDeviationReasonId}
              />
            )}
            {enabledDeviationReasonText && (
              <TextField
                minRows={3}
                value={
                  dailyObjectivelyEventLog?.deviatedLeavingTimeReason?.text
                }
                onChange={(event) => {
                  onUpdateDeviationReason(
                    'leaving',
                    'text',
                    event.target.value
                  );
                }}
                disabled={loading || lockedSummary || readOnly}
              />
            )}
          </FieldItem>
        ) : (
          ''
        )}
      </Section>

      {restTimes.map((record, idx, records) => (
        <Section key={`rest-time-${record.id}`}>
          <FieldItem
            label={`${msg().$Att_Lbl_CustomRest} ${idx + 1}`}
            enabledRestReason={enabledRestReason}
          >
            <RestTime
              record={record}
              restTimeReasons={restTimeReasons}
              enabledRestReason={enabledRestReason}
              enableAdd={helper.restTime.isLastAndAddable(
                idx,
                records as unknown as RestTimes,
                maxRestTimesCount
              )}
              enableDelete={helper.restTime.isDeletable(
                idx,
                records as unknown as RestTimes
              )}
              readOnly={
                loading || lockedSummary || lockedDailyRecord || readOnly
              }
              onUpdateStart={(value: number | null) =>
                onUpdateRestTime(idx, { ...record, startTime: value })
              }
              onUpdateEnd={(value: number | null) =>
                onUpdateRestTime(idx, { ...record, endTime: value })
              }
              onUpdateReason={(value: RestTimeReason | null) =>
                onUpdateRestTime(idx, { ...record, restReason: value })
              }
              onClickAdd={onAddRestTime}
              onClickDelete={() => onDeleteRestTime(idx)}
            />
          </FieldItem>
        </Section>
      ))}

      {dailyAttTime && dailyAttTime.hasRestTime ? (
        <Section key="other-rest">
          <FieldItem
            label={`${msg().Att_Lbl_OtherRestTime}`}
            enabledRestReason={enabledRestReason}
          >
            <OtherRestTime
              value={dailyAttTime.restHours}
              reason={dailyAttTime.otherRestReason}
              restTimeReasons={restTimeReasons}
              enabledRestReason={enabledRestReason}
              onChangeTime={(value) => onUpdateClockTime('restHours', value)}
              onChangeReason={(value) =>
                onUpdateClockTime('otherRestReason', value)
              }
              readOnly={
                loading || lockedSummary || lockedDailyRecord || readOnly
              }
            />
          </FieldItem>
        </Section>
      ) : null}

      <Section key="remark">
        <FieldItem
          label={msg().Att_Lbl_Remarks}
          enabledRestReason={enabledRestReason}
        >
          <TextField
            minRows={3}
            value={dailyAttTime.remarks}
            onChange={(event) => {
              onUpdateRemarks(event.target.value);
            }}
            disabled={loading || lockedSummary || lockedDailyRecord || readOnly}
          />
        </FieldItem>
      </Section>
    </>
  );
};

export default Content;
