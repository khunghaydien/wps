import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/organisms/attendance/AttTimeList';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withKnobs, withInfo],
};

export const AttTimeList = () => (
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
          // @ts-ignore
          startTime: number('restStartTime'),
          // @ts-ignore
          endTime: number('restEndTime'),
        },
      ],
      // @ts-ignore
      min: number('minRestTimesCount'),
      // @ts-ignore
      max: number('maxRestTimesCount'),
      onChangeValueStartTime: action('onChangeRestTimeStartTime'),
      onChangeValueEndTime: action('onChangeRestTimeEndTime'),
      onClickRemove: action('onClickRemoveRestTime'),
      onClickAdd: action('onClickAddRestTime'),
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
    readOnly={boolean('readOnly', false)}
  />
);

AttTimeList.parameters = {
  info: {
    text: `
      勤務時間一覧
    `,
    inline: false,
  },
};
