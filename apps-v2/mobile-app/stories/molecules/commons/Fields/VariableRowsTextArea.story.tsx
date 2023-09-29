import React from 'react';

import { number, text, withKnobs } from '@storybook/addon-knobs';

import Component from '@mobile/components/molecules/commons/Fields/VariableRowsTextArea';

export default {
  title: 'Components/molecules/commons/Fields',
  decorators: [withKnobs],
};

export const VariableRowsTextArea = (): React.ReactNode => (
  <Component
    rows={number('rows', 1)}
    variableRows={number('variableRows', 2)}
    value={text('value', 'TEXT TEXT TEXT')}
  />
);
