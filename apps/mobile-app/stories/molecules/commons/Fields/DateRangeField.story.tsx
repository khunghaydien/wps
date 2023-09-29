import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';

import DateRangeField from '../../../../components/molecules/commons/Fields/DateRangeField';

export default {
  title: 'Components/molecules/commons/Fields/DateRangeField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Date range

    # Propsについて
  `)(() => (
  // @ts-ignore
  <DateRangeField
    testId={text('testId', 'unique-id')}
    label={text('label', 'TEST')}
    required={boolean('required', false)}
    start={{
      value: text('start: value', '2019-01-01'),
      disabled: boolean('start: disabled', false),
      readOnly: boolean('start: readOnly', false),
      placeholder: boolean('start: placeholder', false),
      errors: array('start: errors', ['start ERROR']),
      onBlur: action('start: onBlur'),
    }}
    end={{
      value: text('end: value', '2019-01-31'),
      disabled: boolean('end: disabled', false),
      readOnly: boolean('end: readOnly', false),
      placeholder: boolean('end: placeholder', false),
      errors: array('end: errors', []),
      onChange: action('end: onChange'),
      onBlur: action('end: onBlur'),
    }}
  />
));
