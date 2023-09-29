import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import EarlyLeaveRequestPage from '../../../../components/pages/attendance/DailyRequestDetails/EarlyLeaveRequestPage';

import store from '../store.mock';

export default {
  title: 'Components/pages/attendance/DailyRequestDatails',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
  ],
};

export const _EarlyLeaveRequestPage = () => (
  <EarlyLeaveRequestPage
    isLeavingOffice={boolean('isLeavingOffice', false)}
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.EarlyLeave,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.EarlyLeave,
      requestTypeName: text('requestTypeName', 'EarlyLeave'),
      startDate: text('startDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', ''),
    }}
    validation={{}}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeReason={action('onChangeReason')}
  />
);

_EarlyLeaveRequestPage.storyName = 'EarlyLeaveRequestPage';
