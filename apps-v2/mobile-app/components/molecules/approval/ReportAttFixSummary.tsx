import * as React from 'react';

import classNames from 'classnames';

import PersonCheckBox from '../../molecules/commons/Fields/PersonCheckBox';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { AttendanceFixRequest } from '@apps/domain/models/approval/request/Request';

import './ReportAttSummary.scss';

const ROOT = 'mobile-app-molecules-approval-att-report-summary';

export type Props = Readonly<{
  className?: string;
  report: AttendanceFixRequest;
  checked: boolean;
  onCheck: React.ComponentProps<typeof PersonCheckBox>['onCheck'];
}>;

const ReportAttFixSummary: React.FC<Props> = ({
  className,
  report,
  checked,
  onCheck,
}) => (
  <div className={classNames(ROOT, className)}>
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
          {DateUtil.formatYM(report.targetMonth)}
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

export default ReportAttFixSummary;
