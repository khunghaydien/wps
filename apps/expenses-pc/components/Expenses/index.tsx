import React from 'react';

import { VIEW_MODE } from '../../../domain/models/exp/Report';

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
} from '../../containers/Expenses';

type Props = {
  selectedView: string;
  fetchExpReportList: () => void;
};

export default function expenseRequestHOC(WrappedComponent) {
  return class WithRequestHOC extends React.Component<Props> {
    render() {
      const ReportDetail = (
        <WrappedComponent
          {...this.props}
          baseCurrency={BaseCurrencyContainer}
          dialog={DialogContainer}
          fetchExpReportList={this.props.fetchExpReportList}
          foreignCurrency={ForeignCurrencyContainer}
          form={FormContainer}
          recordItem={RecordItemContainer}
          recordList={RecordListContainer}
          reportList={ReportListContainer}
          reportSummary={ReportSummaryContainer}
          routeForm={RouteFormContainer}
          suggest={SuggestContainer}
        />
      );
      const ReportList = (
        <WrappedComponent
          {...this.props}
          fetchExpReportList={this.props.fetchExpReportList}
          reportList={ReportListContainer}
          dialog={DialogContainer}
        />
      );
      return (
        (this.props.selectedView === VIEW_MODE.REPORT_DETAIL && (
          <>{ReportDetail}</>
        )) || <>{ReportList}</>
      );
    }
  };
}
