import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import AttTimeSelect from '../../../components/molecules/attendance/AttTimeSelect';

export default {
  title: 'Components/molecules/attendance',
  decorators: [withKnobs],
};

export const _AttTimeSelect = () => (
  <AttTimeSelect
    // @ts-ignore
    value={number('value')}
    defaultValue={number('defaultValue', 0)}
    placeholder={text('placeholder', '(00:00)')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    error={boolean('error', false)}
    icon={boolean('icon', false)}
    onChange={action('onChange')}
  />
);

_AttTimeSelect.storyName = 'AttTimeSelect';

_AttTimeSelect.parameters = {
  info: `Time select`,
};
