import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import RecordSummarySelectListItem from '../../../components/molecules/expense/RecordSummarySelectListItem';

import records from './meta/records';

export default {
  title: 'Components/molecules/expense/RecordSummarySelectListItem',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <>
    {records.map((record, idx) => (
      <RecordSummarySelectListItem
        // eslint-disable-next-line react/no-array-index-key
        key={idx}
        onClick={action('onClick')}
        isSelected={boolean('isSelected', false)}
        record={record}
        currencySymbol={text('currencySymbol', '￥')}
        currencyDecimalPlaces={number('currencyDecimalPlaces', 2)}
      />
    ))}
  </>
);

Basic.story = {
  parameters: {
    info: {
      text: `
        # Description
        List Item for Expense mobile apps.
      `,
    },
  },
};
