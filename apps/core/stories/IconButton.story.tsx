/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import Close from '../assets/icons/close.svg';
import { IconButton } from '../index';

export default {
  title: 'core/IconButton',
};

export const Default = () => <IconButton icon={Close} />;

Default.storyName = 'default';

export const Disabled = () => <IconButton icon={Close} color="red" disabled />;

Disabled.storyName = 'disabled';

export const Colors = () => (
  <>
    <IconButton icon={Close} color="red" />
    <IconButton icon={Close} color="blue" />
    <IconButton icon={Close} color="green" />
  </>
);

Colors.storyName = 'colors';
