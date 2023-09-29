import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, withKnobs } from '@storybook/addon-knobs';

import ApprovalStatus from '../../../components/molecules/commons/ApprovalStatus';

export default {
  title: 'Components/molecules/commons/ApprovalStatus',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Display approval status
  `)(() => (
  <ApprovalStatus
    status={'Pending'}
    iconOnly={boolean('iconOnly', false)}
    size={'large'}
    isForReapply={boolean('isForReapply', false)}
  />
));
