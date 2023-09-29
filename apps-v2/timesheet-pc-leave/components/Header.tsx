import React from 'react';

import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';

import './Header.scss';

const ROOT = 'timesheet-pc-leave-header';

const formatTargetMonth = (dateStr: string): string => {
  // Property target month is empty by default and it occurs an error when passed to DateUtil.
  // This wraps DateUtil.formatYM and call it only when given argument isn't empty.
  return !isNaN(Date.parse(dateStr)) ? DateUtil.formatYM(dateStr) : '';
};

export type Props = {
  period: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
};

export default class Header extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          <thead>
            <tr>
              <th>{msg().Att_Lbl_TargetMonth}</th>
              <th>{msg().Com_Lbl_DepartmentName}</th>
              <th>{msg().Att_Lbl_WorkScheme}</th>
              <th>{msg().Com_Lbl_EmployeeCode}</th>
              <th>{msg().Com_Lbl_EmployeeName}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${ROOT}__target-month`}>
                {formatTargetMonth(this.props.period)}
              </td>
              <td className={`${ROOT}__dept-name`}>
                {this.props.departmentName}
              </td>
              <td className={`${ROOT}__work-scheme`}>
                {this.props.workingTypeName}
              </td>
              <td className={`${ROOT}__emp-code`}>{this.props.employeeCode}</td>
              <td className={`${ROOT}__emp-name`}>{this.props.employeeName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
