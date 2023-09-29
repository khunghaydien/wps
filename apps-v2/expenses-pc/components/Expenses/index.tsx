import React, { ComponentType } from 'react';

import MileageForm from '@commons/containers/exp/MileageFormContainer';

import {
  BaseCurrencyContainer,
  DialogContainer,
  ForeignCurrencyContainer,
  FormContainer,
  RecordItemContainer,
  RecordListContainer,
  ReportListContainer,
  ReportSummaryContainer,
  RouteFormContainer,
  SuggestContainer,
} from './../../../expenses-pc/containers/Expenses';

const expenseRequestHOC = (WrappedComponent: ComponentType) => (props) =>
  (
    <WrappedComponent
      {...props}
      baseCurrency={BaseCurrencyContainer}
      dialog={DialogContainer}
      foreignCurrency={ForeignCurrencyContainer}
      form={FormContainer}
      mileageForm={MileageForm}
      recordItem={RecordItemContainer}
      recordList={RecordListContainer}
      reportList={ReportListContainer}
      reportSummary={ReportSummaryContainer}
      routeForm={RouteFormContainer}
      suggest={SuggestContainer}
    />
  );

export default expenseRequestHOC;
