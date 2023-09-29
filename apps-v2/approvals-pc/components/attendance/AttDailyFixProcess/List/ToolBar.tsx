import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

import { ApprovalTypeValue } from '@apps/domain/models/approval/ApprovalType';

import ApprovalTypeSwitch from '@apps/approvals-pc/components/listParts/ApprovalTypeSwitch';

const Container = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  background-color: #fff;
`;

const Left = styled.div``;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
`;

const CounterContainer = styled.div`
  padding-left: 14px;
  text-align: right;
  width: 160px;
`;

const ApprovalAllButtonContainer = styled.div`
  padding-left: 14px;
`;

const ToolBar: React.FC<{
  totalCount: number;
  filteredCount: number;
  checkedCount: number;
  overLimit: boolean;
  enabledByDelegate: boolean;
  enabledBulkApprove: boolean;
  approvalType: ApprovalTypeValue;
  onClickApproveAllButton: () => void;
  onSwitchApprovalType: (arg0: ApprovalTypeValue) => void;
  ApprovalAllDialog: React.FC;
}> = ({
  totalCount,
  filteredCount,
  checkedCount,
  overLimit,
  enabledByDelegate,
  enabledBulkApprove,
  approvalType,
  onClickApproveAllButton,
  onSwitchApprovalType,
  ApprovalAllDialog,
}) => (
  <Container>
    <Left>
      {enabledByDelegate ? (
        <ApprovalTypeSwitch
          approvalType={approvalType}
          onSwitch={onSwitchApprovalType}
        />
      ) : null}
    </Left>
    <Right>
      <CounterContainer>
        {filteredCount !== totalCount ? `${filteredCount} / ` : ''}
        {`${totalCount}${overLimit ? '+' : ''} ${msg().Appr_Lbl_RecordCount}`}
      </CounterContainer>
      {enabledBulkApprove ? (
        <ApprovalAllButtonContainer>
          <Button
            color="primary"
            onClick={onClickApproveAllButton}
            disabled={!checkedCount}
          >
            {`${msg().Appr_Btn_ApprovalAll}${
              checkedCount ? `(${checkedCount})` : ''
            }`}
          </Button>
        </ApprovalAllButtonContainer>
      ) : (
        ''
      )}
    </Right>
    <ApprovalAllDialog />
  </Container>
);

export default ToolBar;
