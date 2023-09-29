import React from 'react';

import { VIEW_MODE } from '../../../domain/models/exp/Report';

import BaseCurrencyContainer from '../../containers/Requests/BaseCurrencyContainer';
import DialogContainer from '../../containers/Requests/DialogContainer';
import ForeignCurrencyContainer from '../../containers/Requests/ForeignCurrencyContainer';
import FormContainer from '../../containers/Requests/FormContainer';
import RecordItemContainer from '../../containers/Requests/RecordItemContainer';
import RecordListContainer from '../../containers/Requests/RecordListContainer';
import ReportListContainer from '../../containers/Requests/ReportListContainer';
import ReportSummaryContainer from '../../containers/Requests/ReportSummaryContainer';
import RouteFormContainer from '../../containers/Requests/RouteFormContainer';
import SuggestContainer from '../../containers/Requests/SuggestContainer';

import './index.scss';

type Props = {
  selectedView: string;
  fetchExpReportList: () => void;
};

export default function expenseRequestHOC(WrappedComponent) {
  return class WithRequestHOC extends React.Component<Props> {
    render() {
      return (
        (this.props.selectedView === VIEW_MODE.REPORT_DETAIL && (
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
        )) || (
          <WrappedComponent
            {...this.props}
            fetchExpReportList={this.props.fetchExpReportList}
            reportList={ReportListContainer}
            dialog={DialogContainer}
          />
        )
      );
    }
  };
}
