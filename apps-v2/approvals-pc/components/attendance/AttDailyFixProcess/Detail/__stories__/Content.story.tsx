import React from 'react';

import { boolean, withKnobs } from '@storybook/addon-knobs';

import { defaultValue as request } from '@apps/approvals-pc/models/attendance/__tests__/mocks/FixDailyRequestViewModel.mock';

import Component from '../Content';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/Detail/Content',
  decorators: [withKnobs],
};

export const Default = (): React.ReactElement => (
  <Component
    request={request}
    closingDate={request.requestDate}
    expanded={boolean('expanded', true)}
  />
);

export const Contacted = (): React.ReactElement => (
  <Component
    request={request}
    closingDate={request.requestDate}
    expanded={false}
  />
);

export const NotAttention = (): React.ReactElement => (
  <Component
    request={{
      ...request,
      attention: {
        ineffectiveWorkingTime: 0,
        insufficientRestTime: 0,
      },
    }}
    closingDate={request.requestDate}
    expanded={false}
  />
);
