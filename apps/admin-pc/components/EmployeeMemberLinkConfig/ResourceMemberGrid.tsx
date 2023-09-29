import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import ToastContainer from '../../../commons/containers/ToastContainer';
import msg from '../../../commons/languages';

import { EmployeeMember } from '../../modules/employeeMemberLinkConfig/ui';

import DataGrid from '../DataGrid';
import { Column } from '../DataGrid/DataGridColumn';

import './EmployeeMemberGrid.scss';

const ROOT = 'admin-pc-detail-pane-employee-member-grid';

type Props = {
  selectedId: string;
  cleanSelectedEmployeeMember: () => void;
  selectedEmployeeMember: Array<EmployeeMember>;
  remove: () => void;
  resetToEditRecord: () => void;
  setDefaultRM: () => void;
  showToast: () => void;
  toggleSelectedEmployeeMember: (arg0: EmployeeMember) => void;
  getMember: (memberId: string) => void;
  isDisabled: boolean;
  isSingleSelection?: boolean;
  hasDefaultRM?: boolean;
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: any) => void;
  isRemoveButtonDisabled: boolean;
};

// Need to pass in the svg markup directly because the check icon from commons/images/icons/check.svg does not display the viewBox property properly in SF.
const BooleanFormatter = ({ value }) => {
  return (
    value === 'Default' && (
      <svg viewBox="0 0 24 24" className={`${ROOT}__checked`}>
        <path
          d="M12 24a12 12 0 1112-12 12 12 0 01-12 12zM6.828 9.742L4 12.387 10 18l10-9.354L17.172 6 10 12.708z"
          fill="#000"
          fillRule="evenodd"
        />
      </svg>
    )
  );
};

export default class ResourceMemberGrid extends React.Component<Props> {
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

  setDefaultRM = () => {
    const { selectedEmployeeMember } = this.props;
    const selectedMember = selectedEmployeeMember.filter(
      (emp) => emp.isSelected
    );

    if (selectedMember.length === 1) {
      const result = selectedEmployeeMember.map((emp) => {
        return {
          ...emp,
          type: emp.isSelected ? 'Default' : 'Member',
        };
      });

      this.props.setDefaultRM();
      this.props.onChangeDetailItem(this.props.config.key, result);
    } else {
      this.props.showToast();
    }
  };

  render() {
    let rootClassName = ROOT;
    const { isSingleSelection } = this.props;
    const isFilterable = !isSingleSelection;

    if (this.props.isDisabled) {
      rootClassName += ` ${ROOT}__dataGrid-disabled`;
    }

    const columns: Column[] = [
      {
        key: 'employeeCode',
        name: msg().Admin_Lbl_Code,
        filterable: isFilterable,
      },
      {
        key: 'employeeName',
        name: msg().Admin_Lbl_Name,
        filterable: isFilterable,
      },
      {
        key: 'departmentName',
        name: msg().Admin_Lbl_DepartmentName,
        filterable: isFilterable,
      },
      {
        key: 'employeeTitle',
        name: msg().Admin_Lbl_Position,
        filterable: isFilterable,
      },
    ];

    if (this.props.hasDefaultRM) {
      columns.push({
        key: 'type',
        name: msg().Admin_Lbl_DefaultResourceManager,
        formatter: BooleanFormatter,
      });
    }

    return (
      <div className={rootClassName}>
        <ToastContainer />
        {this.props.selectedEmployeeMember.length !== 0 && (
          <DataGrid
            key={this.props.selectedEmployeeMember.length}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={columns}
            showCheckbox={!isSingleSelection}
            rows={this.props.selectedEmployeeMember}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
            disabled={this.props.isDisabled}
          />
        )}
        {this.props.selectedEmployeeMember.length !== 0 && !isSingleSelection && (
          <div className={`${ROOT}__btn-container`}>
            {this.props.hasDefaultRM && (
              <Button
                className={`${ROOT}__select-default-rm`}
                onClick={this.setDefaultRM}
                disabled={this.props.isRemoveButtonDisabled}
              >
                {msg().Admin_Lbl_SetDefaultRM}
              </Button>
            )}

            <Button
              type="destructive"
              className={`${ROOT}__editAction ${ROOT}__removeButton`}
              onClick={this.props.remove}
              disabled={this.props.isRemoveButtonDisabled}
            >
              {msg().Com_Btn_Remove}
            </Button>
          </div>
        )}
      </div>
    );
  }
}
