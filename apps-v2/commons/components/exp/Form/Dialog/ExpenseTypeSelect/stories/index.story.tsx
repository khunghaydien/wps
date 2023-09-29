import React from 'react';

import { createGlobalStyle } from 'styled-components';

import expTypeList from '../../../../__tests__/mocks/expTypeList.mock';
import ExpenseTypeSelect from '../index';

const commonProps = {
  hintMsg: 'This is hint',
  hasMore: true,
  selectedDelegator: {},
  expenseTypeList: [],
  expenseTypeSearchList: [],
  expenseTypeRecentItems: expTypeList.expTypeRecentItemList,
  expenseTypeFavoriteItems: [],
  selectedReceipt: '',
  isLoading: false,
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Form/Dialog/ExpenseType',

  decorators: [
    (story) => (
      <div className="ts-expenses">
        <GlobalStyle />
        {story()}
      </div>
    ),
  ],
};

export const ExpenseTypesRecentlyUsedView = () => (
  <ExpenseTypeSelect {...commonProps} />
);

ExpenseTypesRecentlyUsedView.storyName = 'Expense Types RecentlyUsed View';

export const ExpenseTypesFaView = () => (
  <ExpenseTypeSelect {...commonProps} isFinanceApproval />
);

ExpenseTypesFaView.storyName = 'Expense Types FA View';

export const ExpenseTypesHierarchyView = () => (
  <ExpenseTypeSelect
    initialState={{ mode: 'directory' }}
    {...commonProps}
    expenseTypeList={expTypeList.expTypeHierarchyItemList}
  />
);

export const ExpenseTypesFavoriteView = () => (
  <ExpenseTypeSelect
    initialState={{
      mode: 'favorite',
      tempFavoriteItems: expTypeList.expTypeFavoriteItemList,
    }}
    {...commonProps}
  />
);
