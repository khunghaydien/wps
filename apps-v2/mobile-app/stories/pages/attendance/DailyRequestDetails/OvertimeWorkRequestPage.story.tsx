import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/OvertimeWorkRequestPage';

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

export const OvertimeWorkRequestPage = () => (
  <Component
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.OvertimeWork,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.OvertimeWork,
      requestTypeName: text('requestTypeName', 'OvertimeWork'),
      startDate: text('startDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', ''),
    }}
    validation={{}}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);

OvertimeWorkRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      残業申請詳細画面
    `,
  },
};
