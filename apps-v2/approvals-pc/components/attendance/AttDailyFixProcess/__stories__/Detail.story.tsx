import React from 'react';

import { text, withKnobs } from '@storybook/addon-knobs';

import {
  ApprovalForm,
  Content,
  Header,
  HistoryTable,
} from './mocks/components/detail.mock';

import Component from '../Detail';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/Detail',
  decorators: [withKnobs],
};

export const Default = (): React.ReactNode => (
  <Component
    requestId={text('requestId', 'test')}
    Header={Header}
    Content={Content.Default as React.FC}
    HistoryTable={HistoryTable}
    ApprovalForm={ApprovalForm}
  />
);

export const NotAttention = (): React.ReactNode => (
  <Component
    requestId={text('requestId', 'test')}
    Header={Header}
    Content={Content.NotAttention as React.FC}
    HistoryTable={HistoryTable}
    ApprovalForm={ApprovalForm}
  />
);
