import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import TaskTimeSelect from '../../../components/molecules/tracking/TaskTimeSelect';

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs],
};

export const _TaskTimeSelect = () => (
  <TaskTimeSelect
    value={text('value', '')}
    defaultValue={text('defaultValue', '00:00')}
    placeholder={text('placeholder', '(00:00)')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    error={boolean('error', false)}
    icon={boolean('icon', false)}
    onChange={action('onChange')}
  />
);

_TaskTimeSelect.storyName = 'TaskTimeSelect';

_TaskTimeSelect.parameters = {
  info: `Time select`,
};
