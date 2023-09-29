import React from 'react';

import { action } from '@storybook/addon-actions';

import Utilities from '../Utilities';

export default {
  title: 'timesheet-pc/MainContent',
};

export const _Utilities = () => (
  <Utilities
    onClickOpenSummaryWindowButton={action('onClickOpenSummaryWindowButton')}
    onClickOpenLeaveWindowButton={action('onClickOpenLeaveWindowButton')}
  />
);

_Utilities.parameters = {
  info: { propTables: [Utilities], inline: true, source: true },
};
