import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import LinkButton from '@apps/core/blocks/buttons/LinkButton';

import { FixDailyRequest } from '@attendance/domain/models/FixDailyRequest';

import $RequestStatusChip from '@attendance/ui/pc/components/particles/RequestStatusChip';

import ActionForAttendanceDailyRequestButton from '../../particles/ActionForAttendanceDailyRequestButton';
import preventDoubleFiring from '@attendance/ui/helpers/events/preventDoubleFiring';

const RequestStatusChip = styled($RequestStatusChip)`
  white-space: nowrap;
`;

const ApproverEmployeeLinkButton = styled(LinkButton)`
  margin-left: 16px;
`;

const ApproverEmployee = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 300px;
`;

const ApprovalHistoryLinkButton = styled(LinkButton)`
  margin-right: 16px;
  overflow: hidden;
  white-space: nowrap;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 15px 20px;
  background-color: #f4f6f9;
  border-bottom: 1px solid #d8dde6;
  white-space: nowrap;
`;

const Left = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: left;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: right;
  align-items: center;
`;

const Header: React.FC<{
  loading: boolean;
  readOnly: boolean;
  fixDailyRequest: FixDailyRequest;
  allowedAction: boolean;
  enabledApprovalHistory: boolean;
  onSubmitRequest: () => void;
  onClickOpenApprovalHistoryDialog: () => void;
  onClickOpenApproverEmployeeSettingDialog: () => void;
  enabledDisplayingNextApprover: boolean;
}> = ({
  loading,
  readOnly,
  fixDailyRequest,
  allowedAction,
  enabledApprovalHistory,
  onSubmitRequest: $onSubmitRequest,
  onClickOpenApprovalHistoryDialog,
  onClickOpenApproverEmployeeSettingDialog,
  enabledDisplayingNextApprover,
}) => {
  const onSubmitRequest = React.useMemo(
    () => preventDoubleFiring($onSubmitRequest),
    [$onSubmitRequest]
  );

  return (
    <Container>
      <Left>
        <div>
          <RequestStatusChip status={fixDailyRequest.status} />
        </div>
        {enabledDisplayingNextApprover ? (
          <div>
            <ApproverEmployeeLinkButton
              onClick={onClickOpenApproverEmployeeSettingDialog}
            >
              <ApproverEmployee>
                {msg().Att_Lbl_NextApproverEmployee}:{' '}
                {fixDailyRequest.approver01Name || msg().Com_Lbl_Unspecified}
              </ApproverEmployee>
            </ApproverEmployeeLinkButton>
          </div>
        ) : null}
      </Left>
      <Right>
        <div>
          {enabledApprovalHistory ? (
            <ApprovalHistoryLinkButton
              onClick={onClickOpenApprovalHistoryDialog}
            >
              {msg().Com_Btn_ApprovalHistory}
            </ApprovalHistoryLinkButton>
          ) : null}
        </div>
        <div>
          <ActionForAttendanceDailyRequestButton
            type={fixDailyRequest.performableActionForFix}
            onClick={onSubmitRequest}
            disabled={loading || !allowedAction || readOnly}
          />
        </div>
      </Right>
    </Container>
  );
};

export default Header;
