import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LateArrivalRequestPage';

import store from '../store.mock';

export default {
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

export const LateArrivalRequestPage = () => (
  <Component
    isBeforeWorking={boolean('isBeforeWorking', false)}
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.LateArrival,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.LateArrival,
      requestTypeName: text('requestTypeName', 'LateArrival'),
      startDate: text('startDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', ''),
    }}
    validation={{}}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
  />
);

LateArrivalRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      遅刻申請詳細画面
    `,
  },
};
