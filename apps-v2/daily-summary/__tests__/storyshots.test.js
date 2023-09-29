// @flow

import React from 'react';

import path from 'path';

import ReactDOM from 'react-dom';

import initStoryshots from '@storybook/addon-storyshots';

import parse from 'date-fns/parse';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../../__tests__/snapShotUtils';

// https://testing-library.com/docs/example-react-transition-group/
jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children }) => children);
  const FakeCSSTransition = jest.fn((props) =>
    props.in ? <FakeTransition>{props.children}</FakeTransition> : null
  );
  return { CSSTransition: FakeCSSTransition, Transition: FakeTransition };
});

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

ReactDOM.createPortal = jest.fn((element, _node) => {
  return element;
});

jest.mock('@apps/repositories/PersonalSettingRepository', () => ({
  fetch: jest.fn().mockResolvedValue({}),
}));

const mockRequestAlertStartDate = parse('2019-11-01');
const mockRequestAlertEndDate = parse('2019-11-30');
jest.mock('@apps/repositories/time-tracking/RequestRepository', () => ({
  fetchAlert: jest.fn().mockResolvedValue({
    id: 'dummy',
    alert: false,
    startDate: mockRequestAlertStartDate,
    endDate: mockRequestAlertEndDate,
  }),
}));

jest.mock('@apps/repositories/time-tracking/SummaryRepository', () => ({
  fetchSummary: jest.fn().mockResolvedValue({
    id: null,
    startDate: '2019-12-01',
    endDate: '2019-12-31',
    workTime: 0,
    taskSummaryRecords: [],
    isLocked: false,
    useRequest: true,
    request: { status: 'NotRequested', requestId: null },
  }),
}));

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
