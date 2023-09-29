import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/organisms/attendance/AttTimeList';

export default {
  title: 'Components/organisms/attendance/AttTimeList',
  decorators: [withKnobs],
};

const resetTimeReasons = [
  {
    id: 'a0A2800000FmMQCEA1',
    name: '所定休日',
    code: '001',
  },
  {
    id: 'a0A2800000FmMQCEA1',
    name: '私用',
    code: '002',
  },
];

export const Default = () => (
  <Component
    workingTime={{
      from: {
        // @ts-ignore
        value: number('startTime'),
        onChangeValue: action('onChangeStartTime'),
      },
      to: {
        // @ts-ignore
        value: number('endTime'),
        onChangeValue: action('onChangeEndTime'),
      },
    }}
    restTimes={{
      value: [
        {
          id: '1',
          startTime: 12 * 60,
          endTime: 13 * 60,
          restReason: null,
        },
        {
          id: '2',
          startTime: 18 * 60,
          endTime: 19 * 60,
          restReason: null,
        },
      ],
      // @ts-ignore
      min: number('minRestTimesCount'),
      // @ts-ignore
      max: number('maxRestTimesCount'),
      onChangeValue: action('onChangeRestTimeValue'),
      onClickAdd: action('onClickAddRestTime'),
      onClickRemove: action('onClickRemoveRestTime'),
    }}
    otherRestTime={
      boolean('isShowOtherRestTime', true)
        ? {
            // @ts-ignore
            value: number('otherRestTime'),
            onChange: action('onChangeOtherRestTime'),
          }
        : undefined
    }
    otherRestReason={{
      value: null,
      onChange: action('onChangeOtherRestReason'),
    }}
    restTimeReasons={resetTimeReasons}
    enabledRestReason={boolean('enabledRestReason', true)}
    readOnly={boolean('readOnly', false)}
  />
);

export const ViewMinimum = () => (
  <Component
    workingTime={{
      from: {
        // @ts-ignore
        value: 9 * 60,
        onChangeValue: action('onChangeStartTime'),
      },
      to: {
        // @ts-ignore
        value: 18 * 60,
        onChangeValue: action('onChangeEndTime'),
      },
    }}
    restTimes={{
      value: new Array(1).fill(null).map((_, idx) => ({
        id: `${idx}`,
        startTime: 12 * 60,
        endTime: 13 * 60,
        restReason: null,
      })),
      min: 1,
      max: 5,
      onChangeValue: action('onChangeRestTimeValue'),
      onClickAdd: action('onClickAddRestTime'),
      onClickRemove: action('onClickRemoveRestTime'),
    }}
    restTimeReasons={resetTimeReasons}
    enabledRestReason={false}
    readOnly={false}
  />
);

export const ViewAll = () => (
  <Component
    workingTime={{
      from: {
        // @ts-ignore
        value: 9 * 60,
        onChangeValue: action('onChangeStartTime'),
      },
      to: {
        // @ts-ignore
        value: 18 * 60,
        onChangeValue: action('onChangeEndTime'),
      },
    }}
    restTimes={{
      value: new Array(5).fill(null).map((_, idx) => ({
        id: `${idx}`,
        startTime: 12 * 60,
        endTime: 13 * 60,
        restReason: null,
      })),
      min: 1,
      max: 5,
      onChangeValue: action('onChangeRestTimeValue'),
      onClickAdd: action('onClickAddRestTime'),
      onClickRemove: action('onClickRemoveRestTime'),
    }}
    otherRestTime={{
      // @ts-ignore
      value: number('otherRestTime'),
      onChange: action('onChangeOtherRestTime'),
    }}
    otherRestReason={{
      value: null,
      onChange: action('onChangeOtherRestReason'),
    }}
    restTimeReasons={resetTimeReasons}
    enabledRestReason={true}
    readOnly={false}
  />
);

export const ReadOnly = () => (
  <Component
    workingTime={{
      from: {
        // @ts-ignore
        value: 9 * 60,
        onChangeValue: action('onChangeStartTime'),
      },
      to: {
        // @ts-ignore
        value: 18 * 60,
        onChangeValue: action('onChangeEndTime'),
      },
    }}
    restTimes={{
      value: new Array(5).fill(null).map((_, idx) => ({
        id: `${idx}`,
        startTime: 12 * 60,
        endTime: 13 * 60,
        restReason: null,
      })),
      min: 1,
      max: 5,
      onChangeValue: action('onChangeRestTimeValue'),
      onClickAdd: action('onClickAddRestTime'),
      onClickRemove: action('onClickRemoveRestTime'),
    }}
    otherRestTime={{
      // @ts-ignore
      value: number('otherRestTime'),
      onChange: action('onChangeOtherRestTime'),
    }}
    otherRestReason={{
      value: null,
      onChange: action('onChangeOtherRestReason'),
    }}
    restTimeReasons={resetTimeReasons}
    enabledRestReason={true}
    readOnly={true}
  />
);
