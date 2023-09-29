import React from 'react';

import styled from 'styled-components';

import msg from '../../../../commons/languages';
import { Color } from '../../../../core/styles';

import STATUS, {
  Status,
} from '../../../../domain/models/approval/request/Status';

const colors = {
  [STATUS.NotRequested]: Color.notRequested,
  [STATUS.Pending]: Color.pending,
  [STATUS.Recalled]: Color.removed,
  [STATUS.Rejected]: Color.rejected,
  [STATUS.Approved]: Color.approved,
  [STATUS.Canceled]: Color.canceled,
};

const getStatusLabel = (status: Status): string | null | undefined => {
  const messageTable = {
    [STATUS.NotRequested]: msg().Time_Status_NotRequested,
    [STATUS.Pending]: msg().Time_Status_Pending,
    [STATUS.Recalled]: msg().Time_Status_Recalled,
    [STATUS.Rejected]: msg().Time_Status_Rejected,
    [STATUS.Approved]: msg().Time_Status_Approved,
    [STATUS.Canceled]: msg().Time_Status_Canceled,
    [STATUS.ApprovalIn]: undefined,
    [STATUS.Reapplying]: undefined,
    [STATUS.ApprovedPreRequest]: undefined,
  };
  return messageTable[status];
};

const Block = styled.div<{ status: Status }>`
  color: ${(props) => (props.status === STATUS.Canceled ? '#333' : '#fff')};
  background: ${(props) => colors[props.status]};
  font-size: 12px;
  width: 120px;
  height: 20px;
  border-radius: 2px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`;

const StatusLabel = (props: { status: Status }) => (
  <Block status={props.status}>{getStatusLabel(props.status)}</Block>
);

export default StatusLabel;
