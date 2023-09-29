import React from 'react';

import { action } from '@storybook/addon-actions';

import AmountField from '../../components/fields/AmountField';

export default {
  title: 'commons/fields',
};

export const _AmountField = () => (
  <AmountField value={1000.345} fractionDigits={2} onBlur={action('onBlur')} />
);

_AmountField.storyName = 'AmountField';

_AmountField.parameters = {
  info: { propTables: [AmountField], inline: true, source: true },
};
