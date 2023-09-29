import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { number, text, withKnobs } from '@storybook/addon-knobs';

import RecordSummaryListItem from '../../../components/molecules/expense/RecordSummaryListItem';

import records from './meta/records';

export default {
  title: 'Components/molecules/expense/RecordSummaryListItem',
  decorators: [withKnobs],
};

export const Basic = withInfo({
  inline: true,
  text: `
        # Description
        List Item for Expense mobile apps.
      `,
})(() =>
  records.map((record) => (
    <RecordSummaryListItem
      onClick={action('onClick')}
      record={record}
      currencySymbol={text('currencySymbol', '￥')}
      currencyDecimalPlaces={number('currencyDecimalPlaces', 2)}
    />
  ))
);
