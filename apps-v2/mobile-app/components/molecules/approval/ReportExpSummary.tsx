import * as React from 'react';

import classNames from 'classnames';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { ExpenseRequest } from '../../../../domain/models/approval/request/Request';

import Amount from '../../atoms/Amount';
import Person from '../../atoms/Person';

import './ReportExpSummary.scss';

const ROOT = 'mobile-app-molecules-approval-exp-report-summary';

export type Props = Readonly<{
  className?: string;
  report: ExpenseRequest;
  decimalPlaces: number;
  symbol: string;
}>;

export default class ReportExpSummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { report, decimalPlaces, symbol } = this.props;

    return (
      <div className={className}>
        <Person
          className={`${ROOT}__person`}
          src={report.photoUrl}
          alt={report.employeeName}
        />
        <div className={`${ROOT}__detail`}>
          <div className={`${ROOT}__subject`}>{report.subject}</div>
          <div className={`${ROOT}__name`}>{report.employeeName}</div>
          <div className={`${ROOT}__status`}>{report.status}</div>
          <div className={`${ROOT}__bottom`}>
            <div className={`${ROOT}__bottom__date`}>
              <div className={`${ROOT}__bottom__date-title`}>
                {msg().Appr_Lbl_DateSubmitted}
              </div>
              {DateUtil.formatYMD(report.requestDate)}
            </div>
            <Amount
              className={`${ROOT}__bottom__amount`}
              amount={Number(report.totalAmount)}
              decimalPlaces={decimalPlaces}
              symbol={symbol}
            />
          </div>
        </div>
      </div>
    );
  }
}
