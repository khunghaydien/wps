import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

import DataGrid from '../../components/DataGrid';
import isDateIncludedInValidDate from '../../components/DataGrid/filter-logics/isDateIncludedInValidDate';

import './JobAssignment.scss';

const ROOT = 'admin-pc-job-job-assignment';

type Row = { id: string };
type RowSelection = { row: Row };

const extractJobAssignmentIds = (rowSelectionList: RowSelection[]): string[] =>
  rowSelectionList.map((rowSelection) => rowSelection.row.id);

const formatPeriod = ({
  value,
}: {
  value: { from: string; through: string };
}) => {
  return [
    DateUtil.formatYMD(value.from),
    '-',
    DateUtil.formatYMD(value.through),
  ].join('');
};

export type JobAssignmentAsListItem = {
  id: string;
  employeeCode: string;
  employeeName: string;
  departmentCode: string;
  departmentName: string;
  validDate: {
    from: string;
    through: string;
  };
  isSelected: boolean;
};

type Props = {
  jobAssignmentList: JobAssignmentAsListItem[];
  canOperateAssignment: boolean;
  canExecModifyAssignment: boolean;
  openNewAssignment: () => void;
  openChangeValidPeriod: () => void;
  deleteAssignment: () => void;
  onAssignmentListRowsSelected: (arg0: string[]) => void;
  onAssignmentListRowsDeselected: (arg0: string[]) => void;
  onAssignmentListRowClick: (arg0: string) => void;
  onAssignmentListFilterChange: () => void;
};

export default class JobAssignment extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onRowsSelected(rowSelectionList: RowSelection[]) {
    this.props.onAssignmentListRowsSelected(
      extractJobAssignmentIds(rowSelectionList)
    );
  }

  onRowsDeselected(rowSelectionList: RowSelection[]) {
    this.props.onAssignmentListRowsDeselected(
      extractJobAssignmentIds(rowSelectionList)
    );
  }

  onRowClick(rowIndex: number, row: Row) {
    this.props.onAssignmentListRowClick(row.id);
  }

  onFilterChange() {
    this.props.onAssignmentListFilterChange();
  }

  renderActionButtons() {
    return (
      <div className={`${ROOT}__action-buttons`}>
        <Button
          type="secondary"
          disabled={!this.props.canOperateAssignment}
          onClick={this.props.openNewAssignment}
        >
          {msg().Com_Btn_New}
        </Button>

        <div className={`${ROOT}__modify-buttons`}>
          <Button
            type="destructive"
            disabled={
              !this.props.canOperateAssignment ||
              !this.props.canExecModifyAssignment
            }
            onClick={this.props.deleteAssignment}
          >
            {msg().Com_Btn_Remove}
          </Button>

          <Button
            type="default"
            disabled={
              !this.props.canOperateAssignment ||
              !this.props.canExecModifyAssignment
            }
            onClick={this.props.openChangeValidPeriod}
          >
            {msg().Admin_Lbl_ChangePeriod}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const filterable = this.props.canOperateAssignment;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>
          {msg().Admin_Lbl_EmployeeAssignments}
        </div>

        {this.renderActionButtons()}

        <div className={`${ROOT}__list`}>
          <DataGrid
            columns={[
              {
                key: 'employeeName',
                name: msg().Com_Lbl_EmployeeName,
                resizable: true,
                filterable,
              },
              {
                key: 'employeeCode',
                name: msg().Com_Lbl_EmployeeCode,
                resizable: true,
                filterable,
              },
              {
                key: 'departmentName',
                name: msg().Com_Lbl_DepartmentName,
                resizable: true,
                filterable,
              },
              {
                key: 'departmentCode',
                name: msg().Com_Lbl_DepartmentCode,
                resizable: true,
                filterable,
              },
              {
                key: 'validDate',
                name: msg().Admin_Lbl_Period,
                // @ts-ignore
                formatter: formatPeriod,
                filterable,
                filterValues: isDateIncludedInValidDate,
                width: 190,
              },
            ]}
            rows={this.props.jobAssignmentList}
            showCheckbox={this.props.canOperateAssignment}
            onRowsSelected={this.onRowsSelected}
            onRowsDeselected={this.onRowsDeselected}
            onRowClick={this.onRowClick}
            onFilterChange={this.onFilterChange}
          />
        </div>
      </div>
    );
  }
}
