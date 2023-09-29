import React from 'react';

import { action } from '@storybook/addon-actions';
import {
  array,
  boolean,
  number,
  text,
  withKnobs,
} from '@storybook/addon-knobs';

import AttTimeSelectRangeField from '../../../components/molecules/attendance/AttTimeSelectRangeField';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs],
};

export const _AttTimeSelectRangeField = () => (
  <AttTimeSelectRangeField
    label={text('label', 'LABEL')}
    disabled={boolean('disabled', false)}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    placeholder={text('placeholder', '')}
    errors={array('error', [])}
    from={{
      label: text('fromLabel', 'FROM LABEL'),
      value: number('fromValue', 9 * 60),
      defaultValue: number('fromDefaultValue', 9 * 60),
      placeholder: text('fromPlaceholder', ''),
      errors: array('fromError', []),
      onChangeValue: action('onChangeFromValue'),
    }}
    to={{
      label: text('toLabel', 'TO LABEL'),
      value: number('toValue', 18 * 60),
      defaultValue: number('toDefaultValue', 18 * 60),
      placeholder: text('toPlaceholder', ''),
      errors: array('toError', []),
      onChangeValue: action('onChangeToValue'),
    }}
  />
);

_AttTimeSelectRangeField.storyName = 'AttTimeSelectRangeField';

_AttTimeSelectRangeField.parameters = {
  info: `時間範囲を入力するためのフィールドです。`,
};
