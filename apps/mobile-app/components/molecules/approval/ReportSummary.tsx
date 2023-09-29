import * as React from 'react';

import classNames from 'classnames';

import { ApprRequest } from '../../../../domain/models/approval/request/Request';

import ReportAttSummary from './ReportAttSummary';
import ReportExpSummary from './ReportExpSummary';

import './ReportSummary.scss';

const ROOT = 'mobile-app-molecules-approval-report-summary';

export type Props = Readonly<{
  className?: string;
  report: ApprRequest;
  decimalPlaces: number;
  symbol: string;
}>;

export default class ReportSummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { report, decimalPlaces, symbol } = this.props;

    return (
      <div className={className}>
        {report.requestType === 'expense' ? (
          <ReportExpSummary
            report={report}
            decimalPlaces={decimalPlaces}
            symbol={symbol}
          />
        ) : (
          <ReportAttSummary report={report} />
        )}
      </div>
    );
  }
}
