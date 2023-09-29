import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { array, boolean, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/pages/attendance/DailyRequestListPage';

import store from './store.mock';

export default {
  title: 'Components/pages/attendance',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const DailyRequestListPage = () => (
  // @ts-ignore
  <Component
    availableRequests={array('availableRequests', [
      // @ts-ignore
      {
        requestTypeCode: 'Code1',
        requestTypeName: '申請1',
        status: 'Pending',
        isForReapply: true,
      },
    ])}
    latestRequests={array('latestRequests', [
      // @ts-ignore
      {
        requestTypeCode: 'Code1',
        requestTypeName: '申請1',
        status: 'Pending',
        isForReapply: true,
      },
      // @ts-ignore
      {
        requestTypeCode: 'Code2',
        requestTypeName: '申請2',
        status: 'Rejected',
        isForReapply: true,
      },
      // @ts-ignore
      {
        requestTypeCode: 'Code3',
        requestTypeName: '申請3',
        status: 'Approved',
        isForReapply: true,
      },
      // @ts-ignore
      {
        requestTypeCode: 'Code4',
        requestTypeName: '申請4',
        status: 'Approval In',
        isForReapply: false,
      },
      // @ts-ignore
      {
        requestTypeCode: 'Code5',
        requestTypeName: '申請5',
        status: 'Rejected',
        isForReapply: false,
      },
    ])}
    onClickRequest={action('onClickRequest')}
    isLocked={boolean('isLocked', false)}
  />
);

// FIXME: Typo...
DailyRequestListPage.storyName = 'DailyReuqestListPage';
DailyRequestListPage.parameters = {
  info: {
    inline: false,
    text: `
      日次申請一覧
    `,
  },
};
