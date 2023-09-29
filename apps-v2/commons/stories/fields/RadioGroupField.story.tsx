import React from 'react';

import { action } from '@storybook/addon-actions';

import RadioGroupField, {
  LAYOUT_TYPE,
} from '../../components/fields/RadioGroupField';

const dummyOptions = [
  { text: 'sample1', value: 'sample1-value' },
  { text: 'sample2', value: 'sample2-value' },
];

export default {
  title: 'commons/fields',
};

export const _RadioGroupField = () => (
  // @ts-ignore
  <RadioGroupField
    options={dummyOptions}
    value="sample2-value"
    onChange={action('action')}
    name="name"
  />
);

_RadioGroupField.storyName = 'radioGroupField';

_RadioGroupField.parameters = {
  info: { propTables: [RadioGroupField], inline: true, source: true },
};

export const RadioGroupFieldVerticalLayout = () => (
  // @ts-ignore
  <RadioGroupField
    options={dummyOptions}
    value="sample2-value"
    onChange={action('action')}
    name="name"
    layout={LAYOUT_TYPE.vertical}
  />
);

RadioGroupFieldVerticalLayout.storyName = 'radioGroupField - vertical layout';

RadioGroupFieldVerticalLayout.parameters = {
  info: { propTables: [RadioGroupField], inline: true, source: true },
};
