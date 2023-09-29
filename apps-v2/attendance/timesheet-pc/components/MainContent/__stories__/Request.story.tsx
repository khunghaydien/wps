import React from 'react';

import { action } from '@storybook/addon-actions';

import {
  detectPerformableActionForFix,
  STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';

import storeMock from '../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import Request from '../Request';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

export default {
  title: 'attendance/timesheet-pc/MainContent/Request',
  decorators: [withProvider(store)],
};

export const _NotRequested = () => (
  <Request
    attSummary={{
      id: '',
      requestId: '',
      status: STATUS.NOT_REQUESTED,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(
        STATUS.NOT_REQUESTED
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
      status: STATUS.PENDING,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.PENDING),
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
      status: STATUS.RECALLED,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.RECALLED),
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
      status: STATUS.REJECTED,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.REJECTED),
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
      status: STATUS.APPROVED,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.APPROVED),
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
      status: STATUS.CANCELED,
      approver01Name: '',
      isLocked: false,
      isAllLeaveOfAbsence: false,
      performableActionForFix: detectPerformableActionForFix(STATUS.CANCELED),
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
