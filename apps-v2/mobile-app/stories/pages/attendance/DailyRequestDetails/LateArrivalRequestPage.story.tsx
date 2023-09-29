import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/LateArrivalRequestPage';

import store from '../store.mock';

const lateArrivalReasonList = [
  {
    id: 'a172v00000deeEvAAI',
    name: '遅刻理由テスト1',
    code: 'testCode001',
  },
  {
    id: 'a172v00000deeEvAA3',
    name: '遅刻理由テスト2',
    code: 'testCode002',
  },
];
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
    lateArrivalReasonOptions={[]}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
  />
);

export const LateArrivalRequestPageForUseLateArrivalReason = () => (
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
      startDate: text('startDate', '2022-12-26'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', 'テスト'),
      reasonId: 'a172v00000deeEvAAI',
      reasonCode: '遅刻理由テスト1',
      reasonName: 'testCode001',
      useLateArrivalReason: true,
    }}
    validation={{}}
    lateArrivalReasonOptions={lateArrivalReasonList.map(({ id, name }) => ({
      label: name,
      value: id,
    }))}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReasonId={action('onChangeReasonId')}
    onChangeRemarks={action('onChangeRemarks')}
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
LateArrivalRequestPageForUseLateArrivalReason.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      遅刻申請詳細画面(遅刻理由を使用する)
    `,
  },
};
