import * as React from 'react';

import styled, { css } from 'styled-components';

import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  ATTENTION_TYPE,
  getAttentionType,
  Log,
  ObjectivelyEventLogRecord as EventLogRecord,
} from '@attendance/domain/models/DailyObjectivelyEventLog';

const Row = styled.div<{ error: boolean }>`
  display: flex;
  > * {
    ${({ error }) =>
      error &&
      css`
        color: red !important;
      `}
  }
`;

const LogTime = styled.div`
  padding-right: 14px;
  padding-left: 10px;
  width: 88px;
  color: #53688c;
`;

const Label = styled.div`
  width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Record: React.FC<{
  name: string;
  inputTime: number | null;
  allowingDeviationTime: number | null;
  record: EventLogRecord;
  reason: string | null;
  requireDeviationReason: boolean;
}> = ({
  name,
  inputTime,
  allowingDeviationTime,
  record,
  reason,
  requireDeviationReason,
}) => (
  <Row
    error={
      getAttentionType({
        inputTime,
        record,
        allowingDeviationTime,
        requireDeviationReason,
        reason,
      }) === ATTENTION_TYPE.ERROR
    }
  >
    <LogTime>
      {record.time === null
        ? msg().Att_Lbl_NoData
        : TimeUtil.toHHmm(record.time)}
    </LogTime>
    <Label title={name}>{name}</Label>
  </Row>
);

const ObjectivelyEventLog: React.FC<{
  type: 'entering' | 'leaving';
  records: Log[];
  inputTime: number | null;
  reason: string | null;
}> = ({ type, records, inputTime, reason }) => (
  <>
    {records ? (
      records
        .filter((log) => log)
        .map((log) => (
          <Record
            key={log.setting.id}
            name={log.setting.name}
            inputTime={inputTime}
            record={log[type]}
            allowingDeviationTime={log.allowingDeviationTime}
            requireDeviationReason={log.requireDeviationReason}
            reason={reason}
          />
        ))
    ) : (
      <Record
        key="empty"
        name={null}
        inputTime={null}
        record={{
          id: null,
          eventType: null,
          time: null,
          linked: null,
          eventLogUpdatedBy: null,
          deviatedTime: null,
        }}
        allowingDeviationTime={null}
        requireDeviationReason={null}
        reason={null}
      />
    )}
  </>
);

export default ObjectivelyEventLog;
