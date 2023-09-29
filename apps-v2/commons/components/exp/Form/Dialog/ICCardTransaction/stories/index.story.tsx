import React from 'react';

import { action } from '@storybook/addon-actions';
import { createGlobalStyle } from 'styled-components';

import icCardTransactionList, {
  icCardList,
} from '../../../../__tests__/mocks/icCardTransactionList.mock';

import selectedAccountingPeriod from '../../../../__tests__/mocks/selectedAccountingPeriod.mock';
import ICCardTransaction from '../index';

const promiseAction = (payload) => () => {
  return Promise.resolve(payload);
};

const commonProps = {
  selectedAccountingPeriod,
  baseCurrencyDecimal: 3,
  baseCurrencySymbol: '',
  overlap: { report: true, record: false },
  isLoading: false,
  progressBar: [
    { id: '1', text: 'IC Card Transaction Selection', status: 'selected' },
    { id: '2', text: 'Expense Type Selection', status: 'inactive' },
  ],
  setProgressBar: action('No Action'),
  toggleIsLoading: action('No Action'),
};
const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Form/Dialog/ICCard',

  decorators: [
    (story) => (
      <div className="ts-expenses">
        <GlobalStyle />
        {story()}
      </div>
    ),
  ],
};

export const IcCardDialogWithRecords = () => (
  <ICCardTransaction
    initialState={{
      startDate: '2019-05-26',
      endDate: '2020-07-30',
      filteredTransactions: icCardTransactionList,
      selectedCards: ['4'],
    }}
    {...commonProps}
    getIcCardList={promiseAction(icCardList)}
    getIcTransactionsWithCardNo={promiseAction(icCardTransactionList)}
  />
);

IcCardDialogWithRecords.storyName = 'IC Card Dialog with records';

export const IcCardDialogEmpty = () => (
  <ICCardTransaction
    initialState={{
      startDate: '2019-11-22',
      endDate: '2020-07-30',
      filteredTransactions: [],
      selectedCards: ['4'],
    }}
    {...commonProps}
    getIcCardList={promiseAction([])}
    getIcTransactionsWithCardNo={promiseAction([])}
  />
);

IcCardDialogEmpty.storyName = 'IC Card Dialog empty';
