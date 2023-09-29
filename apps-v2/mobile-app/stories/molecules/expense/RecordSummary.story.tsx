import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import RecordSummary from '../../../components/molecules/expense/RecordSummary';

import { createRecord } from './meta/records';

export default {
  title: 'Components/molecules/expense/RecordSummary',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => {
  const remarks = text('remarks', '');
  const routeInfo = {
    origin: {
      name: text('orignName', '出発地'),
    },
    arrival: {
      name: text('arrivalName', '目的地'),
    },
    selectedRoute: {
      status: {
        isEarliest: boolean('isEarliest', true),
        isCheapest: boolean('isCheapest', true),
        isMinTransfer: boolean('isMinTransfer', true),
      },
      pathList: [],
    },
  };
  return (
    <RecordSummary
      record={createRecord({
        recordId: '1',
        recordDate: text('date', '2018-01-01'),
        amount: number('amount', 1000),
        expTypeName: text('subject', '費目１'),
        currencyInfo: {
          code: '',
          name: '',
          // @ts-ignore
          decimalPlaces: number('decimalPlases'),
          symbol: text('symbol', '￥'),
        },
        routeInfo: remarks ? null : routeInfo,
        remarks,
      })}
      currencySymbol={text('currencySymbol', '￥')}
      currencyDecimalPlaces={number('currencyDecimalPlaces', 2)}
    />
  );
};

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
