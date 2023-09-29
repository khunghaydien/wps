/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { RatePicker } from '../index';

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export default {
  title: 'core/RatePicker',
  decorators: [(story: Function) => <Center>{story()}</Center>],
};

export const Default = () => (
  <RatePicker onSelect={action('onSelect')} value="10" placeholder="0" />
);

Default.storyName = 'default';

export const OpeningMenu = () => (
  <RatePicker isOpenByDefault value="40" onSelect={action('onSelect')} />
);

OpeningMenu.storyName = 'opening  menu';

export const Placeholder = () => (
  <RatePicker onSelect={action('onSelect')} value={null} placeholder="0" />
);

Placeholder.storyName = 'placeholder';

export const InvalidValue = () => (
  <RatePicker value="20" onSelect={action('onSelect')} />
);

InvalidValue.storyName = 'invalid value';

export const Disabled = () => (
  <RatePicker disabled value="20" onSelect={action('onSelect')} />
);

Disabled.storyName = 'disabled';

export const ReadOnly = () => (
  <RatePicker readOnly value="30" onSelect={action('onSelect')} />
);

ReadOnly.storyName = 'readOnly';
