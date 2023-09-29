import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import RadioButtonGroup from '../../components/atoms/RadioButtonGroup';

const options = [
  {
    label: 'Use',
    value: '0',
  },
  {
    label: 'Not Use',
    value: '1',
  },
  {
    label: 'third value',
    value: '2',
  },
];

const options2 = [
  {
    label: '全日休',
    value: '0',
  },
  {
    label: '午前半日休',
    value: '1',
  },
  {
    label: '午後半日休',
    value: '2',
  },
  {
    label: '時間単位休',
    value: '3',
  },
];

export default {
  title: 'Components/atoms/RadioButtonGroup',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <RadioButtonGroup
    label={{ label: 'Test Label' }}
    onChange={action('onChange')}
    options={options}
    classic={boolean('classic', false)}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    value="0"
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
        # Description

        Radio Button Group from SLDS https://react.lightningdesignsystem.com/components/radio-button-groups/
      `,
    },
  },
};

export const Classic = () => (
  <RadioButtonGroup
    label={{ label: 'Test Label' }}
    onChange={action('onChange')}
    options={options2}
    classic={boolean('classic', true)}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    value={text('value', '1')}
  />
);

Classic.story = {
  parameters: {
    info: {
      text: `
        # Description

        You can use classic style for radio button groups if you enabled on classic prop.
      `,
    },
  },
};

export const Error = () => (
  <RadioButtonGroup
    label={{ label: 'Test Label', error: 'Something went wrong!' }}
    onChange={action('onChange')}
    options={options}
    classic={boolean('classic', false)}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
    value="0"
  />
);
