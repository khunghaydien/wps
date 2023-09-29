import * as React from 'react';

import classNames from 'classnames';
import { $Values } from 'utility-types';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import ApprovalStatus from '../commons/ApprovalStatus';

import STATUS, {
  ApprovalStatus as ApprovalStatusTypes,
} from '../../../../domain/models/approval/request/Status';
import { ReportListItem } from '../../../../domain/models/exp/Report';

import Amount from '../../atoms/Amount';
import Icon from '../../atoms/Icon';

import './ReportSummary.scss';

const ROOT = 'mobile-app-molecules-expense-report-summary';

export type Props = Readonly<{
  className?: string;
  report: ReportListItem;
  decimalPlaces: number;
  symbol: string;
}>;

export default class ReportSummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { report, decimalPlaces, symbol } = this.props;

    return (
      <div className={className}>
        <div className={`${ROOT}__subject`}>{report.subject}</div>
        <div className={`${ROOT}__content`}>
          {report.status && (
            <ApprovalStatus
              status={
                report.status === STATUS.Canceled
                  ? STATUS.Rejected
                  : (report.status as $Values<ApprovalStatusTypes>)
              } // overwriting is temporal. BE should change 'accounting rejected' status.
              className={`${ROOT}__status`}
            />
          )}
        </div>
        <div className={`${ROOT}__bottom`}>
          <div className={`${ROOT}__bottom__date`}>
            <Icon
              className={`${ROOT}__bottom__date-icon`}
              type="monthlyview"
              size="small"
            />
            <div className={`${ROOT}__bottom__date-title`}>
              {msg().Appr_Lbl_DateSubmitted}:
            </div>
            {DateUtil.formatYMD(report.requestDate)}
          </div>
          <Amount
            className={`${ROOT}__bottom__amount`}
            amount={report.totalAmount}
            decimalPlaces={decimalPlaces}
            symbol={symbol}
          />
        </div>
      </div>
    );
  }
}
