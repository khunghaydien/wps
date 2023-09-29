import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import { STATUS, Status } from '@attendance/domain/models/AttFixSummaryRequest';

import Chip from '@mobile/components/atoms/Chip';

import colors from '@mobile/styles/variables/_colors.scss';

const StatusChip = styled(
  ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    color,
    ...props
  }: { color: string } & React.ComponentProps<typeof Chip>) => (
    <Chip {...props} />
  )
)`
  &&& {
    display: inline;
    border-color: ${(props) => props.color} !important;
    background-color: ${(props) => props.color} !important;
    color: #fff !important;
  }
`;

const AttendanceRequestStatus: React.FC<{ status: Status }> = ({ status }) => {
  switch (status) {
    case STATUS.PENDING:
      return (
        <StatusChip
          text={msg().Att_Lbl_ReqStatPending}
          color={colors.blue800}
        />
      );
    case STATUS.APPROVED:
      return (
        <StatusChip
          text={msg().Att_Lbl_ReqStatApproved}
          color={colors.green800}
        />
      );
    case STATUS.REJECTED:
      return (
        <StatusChip
          text={msg().Att_Lbl_ReqStatRejected}
          color={colors.red800}
        />
      );
    case STATUS.RECALLED:
      return (
        <StatusChip
          text={msg().Att_Lbl_ReqStatRecalled}
          color={colors.red800}
        />
      );
    case STATUS.CANCELED:
      return (
        <StatusChip
          text={msg().Att_Lbl_ReqStatCanceled}
          color={colors.red800}
        />
      );
    default:
      return null;
  }
};

export default AttendanceRequestStatus;
