import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

const HeaderWrapper = styled.div`
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

const Header: React.FC = () => {
  return (
    <HeaderWrapper>
      <HeaderTitle>{msg().Admin_Lbl_AttPatternSelect}</HeaderTitle>
    </HeaderWrapper>
  );
};

export default Header;
