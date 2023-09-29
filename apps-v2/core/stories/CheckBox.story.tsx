import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { CheckBox } from '../index';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
  height: 200px;
`;

export default {
  title: 'core/CheckBox',
  decorators: [(story: Function) => <Center>{story()}</Center>],
};

export const Off = () => {
  return <CheckBox checked={false} onChange={action('onChange')} />;
};

Off.storyName = 'off';

export const On = () => <CheckBox checked onChange={action('onChange')} />;

On.storyName = 'on';

export const Disabled = () => (
  <CheckBox checked={false} disabled onChange={action('onChange')} />
);

Disabled.storyName = 'disabled';

export const ReadOnly = () => (
  <CheckBox checked readOnly onChange={action('onChange')} />
);

ReadOnly.storyName = 'read-only';

export const HasLabel = () => (
  <>
    <CheckBox checked={false} onChange={action('onChange')}>
      Are you person?
    </CheckBox>
    <CheckBox checked onChange={action('onChange')}>
      This
      <br />
      is
      <br />
      multiline description
    </CheckBox>
  </>
);

HasLabel.storyName = 'has label';
