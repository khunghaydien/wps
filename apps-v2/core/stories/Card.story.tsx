import React from 'react';

import styled from 'styled-components';

import LinkButton from '../blocks/buttons/LinkButton';
import Text from '../elements/Text';
import { Card } from '../index';

const S = {
  Header: styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
  `,
};

const style = {
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  paddingBottom: '12px',
};

const Header = ({ onToggle, isOpen }) => {
  return (
    <S.Header>
      <Text size="xl" color="primary" bold>
        Title
      </Text>
      <LinkButton onClick={onToggle}>{isOpen ? 'close' : 'open'}</LinkButton>
    </S.Header>
  );
};

export default {
  title: 'core/Card',
};

export const Close = () => (
  <Card defaultOpen header={Header}>
    <div style={style}>
      Content Content Content Content Content Content Content
    </div>
  </Card>
);

Close.storyName = 'close';

export const Open = () => (
  <Card header={Header}>
    <div style={style}>
      Content Content Content Content Content Content Content
    </div>
  </Card>
);

Open.storyName = 'open';
