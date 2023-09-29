import React from 'react';

import { createGlobalStyle } from 'styled-components';

import reportTypeList from '../../__tests__/mocks/reportTypeList.mock';
import ExpenseHeader from '../index';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Header',

  decorators: [
    (story) => (
      <>
        <GlobalStyle />
        {story()}
      </>
    ),
  ],
};

export const ExpenseView = () => (
  <ExpenseHeader reportTypeList={reportTypeList} selectedView="LIST" />
);

export const ExpenseViewNoReportType = () => (
  <ExpenseHeader reportTypeList={[]} selectedView="LIST" />
);

export const RequestView = () => (
  <ExpenseHeader
    isExpenseRequest
    reportTypeList={reportTypeList}
    selectedView="LIST"
  />
);

export const RequestViewNoReportType = () => (
  <ExpenseHeader isExpenseRequest reportTypeList={[]} selectedView="LIST" />
);
