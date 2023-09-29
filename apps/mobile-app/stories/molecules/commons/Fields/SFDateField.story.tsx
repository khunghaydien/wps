import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import SFDateField from '../../../../components/molecules/commons/Fields/SFDateField';

export default {
  title: 'Components/molecules/commons/Fields/DateField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    Date Field
  `)(() => (
  <SFDateField
    testId={text('testId', 'unique-id')}
    required={boolean('required', false)}
    errors={[text('errors[0]', 'error')]}
    value={text('value', '2019-01-01')}
    emphasis={boolean('emphasis', false)}
    label={text('label', 'label')}
    placeholder={text('placeholder', 'placeholder')}
    disabled={boolean('disabled', false)}
    onChange={action('onChange')}
    onBlur={action('onBlur')}
    useRemoveValueButton={boolean('useRemoveValueButton', true)}
    onClickRemoveValueButton={action('onClickRemoveValueButton')}
  />
));
