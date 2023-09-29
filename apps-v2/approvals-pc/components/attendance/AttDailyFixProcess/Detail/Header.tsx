import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

const Container = styled.div`
  position: sticky;
  display: flex;
  background-color: #b2e8ff;
  justify-content: space-between;
  padding: 5px 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-right: 14px;

    &:nth-child(1) {
      font-size: 15px;
      font-weight: bold;
    }
  }
`;

const Header: React.FC<{
  record: FixDailyRequest;
  onClickClose: () => void;
}> = ({ record, onClickClose }) => (
  <Container>
    <Title>
      <div>{msg().Appr_Lbl_Detail}</div>
      <div>{record.submitter.employee.code}</div>
      <div>{record.submitter.employee.name}</div>
      <div>{record.submitter.employee.department.name}</div>
    </Title>
    <div>
      <Button onClick={onClickClose}>{msg().Com_Btn_Close}</Button>
    </div>
  </Container>
);

export default Header;
