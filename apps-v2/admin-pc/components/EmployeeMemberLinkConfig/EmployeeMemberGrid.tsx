import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import { EmployeeMember } from '../../modules/employeeMemberLinkConfig/ui';

import DataGrid from '../DataGrid';

import './EmployeeMemberGrid.scss';

const ROOT = 'admin-pc-detail-pane-employee-member-grid';

type Props = {
  selectedId: string;
  cleanSelectedEmployeeMember: () => void;
  selectedEmployeeMember: Array<EmployeeMember>;
  remove: () => void;
  resetToEditRecord: () => void;
  toggleSelectedEmployeeMember: (arg0: EmployeeMember) => void;
  getMember: (memberId: string) => void;
  isDisabled: boolean;
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: any) => void;
  isRemoveButtonDisabled: boolean;
};

export default class EmployeeMemberGrid extends React.Component<Props> {
  componentDidMount() {
    const { selectedId, getMember } = this.props;
    if (selectedId) {
      getMember(selectedId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      selectedId,
      isDisabled,
      selectedEmployeeMember,
      onChangeDetailItem,
      config,
      getMember,
    } = this.props;

    // selectedID = groupID
    // isSelectedIdChanged = when you click on another record/group
    const isSelectedIdChanged = prevProps.selectedId !== selectedId;
    const isSelectedEmployeeMemberChanged =
      prevProps.selectedEmployeeMember.length !== selectedEmployeeMember.length;
    const isDisabledChanged = prevProps.isDisabled !== isDisabled;

    // if you select another record with a group id,
    // call psa/group/get to get the group details
    if (isSelectedIdChanged) {
      this.props.cleanSelectedEmployeeMember();
      if (selectedId) {
        getMember(selectedId);
      }
    }

    // If you add/remove member,
    // update tmpEditRecord with the new members
    if (isSelectedEmployeeMemberChanged) {
      onChangeDetailItem(config.key, selectedEmployeeMember);
    }

    // when cancel current operation, reset to original data
    if (isDisabled && isDisabledChanged) {
      if (!isSelectedIdChanged) {
        this.props.resetToEditRecord();
      }
    }
  }

  componentWillUnmount() {
    this.props.cleanSelectedEmployeeMember();
  }

  handleRowClick = (rowIdx: number, row: EmployeeMember) =>
    this.props.toggleSelectedEmployeeMember(row);

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) =>
      this.props.toggleSelectedEmployeeMember(row)
    );
  };

  render() {
    let rootClassName = ROOT;

    if (this.props.isDisabled) {
      rootClassName += ` ${ROOT}__dataGrid-disabled`;
    }

    return (
      <div className={rootClassName}>
        {this.props.selectedEmployeeMember.length !== 0 && (
          <DataGrid
            key={this.props.selectedEmployeeMember.length}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'employeeCode',
                name: msg().Com_Lbl_EmployeeCode,
                filterable: true,
              },
              {
                key: 'employeeName',
                name: msg().Com_Lbl_EmployeeName,
                filterable: true,
              },
              {
                key: 'departmentName',
                name: msg().Com_Lbl_DepartmentName,
                filterable: true,
              },
              {
                key: 'employeeTitle',
                name: msg().Com_Lbl_Title,
                filterable: true,
              },
            ]}
            showCheckbox
            rows={this.props.selectedEmployeeMember}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
            disabled={this.props.isDisabled}
          />
        )}
        {this.props.selectedEmployeeMember.length !== 0 && (
          <Button
            type="destructive"
            className={`${ROOT}__editAction ${ROOT}__removeButton`}
            onClick={this.props.remove}
            disabled={this.props.isRemoveButtonDisabled}
          >
            {msg().Com_Btn_Remove}
          </Button>
        )}
      </div>
    );
  }
}
