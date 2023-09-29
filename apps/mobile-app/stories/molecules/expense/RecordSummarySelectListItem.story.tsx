import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import RecordSummarySelectListItem from '../../../components/molecules/expense/RecordSummarySelectListItem';

import records from './meta/records';

export default {
  title: 'Components/molecules/expense/RecordSummarySelectListItem',
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
    <RecordSummarySelectListItem
      onClick={action('onClick')}
      isSelected={boolean('isSelected', false)}
      record={record}
      currencySymbol={text('currencySymbol', '￥')}
      currencyDecimalPlaces={number('currencyDecimalPlaces', 2)}
    />
  ))
);
