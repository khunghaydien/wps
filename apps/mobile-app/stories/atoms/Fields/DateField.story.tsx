import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import DateField from '../../../components/atoms/Fields/DateField';

export default {
  title: 'Components/atoms/Fields/DateField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Date Field
  `)(() => (
  <DateField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    error={boolean('error', false)}
    value={text('value', '2019-01-01')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
  />
));
