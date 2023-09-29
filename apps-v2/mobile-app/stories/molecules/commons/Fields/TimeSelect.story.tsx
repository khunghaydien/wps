import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import TimeSelect from '../../../../components/molecules/commons/Fields/TimeSelect';

export default {
  title: 'Components/molecules/commons/Fields/TimeSelect',
  decorators: [withKnobs],
};

export const Basic = () => (
  <TimeSelect
    value={text('value', '')}
    minValue={text('minValue', '')}
    maxValue={text('maxValue', '')}
    defaultValue={text('defaultValue', '00:00')}
    placeholder={text('placeholder', '(00:00)')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    error={boolean('error', false)}
    icon={boolean('icon', false)}
    useTitle={boolean('useTitle', false)}
    onChange={action('onChange')}
  />
);

Basic.parameters = {
  info: `Time select`,
};
