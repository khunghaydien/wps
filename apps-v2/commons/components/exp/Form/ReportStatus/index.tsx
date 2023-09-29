import React from 'react';

import { ReportStatuses } from '../../../../../domain/models/exp/Report';

import { getStatusText } from '../../../../../domain/modules/exp/report';

import './index.scss';

const ROOT = 'ts-expenses__form-report-status';

type Props = {
  departmentCode?: string;
  departmentName?: string;
  employeeName?: string;
  isFinanceApproval?: boolean;
  reportStatus?: ReportStatuses;
};

export default class ReportStatus extends React.Component<Props> {
  render() {
    const {
      reportStatus,
      isFinanceApproval,
      departmentCode,
      departmentName,
      employeeName,
    } = this.props;

    const status = (reportStatus && reportStatus.toLowerCase()) || 'status';
    return (
      <div className={`${ROOT}__info`} data-testid={`${ROOT}-info`}>
        {reportStatus !== undefined && (
          <div className={`${ROOT}__${status.replace(' ', '')} ${ROOT}__label`}>
            {getStatusText(reportStatus)}
          </div>
        )}
        {isFinanceApproval && (
          <div className={`${ROOT}__applicant`}>
            {departmentCode
              ? `${departmentCode} - ${departmentName || ''} : `
              : ''}
            {employeeName}
          </div>
        )}
      </div>
    );
  }
}
