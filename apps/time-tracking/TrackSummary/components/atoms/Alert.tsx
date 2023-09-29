import * as React from 'react';

import styled from 'styled-components';

import { Icons, Text } from '@apps/core';

const Wrapper = styled.div`
  display: inline-block;
  height: 28px;
  width: 116px;
  border-radius: 32px;
  background: rgba(255, 138, 0, 0.16);
  padding: 6px 17px;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;
`;
const StyledText = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Alert: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Wrapper tabIndex={0}>
      <Container>
        <Icon>
          <Icons.Attention color="removed" />
        </Icon>
        <StyledText bold color="removed">
          {children}
        </StyledText>
      </Container>
    </Wrapper>
  );
};

export default Alert;
