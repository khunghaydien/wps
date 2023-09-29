import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import LikeInputButtonField from '../../../../components/molecules/commons/Fields/LikeInputButtonField';

export default {
  title: 'Components/molecules/commons/Fields/LikeInputButtonField',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    This component is used as like input button field for mobile app。
  `)(() => (
  <LikeInputButtonField
    placeholder={text('placeholder', 'Search')}
    onClick={action('onClick')}
    label={text('label', 'Label')}
    value={text('value', 'value')}
    disabled={boolean('disabled', false)}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
  />
));
