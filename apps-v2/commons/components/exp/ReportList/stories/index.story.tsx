import React from 'react';

import { createGlobalStyle } from 'styled-components';

import apActive from '../../__tests__/mocks/apActive.mock';
import expReportList from '../../__tests__/mocks/expReportList.mock';
import reportIdList from '../../__tests__/mocks/reportIdList.mock';
import reportTypeList from '../../__tests__/mocks/reportTypeList.mock';
import storeMock from '../../__tests__/mocks/store.mock';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../../expenses-pc/store/configureStore';
import ReportList from '../index';

const commonProps = {
  currentPage: 1,
  requestTotalNum: 13,
  orderBy: 'Asc',
  sortBy: '',
  pageSize: 25,
  maxPageNo: 40,
  maxSearchNo: 1000,
  reportIdList,
  companyId: 'a0N0o00000aablZEAQ',
  employeeId: 'a0W0o000014dM9fEAE',
  defaultCostCenter: [],
  expReportList: expReportList.activeList,
  mode: 'INITIALIZE',
  selectedExpReport: {},
  baseCurrencySymbol: '',
  baseCurrencyDecimal: 3,
  reportTypeList,
  isLoading: false,
  selectedView: 'REPORT_LIST',
  apActive,
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

const store = configureStore(storeMock);

export default {
  title: 'expenses-pc/Main',

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

export const ReportListExpenseViewNoReport = () => (
  <ReportList {...commonProps} expReportList={[]} filter="NotRequested" />
);

ReportListExpenseViewNoReport.storyName = 'Report List expense view no report';

export const ReportListExpenseViewActive = () => (
  <ReportList {...commonProps} filter="NotRequested" />
);

ReportListExpenseViewActive.storyName = 'Report List expense view active';

export const ReportListExpenseViewApproved = () => (
  <ReportList
    {...commonProps}
    filter="Approved"
    expReportList={expReportList.approvedList}
  />
);

ReportListExpenseViewApproved.storyName = 'Report List expense view approved';
