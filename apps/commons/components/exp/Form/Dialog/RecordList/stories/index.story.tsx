import React from 'react';

import { action } from '@storybook/addon-actions';
import { createGlobalStyle } from 'styled-components';

import { Record } from '@apps/domain/models/exp/Record';

import expRecordList from '../../../../__tests__/mocks/expRecordList.mock';
import selectedAccountingPeriod from '../../../../__tests__/mocks/selectedAccountingPeriod.mock';
import RecordList from '../index';

const recordList = expRecordList as Record;

const commonProps = {
  selectedAccountingPeriod,
  baseCurrencyDecimal: 3,
  baseCurrencySymbol: '',
  records: recordList,
  isLoading: false,
  fetchExpenseType: () => Promise.resolve([]),
  getRecordList: action('No Action'),
  toggleIsLoading: action('No Action'),
  onClickConfirmButton: () => Promise.resolve(),
  onClickHideDialogButton: action('No Action'),
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Form/Dialog/RecordList',

  decorators: [
    (story) => (
      <div className="ts-expenses">
        <GlobalStyle />
        {story()}
      </div>
    ),
  ],
};

export const RecordListDialogWithoutDateWarning = () => (
  <RecordList
    initialState={{
      startDate: '2020-07-01',
      endDate: '2020-07-31',
      detail: 'Test',
    }}
    {...commonProps}
  />
);

RecordListDialogWithoutDateWarning.storyName =
  'Record List Dialog without date warning';

export const RecordListDialogWithDateWarning = () => (
  <RecordList
    initialState={{
      startDate: '2019-05-28',
      endDate: '2020-07-31',
      detail: 'Test',
    }}
    {...commonProps}
  />
);

RecordListDialogWithDateWarning.storyName =
  'Record List Dialog with date warning';
