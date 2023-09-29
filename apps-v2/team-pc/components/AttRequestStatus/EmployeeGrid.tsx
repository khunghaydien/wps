import * as React from 'react';

import classnames from 'classnames';

import Button from '../../../commons/components/buttons/Button';
import Grid from '../../../commons/components/Grid';
import DoubleTextFilter from '../../../commons/components/Grid/filters/DoubleTextFilter';
import SelectFilter from '../../../commons/components/Grid/filters/SelectFilter';
import TextFilter from '../../../commons/components/Grid/filters/TextFilter';
import EmployeeFormatter from '../../../commons/components/Grid/Formatters/Employee';
import AccessControl from '../../../commons/containers/AccessControlContainer';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

import STATUS, { Status } from '../../../domain/models/approval/request/Status';
import { AttSummary } from '../../../domain/models/team/AttSummary';

import './EmployeeGrid.scss';

const ROOT = 'team-pc-employee-grid';

export type Props = Readonly<{
  records: AttSummary['records'];
  onClickOpenTimesheetWindowButton: (arg0: {
    empId: string;
    targetDate: string;
  }) => void;
  onUpdateFilterTerm: (key: string, value: string) => void;
  workingTypeNameOptions: Array<string | { text: string; value: any }>;
  closingDateOptions: Array<string | { text: string; value: any }>;
  filterTerms: {
    employeeName: string;
    employeeCode: string;
    workingTypeName: string;
    endDate: string;
    status: Status | '';
    approverName: string;
  };
}>;

export default class ListItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.bindOnUpdateFilterTermByKey =
      this.bindOnUpdateFilterTermByKey.bind(this);
  }

  bindOnUpdateFilterTermByKey = (key: string) => (value: string) =>
    this.props.onUpdateFilterTerm(key, value);

  render() {
    const { props, bindOnUpdateFilterTermByKey } = this;
    const className = classnames(ROOT);

    const { filterTerms } = props;

    const statusOptions = [
      {
        text: msg().Att_Lbl_ReqStatNotRequested,
        value: STATUS.NotRequested,
      },
      {
        text: msg().Att_Lbl_ReqStatRecalled,
        value: STATUS.Recalled,
      },
      {
        text: msg().Att_Lbl_ReqStatRejected,
        value: STATUS.Rejected,
      },
      {
        text: msg().Att_Lbl_ReqStatCanceled,
        value: STATUS.Canceled,
      },
      {
        text: msg().Att_Lbl_ReqStatPending,
        value: STATUS.Pending,
      },
      {
        text: msg().Att_Lbl_ReqStatApproved,
        value: STATUS.Approved,
      },
    ];

    const statusLabel: { [Key in Status]?: string } = statusOptions.reduce(
      (obj, { text, value }) => {
        obj[value] = text;
        return obj;
      },
      {}
    );

    return (
      <div className={className}>
        <Grid
          idKey="employeeId"
          columns={[
            {
              name: `${msg().Team_Lbl_EmployeeName} / ${
                msg().Team_Lbl_EmployeeCode
              }`,
              key: ['photoUrl', 'employeeName', 'employeeCode'],
              extraProps: {
                keyMap: {
                  photoUrl: 'photoUrl',
                  employeeName: 'employeeName',
                  departmentName: 'employeeCode',
                },
              },
              shrink: true,
              grow: true,
              width: '30%',
              formatter: EmployeeFormatter,
              renderFilter: () => (
                <DoubleTextFilter
                  firstValue={filterTerms.employeeName}
                  secondValue={filterTerms.employeeCode}
                  onChangeFirstValue={bindOnUpdateFilterTermByKey(
                    'employeeName'
                  )}
                  onChangeSecondValue={bindOnUpdateFilterTermByKey(
                    'employeeCode'
                  )}
                />
              ),
            },
            {
              name: msg().Att_Lbl_WorkingType,
              key: 'workingTypeName',
              width: '20%',
              shrink: true,
              grow: true,
              renderFilter: () => (
                <SelectFilter
                  value={filterTerms.workingTypeName}
                  options={props.workingTypeNameOptions}
                  onChange={bindOnUpdateFilterTermByKey('workingTypeName')}
                />
              ),
            },
            {
              name: msg().Att_Lbl_ClosingDate,
              key: 'endDate',
              width: '10%',
              shrink: true,
              grow: true,
              formatter: ({
                value,
              }: Readonly<{
                value: string;
              }>) => DateUtil.formatYMD(value),
              renderFilter: () => (
                <SelectFilter
                  value={filterTerms.endDate}
                  options={props.closingDateOptions}
                  onChange={bindOnUpdateFilterTermByKey('endDate')}
                />
              ),
            },
            {
              name: msg().Appr_Lbl_ApproverName,
              key: 'approverName',
              width: '20%',
              shrink: true,
              grow: true,
              renderFilter: () => (
                <TextFilter
                  value={filterTerms.approverName}
                  onChange={bindOnUpdateFilterTermByKey('approverName')}
                />
              ),
            },
            {
              name: msg().Att_Lbl_MonthlySummaryStatus,
              key: 'status',
              width: '10%',
              shrink: true,
              grow: true,
              formatter: ({
                value,
              }: Readonly<{
                value: Status;
              }>) => statusLabel[value],
              renderFilter: () => (
                <SelectFilter
                  value={filterTerms.status}
                  options={statusOptions}
                  onChange={bindOnUpdateFilterTermByKey('status')}
                />
              ),
            },
            {
              name: '',
              key: ['employeeId', 'startDate'],
              width: '10%',
              shrink: true,
              grow: true,
              formatter: ({
                value,
              }: Readonly<{
                value: {
                  employeeId: string;
                  startDate: string;
                };
              }>) => (
                <AccessControl
                  conditions={{
                    requireIfByEmployee: ['viewAttTimeSheetByDelegate'],
                  }}
                >
                  <Button
                    type="text"
                    onClick={() =>
                      props.onClickOpenTimesheetWindowButton({
                        empId: value.employeeId,
                        targetDate: value.startDate,
                      })
                    }
                  >
                    {msg().Team_Lbl_OpenTimesheet}
                  </Button>
                </AccessControl>
              ),
            },
          ]}
          data={props.records} // 選択表示は使用しません。
          selected={[]}
          browseId=""
          onClickRow={() => {}}
          onChangeRowSelection={() => {}}
          useFilter
          emptyMessage={msg().Team_Msg_EmptyEmployeeList}
        />
      </div>
    );
  }
}
