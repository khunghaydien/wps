import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { defaultValue as dummyObjectivelyEventLog } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';

import dummyDailyAttTime from '../../__stories__/mock-data/dailyAttTime';
import dailyDeviatedReasons from '../../__stories__/mock-data/dailyDeviatedReasons';
import restReasonList from '../../__stories__/mock-data/restTimeReasons';
import {
  DEFAULT_WIDTH as $DEFAULT_WIDTH,
  WITH_REQUEST_WIDTH as $WITH_REQUEST_WIDTH,
  WITH_REST_REASON_WIDTH as $WITH_REST_REASON_WIDTH,
} from '../../DailyAttTimeDialog';
import Component from '../Content';
import { time } from '@attendance/__tests__/helpers';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttTimeDialog/Content',
};

// マージンなどを含めて40px
const DEFAULT_WIDTH = $DEFAULT_WIDTH - 40;
const WITH_REQUEST_WIDTH = $WITH_REQUEST_WIDTH - 40;
const WITH_REST_REASON_WIDTH = $WITH_REST_REASON_WIDTH - 40;

const Wrapper = styled.div<{ width?: number }>`
  width: ${({ width }) => width || WITH_REST_REASON_WIDTH}px;
`;

export const Default = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={false}
        maxRestTimesCount={5}
        onUpdateClockTime={action('UpdateClockTime')}
        onUpdateDeviationReason={action('UpdateDeviationReason')}
        onAddRestTime={action('onAddRestTime')}
        onDeleteRestTime={action('onDeleteRestTime')}
        onUpdateRestTime={action('onUpdateRestTime')}
        onUpdateRemarks={action('onUpdateRemarks')}
        dailyAttTime={{
          ...dummyDailyAttTime,
          restTimes: [dummyDailyAttTime.restTimes[0]],
        }}
        onOpenDailyObjectivelyEventLogDialog={action(
          'onOpenDailyObjectivelyEventLogDialog'
        )}
        restTimeReasons={[]}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const RestTimeBeforeMax = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={false}
        maxRestTimesCount={5}
        onUpdateClockTime={action('UpdateClockTime')}
        onUpdateDeviationReason={action('UpdateDeviationReason')}
        onAddRestTime={action('onAddRestTime')}
        onDeleteRestTime={action('onDeleteRestTime')}
        onUpdateRestTime={action('onUpdateRestTime')}
        onUpdateRemarks={action('onUpdateRemarks')}
        dailyAttTime={{
          ...dummyDailyAttTime,
          restTimes: [
            dummyDailyAttTime.restTimes[0],
            dummyDailyAttTime.restTimes[1],
            dummyDailyAttTime.restTimes[2],
            dummyDailyAttTime.restTimes[3],
          ],
        }}
        onOpenDailyObjectivelyEventLogDialog={action(
          'onOpenDailyObjectivelyEventLogDialog'
        )}
        restTimeReasons={[]}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const WithOtherRestTime = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={false}
        maxRestTimesCount={5}
        onUpdateClockTime={action('UpdateClockTime')}
        onUpdateDeviationReason={action('UpdateDeviationReason')}
        onAddRestTime={action('onAddRestTime')}
        onDeleteRestTime={action('onDeleteRestTime')}
        onUpdateRestTime={action('onUpdateRestTime')}
        onUpdateRemarks={action('onUpdateRemarks')}
        dailyAttTime={{
          ...dummyDailyAttTime,
          restTimes: [dummyDailyAttTime.restTimes[0]],
          hasRestTime: true,
          restHours: 10,
        }}
        onOpenDailyObjectivelyEventLogDialog={action(
          'onOpenDailyObjectivelyEventLogDialog'
        )}
        restTimeReasons={[]}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const WithObjectivelyEventLog = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
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
        }}
        restTimeReasons={[]}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const WithRestReason = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={false}
        maxRestTimesCount={5}
        onUpdateClockTime={action('UpdateClockTime')}
        onUpdateDeviationReason={action('UpdateDeviationReason')}
        onAddRestTime={action('onAddRestTime')}
        onDeleteRestTime={action('onDeleteRestTime')}
        onUpdateRestTime={action('onUpdateRestTime')}
        onUpdateRemarks={action('onUpdateRemarks')}
        dailyAttTime={{
          ...dummyDailyAttTime,
          restTimes: [dummyDailyAttTime.restTimes[0]],
        }}
        onOpenDailyObjectivelyEventLogDialog={action(
          'onOpenDailyObjectivelyEventLogDialog'
        )}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const WithError = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: {
            ...dummyObjectivelyEventLog,
            deviatedEnteringTimeReason: {
              label: null,
              value: null,
              text: '',
            },
            deviatedLeavingTimeReason: {
              label: null,
              value: null,
              text: '',
            },
          },
          restTimes: [
            dummyDailyAttTime.restTimes[0],
            dummyDailyAttTime.restTimes[1],
            dummyDailyAttTime.restTimes[2],
            dummyDailyAttTime.restTimes[3],
          ],
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={[]}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const ShowAllItem = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: dummyObjectivelyEventLog,
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const ReadOnly = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={true}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
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
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const Loading = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={true}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
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
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const LockedSummary = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={true}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
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
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

export const LockedDailyRecord = (): React.ReactElement => {
  return (
    <Wrapper>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={true}
        enabledRestReason={true}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: dummyObjectivelyEventLog,
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};

// 幅の確認用
export const ZWidthDefault = (): React.ReactElement => {
  return (
    <Wrapper width={DEFAULT_WIDTH}>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: dummyObjectivelyEventLog,
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};
ZWidthDefault.storyName = 'Width - Default';

// 幅の確認用
export const ZWidthRequest = (): React.ReactElement => {
  return (
    <Wrapper width={WITH_REQUEST_WIDTH}>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={false}
        enabledDeviationReason={true}
        enabledDeviationReasonText={true}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: dummyObjectivelyEventLog,
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={dailyDeviatedReasons}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};
ZWidthRequest.storyName = 'Width - Request';

// 幅の確認用
export const ZWidthRestReason = (): React.ReactElement => {
  return (
    <Wrapper width={WITH_REST_REASON_WIDTH}>
      <Component
        loading={false}
        readOnly={false}
        lockedSummary={false}
        lockedDailyRecord={false}
        enabledRestReason={true}
        enabledDeviationReason={false}
        enabledDeviationReasonText={false}
        enabledObjectivelyEventLog={true}
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
        dailyAttTime={{
          ...dummyDailyAttTime,
          startTime: time(7, 30),
          endTime: time(16, 30),
          dailyObjectivelyEventLog: dummyObjectivelyEventLog,
          hasRestTime: true,
          restHours: 10,
        }}
        restTimeReasons={restReasonList}
        dailyDeviatedReasons={null}
        onUpdateDeviationReasonId={action('onUpdateDeviationReasonId')}
      />
    </Wrapper>
  );
};
ZWidthRestReason.storyName = 'Width - Rest Reason';
