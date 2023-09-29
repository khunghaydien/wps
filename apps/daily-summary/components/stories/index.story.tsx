import React from 'react';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../core';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import DailySummary from '../index';
import storeMock from './mocks/store.mock';

const store = configureStore(storeMock);

// const setUpApiMock = () => {
//   const originalInvoke = api.invoke;
//   api.invoke = ({ path }) => {
//     const response = {
//       '/personal-setting/get': {},
//       '/time-track/summary/get': {
//         useRequest: true,
//         summary: {
//           workTime: 0,
//           taskSummaryRecords: [],
//           startDate: '2022-05-01',
//           isLocked: false,
//           id: null,
//           endDate: '2022-05-31',
//         },
//         request: { status: 'NotRequested', requestId: null },
//       },
//     }[path];
//     return Promise.resolve(response);
//   };
//   return () => {
//     api.invoke = originalInvoke;
//   };
// };

export default {
  title: 'daily-summary/overall',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

export const HasNoLeave = () => {
  // useEffect(setUpApiMock, []);
  return (
    <DailySummary
      isDelegated={false}
      isLoading={false}
      hasLeave={false}
      isModal
      onSave={action('onSave')}
      onSaveAndLeave={action('onSaveAndLeave')}
      onClose={action('onClose')}
    />
  );
};

export const HasLeave = () => (
  <DailySummary
    isDelegated={false}
    isLoading={false}
    hasLeave
    isModal
    onSave={action('onSave')}
    onSaveAndLeave={action('onSaveAndLeave')}
    onClose={action('onClose')}
  />
);

export const WhileLoading = () => (
  <DailySummary
    isDelegated={false}
    isLoading
    hasLeave
    isModal
    onSave={action('onSave')}
    onSaveAndLeave={action('onSaveAndLeave')}
    onClose={action('onClose')}
  />
);

export const IsDelegated = () => (
  <DailySummary
    isDelegated
    isLoading={false}
    hasLeave={false}
    isModal
    onSave={action('onSave')}
    onSaveAndLeave={action('onSaveAndLeave')}
    onClose={action('onClose')}
  />
);

IsDelegated.story = {
  name: 'is delegated',
  decorators: [
    withProvider(
      configureStore({
        ...storeMock,
        entities: { user: { isDelegated: true } },
      })
    ),
  ],
};

export const ReadOnly = () => (
  <DailySummary
    readOnly
    isDelegated
    isLoading={false}
    hasLeave={false}
    isModal
    onSave={action('onSave')}
    onSaveAndLeave={action('onSaveAndLeave')}
    onClose={action('onClose')}
  />
);

ReadOnly.story = {
  name: 'read only',
  decorators: [
    withProvider(
      configureStore({
        ...storeMock,
        entities: { user: { isDelegated: true } },
      })
    ),
  ],
};
