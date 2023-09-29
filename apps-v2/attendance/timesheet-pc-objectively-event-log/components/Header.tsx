import React from 'react';

import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import TextUtil from '../../../commons/utils/TextUtil';

import { OwnerInfo } from '../models/types';

import './Header.scss';

const ROOT = 'timesheet-pc-objectively-event-log-header';

const formatTargetMonth = (dateStr: string): string => {
  // Property target month is empty by default and it occurs an error when passed to DateUtil.
  // This wraps DateUtil.formatYM and call it only when given argument isn't empty.
  const date = dateStr
    ? dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6)
    : null;
  return !isNaN(Date.parse(date)) ? DateUtil.formatYM(date) : '';
};

export type Props = {
  period: string;
  ownerInfos: OwnerInfo[];
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
                {this.props.ownerInfos.length === 1
                  ? this.props.ownerInfos[0].department.name
                  : this.props.ownerInfos.map((ownerInfo) => (
                      <div key={ownerInfo.department.name}>
                        {TextUtil.template(
                          msg().Att_Lbl_AttSummaryDepartmentName,
                          ownerInfo.department.name,
                          DateUtil.formatYMD(ownerInfo.startDate),
                          DateUtil.formatYMD(ownerInfo.endDate)
                        )}
                      </div>
                    ))}
              </td>
              <td className={`${ROOT}__work-scheme`}>
                {this.props.ownerInfos.length === 1
                  ? this.props.ownerInfos[0].workingType.name
                  : this.props.ownerInfos.map((ownerInfo) => (
                      <div key={ownerInfo.workingType.name}>
                        {TextUtil.template(
                          msg().Att_Lbl_AttSummaryWorkingTypeName,
                          ownerInfo.workingType.name,
                          DateUtil.formatYMD(ownerInfo.startDate),
                          DateUtil.formatYMD(ownerInfo.endDate)
                        )}
                      </div>
                    ))}
              </td>
              <td className={`${ROOT}__emp-code`}>
                {this.props.ownerInfos[0]?.employee.code}
              </td>
              <td className={`${ROOT}__emp-name`}>
                {this.props.ownerInfos[0]?.employee.name}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
