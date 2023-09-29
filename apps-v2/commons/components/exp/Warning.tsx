import React, { memo } from 'react';

import styled from 'styled-components';

import AttentionIcon from '@commons/images/icons/attention.svg';

type Props = {
  className?: string;
  message: string;
};

const Warning = ({ className, message }: Props) => {
  return (
    <Wrapper className={className}>
      <Icon>
        <AttentionIcon />
      </Icon>
      <Content>{message}</Content>
    </Wrapper>
  );
};

export default memo(Warning);

const Wrapper = styled.div`
  margin-top: 8px;
  border: 1px solid #df8e2f;
  border-radius: 4px;
  padding: 8px;
  display: flex;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
`;

const Content = styled.div`
  color: #333;
  margin-left: 10px;
  word-break: break-word;
`;
