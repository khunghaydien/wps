import React from 'react';

import { action } from '@storybook/addon-actions';

import STATUS from '@apps/domain/models/approval/request/Status';
import { detectPerformableActionForFix } from '@apps/domain/models/attendance/AttFixSummaryRequest';

import storeMock from '../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import Request from '../Request';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

export default {
  title: 'timesheet-pc/MainContent/Request',
  decorators: [withProvider(store)],
};

export const _NotRequested = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.NotRequested,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(
        STATUS.NotRequested
      ),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_NotRequested.storyName = 'NotRequested';
_NotRequested.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const _Pending = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.Pending,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.Pending),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_Pending.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const _Recalled = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.Recalled,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.Recalled),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_Recalled.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const _Rejected = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.Rejected,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.Rejected),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_Rejected.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const _Approved = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.Approved,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.Approved),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_Approved.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const _Canceled = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.Canceled,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.Canceled),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

_Canceled.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};

export const NullLeaveOfAbsence = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: null,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(null),
    }}
    onClickOpenRequestHistoryButton={action('Open Request History')}
    onClickRequestButton={action('Clicked')}
  />
);

NullLeaveOfAbsence.storyName = 'null(Leave of absence)';
NullLeaveOfAbsence.parameters = {
  info: { propTables: [Request], inline: true, source: true },
};
