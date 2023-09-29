/* eslint-disable react/no-array-index-key */
import React from 'react';

import { labelMapping } from '../../../commons/constants/requestStatus';

import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import TextUtil from '../../../commons/utils/TextUtil';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import './TimesheetSummaryHeader.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-header';

export type Props = {
  summaryName: State['name'];
  status: State['status'];
  ownerInfos: State['ownerInfos'];
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
              <td>
                {this.props.ownerInfos.length === 1
                  ? this.props.ownerInfos[0].department.name
                  : this.props.ownerInfos.map((ownerInfo, idx) => (
                      <div key={`${ownerInfo.department.name}-${idx}`}>
                        {TextUtil.template(
                          msg().Att_Lbl_AttSummaryDepartmentName,
                          ownerInfo.department.name,
                          DateUtil.formatYMD(ownerInfo.startDate),
                          DateUtil.formatYMD(ownerInfo.endDate)
                        )}
                      </div>
                    ))}
              </td>
              <td>
                {this.props.ownerInfos.length === 1
                  ? this.props.ownerInfos[0].workingType.name
                  : this.props.ownerInfos.map((ownerInfo, idx) => (
                      <div key={`${ownerInfo.workingType.name}-${idx}`}>
                        {TextUtil.template(
                          msg().Att_Lbl_AttSummaryWorkingTypeName,
                          ownerInfo.workingType.name,
                          DateUtil.formatYMD(ownerInfo.startDate),
                          DateUtil.formatYMD(ownerInfo.endDate)
                        )}
                      </div>
                    ))}
              </td>
              <td>{this.props.ownerInfos[0]?.employee.code}</td>
              <td>{this.props.ownerInfos[0]?.employee.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
