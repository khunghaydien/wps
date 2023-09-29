import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/molecules/attendance/RestTimeItem';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs, (story: Function) => <div>{story()}</div>, withInfo],
};

export const RestTimeItem = () => (
  <Component
    label={text('label', '休憩１')}
    startTime={{
      value: number('startTime', 9 * 60),
      onChangeValue: action('onChangeStartTime'),
    }}
    endTime={{
      value: number('endTime', 18 * 60),
      onChangeValue: action('onChangeEndTime'),
    }}
    isDisabledRemove={boolean('isDisabledRemove', false)}
    readOnly={boolean('readOnly', false)}
    onClickRemove={action('onRemove')}
  />
);

RestTimeItem.parameters = {
  info: {
    text: `
        # Description

        勤務詳細の休憩時間リストアイテムのコンポーネントです。
      `,
  },
};
