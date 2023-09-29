import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import { EmployeeMember } from '../../modules/employeeMemberLinkConfig/ui';

import DataGrid from '../DataGrid';
import EmployeeMemberSearchForm from './EmployeeMemberSearchForm';

import './EmployeeMemberSearchDialog.scss';

const ROOT = 'admin-pc-employee-member-search-dialog';

export type Props = {
  foundEmployeeMember: Array<EmployeeMember>;
  isAddButtonDisabled: boolean;
  isSingleSelection?: boolean;
  hasSearch?: boolean;
  dialogTitle: string;
  cancelSelection: () => void;
  addSelectedEmployeeMember: () => void;
  toggleSelection: (arg0: EmployeeMember) => void;
  search: () => void;
};

export default class EmployeeMemberSearchDialog extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.hasSearch) {
      this.props.search();
    }
  }

  handleRowClick = (rowIdx: number, row: EmployeeMember) =>
    this.props.toggleSelection(row);

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) => this.props.toggleSelection(row));
  };

  render() {
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg()[this.props.dialogTitle]}
        hide={this.props.cancelSelection}
        footer={
          <DialogFrame.Footer>
            <Button
              className={`${ROOT}__button`}
              onClick={this.props.cancelSelection}
            >
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              className={`${ROOT}__button ${ROOT}__add-button`}
              disabled={this.props.isAddButtonDisabled}
              onClick={this.props.addSelectedEmployeeMember}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
          {this.props.hasSearch && (
            <EmployeeMemberSearchForm search={this.props.search} />
          )}
          <DataGrid
            rowHeight={44}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'employeeCode',
                name: msg().Com_Lbl_EmployeeCode,
              },
              {
                key: 'employeeName',
                name: msg().Com_Lbl_EmployeeName,
              },
              {
                key: 'departmentName',
                name: msg().Com_Lbl_DepartmentName,
              },
              {
                key: 'employeeTitle',
                name: msg().Com_Lbl_Title,
              },
            ]}
            showCheckbox={!this.props.isSingleSelection}
            rows={this.props.foundEmployeeMember}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
          />
        </div>
      </DialogFrame>
    );
  }
}
