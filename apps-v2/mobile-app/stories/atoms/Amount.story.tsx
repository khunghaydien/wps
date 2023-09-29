import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { number, text, withKnobs } from '@storybook/addon-knobs';

import Amount from '../../components/atoms/Amount';

export default {
  title: 'Components/atoms/Amount',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Amount
    amount={number('amount', 199.99)}
    decimalPlaces={number('decimalPlaces', 2)}
    symbol={text('symbol', '$')}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    金額コンポーネント
    自動的に表示内容を整形します

    # Propsについて

    amount: 整形前の金額
    DecimalPlaces: 小数点以下の桁数
    Symbol: 通貨記号,
      `,
    },
  },
};
