import * as React from 'react';

import styled from 'styled-components';

import { Button } from '@apps/core';
import msg from '@commons/languages';

import $Cell from './particles/Cell';

const Container = styled.div`
  display: flex;
  padding-left: 20px;
  background-color: #fff;
  height: 56px;
`;

const DateSelectorArea = styled($Cell)`
  margin-right: 15px;
`;

const Cell = styled($Cell)`
  margin-right: 10px;
`;

const Header: React.FC<{
  disabledRegistering: boolean;
  disabledChecking: boolean;
  DateSelectorContainer: React.ComponentType;
  onClickFetchContractedWorkTimes: () => void;
  onClickCheckTimesheet: () => void;
  onClickRegisterToTimesheet: () => void;
  disabledFetchContractedWorkTimes: boolean;
}> = ({
  disabledRegistering,
  disabledChecking,
  DateSelectorContainer,
  onClickFetchContractedWorkTimes,
  onClickCheckTimesheet,
  onClickRegisterToTimesheet,
  disabledFetchContractedWorkTimes,
}) => (
  <Container>
    <DateSelectorArea>
      <DateSelectorContainer />
    </DateSelectorArea>
    <Cell>
      <Button
        onClick={onClickFetchContractedWorkTimes}
        disabled={disabledFetchContractedWorkTimes}
      >
        {msg().Att_Lbl_LoadContractedWorkTime}
      </Button>
    </Cell>
    <Cell>
      <Button onClick={onClickCheckTimesheet} disabled={disabledChecking}>
        {msg().Att_Btn_ImpErrorCheckButton}
      </Button>
    </Cell>
    <Cell>
      <Button
        color={'primary'}
        onClick={onClickRegisterToTimesheet}
        disabled={disabledRegistering}
      >
        {msg().Att_Btn_ImpRegisterToTimesheet}
      </Button>
    </Cell>
  </Container>
);

export default Header;
