import React from 'react';

import { action } from '@storybook/addon-actions';
import { createGlobalStyle } from 'styled-components';

import apActive from '../../../../__tests__/mocks/apActive.mock';
import customHint from '../../../../__tests__/mocks/customHint.mock';
import { errors } from '../../../../__tests__/mocks/errors.mock';
import {
  expReport,
  expReportIncomplete,
} from '../../../../__tests__/mocks/expReport.mock';
import reportTypeList from '../../../../__tests__/mocks/reportTypeList.mock';
import storeMock from '../../../../__tests__/mocks/store.mock';
import { touched } from '../../../../__tests__/mocks/touched.mock';
import { withProvider } from '../../../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../../../../expenses-pc/store/configureStore';
import ReportSummary from '../index';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

const promiseAction = (msg) => () => {
  action(msg);
  return Promise.resolve([]);
};

const commonProps = {
  customHint,
  reportTypeList,
  inactiveReportTypeList: [],
  readOnly: false,
  apActive,
  isExpense: true,
  isFinanceApproval: false,
  baseCurrencyDecimal: 2,
  baseCurrencySymbol: '',
  isExpenseRequest: false,
  onChangeEditingExpReport: action('No Action'),
  getRecentCostCenters: promiseAction('No Action'),
  getRecentJobs: promiseAction('No Action'),
  getRecentVendors: promiseAction('No Action'),
};

const store = configureStore(storeMock);

export default {
  title: 'expenses-pc/Form/ReportSummary/Form',

  decorators: [
    withProvider(store),
    (story) => (
      <div className="ts-expenses">
        <GlobalStyle />
        {story()}
      </div>
    ),
  ],
};

export const FormReportSummaryNoError = () => (
  <ReportSummary
    {...commonProps}
    mode="REPORT_SELECT"
    expReport={expReport}
    touched={{}}
    errors={{}}
  />
);

export const FormReportSummaryWithError = () => (
  <ReportSummary
    {...commonProps}
    mode="REPORT_EDIT"
    expReport={expReportIncomplete}
    touched={touched}
    errors={errors}
  />
);
