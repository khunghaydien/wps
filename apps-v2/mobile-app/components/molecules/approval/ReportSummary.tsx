import * as React from 'react';

import classNames from 'classnames';

import {
  ApprRequest,
  REQUEST_TYPE,
} from '../../../../domain/models/approval/request/Request';

import ReportAttDailySummary from './ReportAttDailySummary';
import ReportAttFixSummary from './ReportAttFixSummary';
import ReportCustomRequest from './ReportCustomRequest';
import ReportExpSummary from './ReportExpSummary';

import './ReportSummary.scss';

const ROOT = 'mobile-app-molecules-approval-report-summary';

type Props = Readonly<{
  className?: string;
  report: ApprRequest;
  decimalPlaces?: number;
  symbol?: string;
  checked?: boolean;
  onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}>;

const Item: React.FC<{
  report: Props['report'];
  checked?: Props['checked'];
  onCheck?: Props['onCheck'];
  decimalPlaces?: Props['decimalPlaces'];
  symbol?: Props['symbol'];
}> = ({ report, checked, onCheck, decimalPlaces, symbol }) => {
  switch (report.requestType) {
    case REQUEST_TYPE.ATTENDANCE_DAILY:
      return (
        <ReportAttDailySummary
          report={report}
          checked={checked}
          onCheck={onCheck}
        />
      );
    case REQUEST_TYPE.ATTENDANCE_FIX:
      return (
        <ReportAttFixSummary
          report={report}
          checked={checked}
          onCheck={onCheck}
        />
      );
    case REQUEST_TYPE.EXPENSE:
      return (
        <ReportExpSummary
          report={report}
          decimalPlaces={decimalPlaces}
          symbol={symbol}
        />
      );
    case REQUEST_TYPE.CUSTOM_REQUEST:
      return <ReportCustomRequest report={report} />;
    default:
      return null;
  }
};

const ReportSummary: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={classNames(ROOT, className)}>
      <Item {...props} />
    </div>
  );
};

export default ReportSummary;
