import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import AmountInput from '../../../../components/molecules/commons/Fields/AmountInput';

export default {
  title: 'Components/molecules/commons/Fields/AmountInput',
  decorators: [withKnobs],
};

export const Base = withInfo({
  inline: true,
  text: `
  時間範囲を入力するためのフィールドです。
`,
})(() => (
  <AmountInput
    disabled={boolean('disabled', false)}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    placeholder={text('placeholder', '')}
    decimalPlaces={number('decimalPlaces', 2)}
    value={number('value', 0)}
    error={boolean('error', false)}
    onBlur={action('onBlur')}
  />
));
