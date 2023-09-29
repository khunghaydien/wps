import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import AlertIcon from '../../../components/molecules/commons/AlertIcon';

export default {
  title: 'Components/molecules/commons/AlertIcon',
  decorators: [withKnobs],
};

export const Warning = withInfo(`
    # Description

    Display AlertIcon
  `)(() => <AlertIcon variant={'warning'} />);

export const Attention = withInfo(`
    # Description

    Display AlertIcon
  `)(() => <AlertIcon variant={'attention'} />);
