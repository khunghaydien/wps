import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { Button, PopupFrame, Text } from '../index';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const S = {
  Button: styled(Button)`
    width: 80px;
  `,
};

export default {
  title: 'core/PopupFrame',
  decorators: [(story: Function) => <Center>{story()}</Center>],
};

export const Default = () => (
  <PopupFrame onClose={action('onClose')}>
    <div />
  </PopupFrame>
);

Default.storyName = 'default';

export const InjectContent = () => (
  <PopupFrame
    onClose={action('onClose')}
    header={
      <header style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Text size="xxxl" style={{ marginLeft: '10px' }}>
          Hello, World!
        </Text>
      </header>
    }
    footer={
      <footer
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <S.Button style={{ marginRight: '10px' }}>Close</S.Button>
      </footer>
    }
  >
    <div style={{ height: '200px', width: '400px', padding: '10px' }}>
      Content Content Content
    </div>
  </PopupFrame>
);

InjectContent.storyName = 'inject content';
