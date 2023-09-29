import React from 'react';

import { action } from '@storybook/addon-actions';
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';

import TaskTimeSelectField from '../../../components/molecules/tracking/TaskTimeSelectField';

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs],
};

export const _TaskTimeSelectField = () => (
  <TaskTimeSelectField
    label={text('label', 'LABEL LABEL LABEL')}
    errors={array('errors', ['error message.'])}
    emphasis={boolean('emphasis', false)}
    // @ts-ignore
    value={text('value')}
    defaultValue={text('defaultValue', '00:00')}
    placeholder={text('placeholder', '(00:00)')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    icon={boolean('icon', false)}
    onChange={action('onChange')}
  />
);

_TaskTimeSelectField.storyName = 'TaskTimeSelectField';

_TaskTimeSelectField.parameters = {
  info: `Time select`,
};
