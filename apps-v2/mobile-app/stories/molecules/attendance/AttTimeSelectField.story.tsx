import React from 'react';

import { action } from '@storybook/addon-actions';
import {
  array,
  boolean,
  number,
  text,
  withKnobs,
} from '@storybook/addon-knobs';

import AttTimeSelectField from '../../../components/molecules/attendance/AttTimeSelectField';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs],
};

export const _AttTimeSelectField = () => (
  <AttTimeSelectField
    label={text('label', 'LABEL LABEL LABEL')}
    errors={array('errors', ['error message.'])}
    emphasis={boolean('emphasis', false)}
    // @ts-ignore
    value={number('value')}
    defaultValue={number('defaultValue', 0)}
    placeholder={text('placeholder', '(00:00)')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    icon={boolean('icon', false)}
    onChange={action('onChange')}
  />
);

_AttTimeSelectField.storyName = 'AttTimeSelectField';

_AttTimeSelectField.parameters = {
  info: `Time select`,
};
