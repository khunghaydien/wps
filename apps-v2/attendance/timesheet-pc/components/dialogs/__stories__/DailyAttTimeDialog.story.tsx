import React from 'react';

import { action } from '@storybook/addon-actions';

import { defaultValue as dummyObjectivelyEventLog } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';
import {
  detectPerformableActionForFix,
  STATUS,
} from '@attendance/domain/models/FixDailyRequest';

import Component from '../DailyAttTimeDialog';
import Content from '../DailyAttTimeDialog/Content';
import Header from '../DailyAttTimeDialog/Header';
import dummyDailyAttTime from './mock-data/dailyAttTime';
import dailyDeviatedReasons from './mock-data/dailyDeviatedReasons';
import restReasonList from './mock-data/restTimeReasons';
import { time } from '@attendance/__tests__/helpers';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttTimeDialog',
};

export const Default = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    recordId: 'recordId',
    restTimes: [dummyDailyAttTime.restTimes[0]],
    remarks: 'remarks',
    hasRestTime: false,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={false}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={false}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={[]}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={false}
    />
  );
};

export const WithAttendanceDailyRequest = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    recordId: 'recordId',
    restTimes: [dummyDailyAttTime.restTimes[0]],
    remarks: 'remarks',
    hasRestTime: false,
  };
  return (
    <Component
      Header={() => (
        <Header
          loading={false}
          readOnly={false}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'ApproverEmployeeName',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          allowedAction={true}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistory'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSetting'
          )}
          onSubmitRequest={action('onSubmit')}
          enabledDisplayingNextApprover={true}
        />
      )}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={false}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={false}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={[]}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={true}
      enabledRestReason={false}
    />
  );
};

export const RestTimeBeforeMax = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    restTimes: [
      dummyDailyAttTime.restTimes[0],
      dummyDailyAttTime.restTimes[1],
      dummyDailyAttTime.restTimes[2],
      dummyDailyAttTime.restTimes[3],
    ],
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={false}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={false}
          dailyAttTime={record}
          onUpdateRemarks={action('onUpdateRemarks')}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={[]}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={false}
    />
  );
};

export const WithOtherRestTime = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    restTimes: [dummyDailyAttTime.restTimes[0]],
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={false}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={false}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          onUpdateRemarks={action('onUpdateRemarks')}
          restTimeReasons={[]}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={false}
    />
  );
};

export const WithObjectivelyEventLog = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: dummyObjectivelyEventLog,
    restTimes: [
      dummyDailyAttTime.restTimes[0],
      dummyDailyAttTime.restTimes[1],
      dummyDailyAttTime.restTimes[2],
      dummyDailyAttTime.restTimes[3],
    ],
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={false}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          onUpdateRemarks={action('onUpdateRemarks')}
          restTimeReasons={[]}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={false}
    />
  );
};

export const WithRestReason = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    recordId: 'recordId',
    restTimes: [dummyDailyAttTime.restTimes[0]],
    remarks: 'remarks',
    hasRestTime: false,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={true}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={false}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={true}
    />
  );
};

export const WithError = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: {
      ...dummyObjectivelyEventLog,
      deviatedEnteringTimeReason: { label: null, value: null, text: '' },
      deviatedLeavingTimeReason: { label: null, value: null, text: '' },
    },
    restTimes: [
      dummyDailyAttTime.restTimes[0],
      dummyDailyAttTime.restTimes[1],
      dummyDailyAttTime.restTimes[2],
      dummyDailyAttTime.restTimes[3],
    ],
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={true}
          enabledDeviationReason={false}
          enabledDeviationReasonText={false}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          onUpdateRemarks={action('onUpdateRemarks')}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={null}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={true}
    />
  );
};

export const ReadOnly = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: dummyObjectivelyEventLog,
    restTimes: [
      dummyDailyAttTime.restTimes[0],
      dummyDailyAttTime.restTimes[1],
      dummyDailyAttTime.restTimes[2],
      dummyDailyAttTime.restTimes[3],
    ],
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={true}
          lockedDailyRecord={false}
          enabledRestReason={true}
          enabledDeviationReason={true}
          enabledDeviationReasonText={true}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={dailyDeviatedReasons}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={true}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={true}
    />
  );
};

export const Loading = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: dummyObjectivelyEventLog,
    restTimes: [
      dummyDailyAttTime.restTimes[0],
      dummyDailyAttTime.restTimes[1],
      dummyDailyAttTime.restTimes[2],
      dummyDailyAttTime.restTimes[3],
    ],
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => null}
      Content={() => (
        <Content
          loading={true}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={true}
          enabledDeviationReason={true}
          enabledDeviationReasonText={true}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          onUpdateRemarks={action('onUpdateRemarks')}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={dailyDeviatedReasons}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={true}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={false}
      enabledRestReason={true}
    />
  );
};

export const ShowAllItem = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: dummyObjectivelyEventLog,
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => (
        <Header
          loading={false}
          readOnly={false}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'ApproverEmployeeName',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          allowedAction={true}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistory'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSetting'
          )}
          onSubmitRequest={action('onSubmit')}
          enabledDisplayingNextApprover={true}
        />
      )}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={false}
          enabledRestReason={true}
          enabledDeviationReason={true}
          enabledDeviationReasonText={true}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={dailyDeviatedReasons}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={true}
      enabledRestReason={true}
    />
  );
};

export const LockedDailyRecord = (): React.ReactElement => {
  const record = {
    ...dummyDailyAttTime,
    startTime: time(7, 30),
    endTime: time(16, 30),
    dailyObjectivelyEventLog: dummyObjectivelyEventLog,
    hasRestTime: true,
    restHours: 10,
  };
  return (
    <Component
      Header={() => (
        <Header
          loading={false}
          readOnly={false}
          fixDailyRequest={{
            id: undefined,
            status: STATUS.NOT_REQUESTED,
            approver01Name: 'ApproverEmployeeName',
            performableActionForFix: detectPerformableActionForFix(
              STATUS.NOT_REQUESTED
            ),
          }}
          allowedAction={true}
          enabledApprovalHistory={true}
          onClickOpenApprovalHistoryDialog={action(
            'onClickOpenApprovalHistory'
          )}
          onClickOpenApproverEmployeeSettingDialog={action(
            'onClickOpenApproverEmployeeSetting'
          )}
          onSubmitRequest={action('onSubmit')}
          enabledDisplayingNextApprover={true}
        />
      )}
      Content={() => (
        <Content
          loading={false}
          readOnly={false}
          lockedSummary={false}
          lockedDailyRecord={true}
          enabledRestReason={true}
          enabledDeviationReason={true}
          enabledDeviationReasonText={true}
          enabledObjectivelyEventLog={true}
          dailyAttTime={record}
          maxRestTimesCount={5}
          onUpdateClockTime={action('UpdateClockTime')}
          onUpdateDeviationReason={action('UpdateDeviationReason')}
          onAddRestTime={action('onAddRestTime')}
          onDeleteRestTime={action('onDeleteRestTime')}
          onUpdateRestTime={action('onUpdateRestTime')}
          onUpdateRemarks={action('onUpdateRemarks')}
          onOpenDailyObjectivelyEventLogDialog={action(
            'onOpenDailyObjectivelyEventLogDialog'
          )}
          restTimeReasons={restReasonList}
          dailyDeviatedReasons={dailyDeviatedReasons}
          onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
        />
      )}
      isLoading={false}
      isReadOnly={false}
      targetDate={record.recordDate}
      onSave={action('Submit')}
      onCancel={action('Cancel')}
      enabledFixDailyRequest={true}
      enabledRestReason={true}
    />
  );
};
