import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import PersonCheckBox from '../../molecules/commons/Fields/PersonCheckBox';

import { AttendanceDailyRequest } from '../../../../domain/models/approval/request/Request';

import './ReportAttSummary.scss';

const ROOT = 'mobile-app-molecules-approval-att-report-summary';

export type Props = Readonly<{
  className?: string;
  report: AttendanceDailyRequest;
  checked: boolean;
  onCheck: React.ComponentProps<typeof PersonCheckBox>['onCheck'];
}>;

export default class ReportAttendanceDailySummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { report, checked, onCheck } = this.props;

    return (
      <div className={className}>
        <PersonCheckBox
          className={`${ROOT}__person`}
          src={report.photoUrl}
          alt={report.employeeName}
          onCheck={onCheck}
          value={checked}
        />
        <div className={`${ROOT}__detail`}>
          <div className={`${ROOT}__type`}>
            <span>{report.subject}</span>
            <span className={`${ROOT}__period`}>
              {`${DateUtil.formatYMD(report.startDate)} `}
              {report.endDate !== null &&
                report.startDate !== report.endDate && (
                  <span>- {DateUtil.formatYMD(report.endDate)}</span>
                )}
            </span>
          </div>
          <div className={`${ROOT}__name`}>{report.employeeName}</div>
          <div className={`${ROOT}__department`}>{report.departmentName}</div>
          <div className={`${ROOT}__bottom`}>
            <div className={`${ROOT}__bottom__date`}>
              <div className={`${ROOT}__bottom__date-title`}>
                {msg().Appr_Lbl_DateSubmitted}
              </div>
              {DateUtil.formatYMD(report.requestDate)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
