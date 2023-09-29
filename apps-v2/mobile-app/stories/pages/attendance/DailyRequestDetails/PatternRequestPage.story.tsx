import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/PatternRequestPage';

import store from '../store.mock';

const patterns = [
  {
    code: 'A',
    name: 'Pattern A',
    startTime: 9 * 60,
    endTime: 18 * 60,
    restTimes: [
      {
        startTime: 12 * 60,
        endTime: 13 * 60,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 15 * 60,
        endTime: 15 * 60 + 15,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
  },
  {
    code: 'B',
    name: 'Pattern B',
    startTime: 9 * 60,
    endTime: 12 * 60,
    restTimes: [
      {
        startTime: 10 * 60,
        endTime: 10 * 60 + 15,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 11 * 60,
        endTime: 11 * 60 + 15,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
  },
  {
    code: 'C',
    name: 'Pattern C',
    startTime: 12 * 60,
    endTime: 15 * 60,
    restTimes: [
      {
        startTime: 13 * 60,
        endTime: 13 * 60 + 15,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 14 * 60,
        endTime: 14 * 60 + 15,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
  },
];

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

export const PatternRequestPage = () => (
  <Component
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.Pattern,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.Pattern,
      requestTypeName: text('requestTypeName', 'Pattern'),
      startDate: text('startDate', '2018-01-01'),
      patternName: 'A',
      patternCode: text('patternCode', 'A'),
      startTime: 9 * 60,
      endTime: 18 * 60,
      patternRestTimes: patterns[0].restTimes,
      availablePatterns: patterns,
      remarks: text('remarks', ''),
    }}
    validation={{}}
    patternOptions={patterns.map(({ code, name }) => ({
      label: name,
      value: code,
    }))}
    onChangeStartDate={action('onChangeStartDate')}
    onChangeEndDate={action('onChangeEndDate')}
    onChangePatternCode={action('onChangePatternCode')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);

PatternRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      勤務時間変更申請詳細画面
    `,
  },
};
