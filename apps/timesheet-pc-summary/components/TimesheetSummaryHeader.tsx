import React from 'react';

import { labelMapping } from '../../commons/constants/requestStatus';

import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';

import './TimesheetSummaryHeader.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-header';

export type Props = {
  summaryName: string;
  status: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
};

const formatStatus = (status) => msg()[labelMapping[status]] || '';

const formatYearAndMonth = (yearAndMonth) =>
  yearAndMonth ? DateUtil.formatYM(yearAndMonth) : '';

export default class TimesheetSummaryHeader extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          <thead>
            <tr>
              <th>{msg().Att_Lbl_TargetMonth}</th>
              <th>{msg().Com_Lbl_Status}</th>
              <th>{msg().Com_Lbl_DepartmentName}</th>
              <th>{msg().Att_Lbl_WorkScheme}</th>
              <th>{msg().Com_Lbl_EmployeeCode}</th>
              <th>{msg().Com_Lbl_EmployeeName}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${ROOT}__col--period`}>
                {formatYearAndMonth(this.props.summaryName)}
              </td>
              <td className={`${ROOT}__col--status`}>
                {formatStatus(this.props.status)}
              </td>
              <td>{this.props.departmentName}</td>
              <td>{this.props.workingTypeName}</td>
              <td>{this.props.employeeCode}</td>
              <td>{this.props.employeeName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
