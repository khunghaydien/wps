import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/DirectRequestPage';

import store from '../store.mock';

export default {
  // FIXME: Typo...
  title: 'Components/pages/attendance/DailyRequestDatails',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const DirectRequestPage = () => (
  <Component
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.Direct,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.Direct,
      requestTypeName: text('requestTypeName', 'Direct'),
      startDate: text('startDate', '2018-01-01'),
      endDate: text('endDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      directApplyRestTimes: [
        {
          id: '1',
          startTime: number('restStartTime', 0),
          endTime: number('restEndTime', 0),
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      remarks: text('remarks', ''),
    }}
    validation={{}}
    onChangeStartDate={action('onChangeStartDate')}
    onChangeEndDate={action('onChangeEndDate')}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRestTime={action('onChangeRestTime')}
    onClickAddRestTime={action('onClickAddRestTime')}
    onClickRemoveRestTime={action('onClickRemoveRestTime')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);

DirectRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      直行直帰申請詳細画面
    `,
  },
};
