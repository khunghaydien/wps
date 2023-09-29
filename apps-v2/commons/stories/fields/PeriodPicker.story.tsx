import React from 'react';

import { action } from '@storybook/addon-actions';

import PeriodPicker from '../../components/fields/PeriodPicker';

const selectOptions = [
  { text: 'item1', value: 'item1' },
  { text: 'item2', value: 'item2' },
  { text: 'item3', value: 'item3' },
];

export default {
  title: 'commons/fields',
};

export const _PeriodPicker = () => (
  <PeriodPicker
    selectOptions={selectOptions}
    currentButtonLabel="今日"
    selectValue="item2"
    onClickCurrentButton={action('click current')}
    onClickNextButton={action('click next')}
    onClickPrevButton={action('click previous')}
    onChangeSelect={action('change select')}
  />
);

_PeriodPicker.storyName = 'PeriodPicker';

_PeriodPicker.parameters = {
  info: { propTables: [PeriodPicker], inline: true, source: true },
};
