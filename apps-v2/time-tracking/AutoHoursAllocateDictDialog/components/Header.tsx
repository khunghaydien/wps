import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

type Props = {
  onClickSaveButton: () => void;
};

const TableHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: solid 1px #d8dde6;
  background: #f4f6f9;
  border-radius: 4px 4px 0 0;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;
  color: #53688c;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
`;

const Header: React.FC<Props> = ({ onClickSaveButton }) => {
  return (
    <TableHeaderWrapper>
      <HeaderTitle>
        {msg().Time_Lbl_TimeTrackingDictionaryPageTitle}
      </HeaderTitle>
      <Button color="primary" onClick={onClickSaveButton}>
        {msg().Com_Btn_Save}
      </Button>
    </TableHeaderWrapper>
  );
};

export default Header;
