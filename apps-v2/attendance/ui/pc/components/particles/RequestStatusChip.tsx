import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import STATUS, { Status } from '@apps/domain/models/approval/request/Status';

import { Color } from '@attendance/ui/pc/styles';

const Chip = styled(
  ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  )
)`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
`;

const StyledChip = styled(
  ({
    color: _,
    ...props
  }: { color: string } & React.ComponentProps<typeof Chip>) => (
    <Chip {...props} />
  )
)`
  background-color: ${(props) => props.color} !important;
  color: #fff !important;
`;

const useProps = (status: Status) =>
  React.useMemo<{ text: string; color: string } | void>(() => {
    switch (status) {
      case STATUS.Pending:
        return {
          text: msg().Att_Lbl_ReqStatPending,
          color: Color.pending,
        };
      case STATUS.Approved:
        return {
          text: msg().Att_Lbl_ReqStatApproved,
          color: Color.approved,
        };
      case STATUS.Rejected:
        return {
          text: msg().Att_Lbl_ReqStatRejected,
          color: Color.rejected,
        };
      case STATUS.Recalled:
        return {
          text: msg().Att_Lbl_ReqStatRecalled,
          color: Color.recalled,
        };
      case STATUS.Canceled:
        return {
          text: msg().Att_Lbl_ReqStatCanceled,
          color: Color.canceled,
        };
      default: {
        return {
          text: msg().Att_Lbl_ReqStatNotRequested,
          color: Color.notRequested,
        };
      }
    }
  }, [status]);

const RequestStatusChip: React.FC<{ status: Status }> = ({ status }) => {
  const props = useProps(status);
  if (!props) {
    return null;
  }
  return <StyledChip {...props} />;
};

export default RequestStatusChip;
