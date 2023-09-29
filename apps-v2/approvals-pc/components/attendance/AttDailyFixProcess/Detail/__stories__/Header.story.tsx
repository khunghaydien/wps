import React from 'react';

import { action } from '@storybook/addon-actions';

import { defaultValue as request } from '@attendance/domain/models/approval/__tests__/mocks/FixDailyRequest.mock';

import Component from '../Header';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/Detail/Header',
};

export const Default = (): React.ReactElement => (
  <Component record={request} onClickClose={action('onClickClose')} />
);
