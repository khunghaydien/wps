import React from 'react';

import isEmpty from 'lodash/isEmpty';

import Button from '@commons/components/buttons/Button';
import DialogFrame from '@commons/components/dialogs/DialogFrame';
import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { CardAssign } from '@apps/domain/models/exp/CreditCard';
import { Employee } from '@apps/domain/models/organization/Employee';

import DataGrid from '@apps/admin-pc/components/DataGrid';
import SearchArea from '@apps/admin-pc/components/SearchArea';

import './index.scss';

const ROOT = 'admin-pc-credit-card-assign-employee-search-dialog';

export type SearchProps = {
  linkCreditCardAssignments: (arg0: Employee[]) => Promise<void>;
  maxNum: number;
  onClickSearchCreditCardAssignments: (
    code: string,
    name: string,
    departmentCode: string,
    departmentName: string,
    title: string
  ) => Promise<Employee[]>;
};

type Props = Readonly<
  SearchProps & {
    hideDialog: () => void;
    searchCreditCardAssign: CardAssign[];
  }
>;

type State = {
  searchResults: Employee[];
  selectedIds: string[];
};

export default class EmployeeSearchDialog extends React.Component<
  Props,
  State
> {
  state = {
    searchResults: [],
    selectedIds: [],
  };

  onClickSearchBtn = (query: {
    code: string;
    name: string;
    departmentCode: string;
    departmentName: string;
    title: string;
  }) => {
    this.props
      .onClickSearchCreditCardAssignments(
        query.code,
        query.name,
        query.departmentCode,
        query.departmentName,
        query.title
      )
      .then((records) => {
        this.setState({ searchResults: records, selectedIds: [] });
      });
  };

  toggleSelection = (ids: string[]) => {
    this.setState((prevState) => {
      const selectedIds = [...prevState.selectedIds];
      ids.forEach((id) => {
        const index = selectedIds.indexOf(id);
        if (index === -1) {
          selectedIds.push(id);
        } else {
          selectedIds.splice(index, 1);
        }
      });
      return { selectedIds };
    });
  };

  handleRowClick = (rowIdx: number, row: Employee) => {
    if (row) {
      this.toggleSelection([row.id]);
    }
  };

  handleRowsToggle = (rows: Array<{ row: Employee }>) => {
    const ids = rows.map((info) => info.row.id);
    this.toggleSelection(ids);
  };

  linkCreditCardAssignments = () => {
    const list = this.state.searchResults.filter((item) =>
      this.state.selectedIds.includes(item.id)
    );
    this.props.linkCreditCardAssignments(list);
  };

  render() {
    const excludedIds = this.props.searchCreditCardAssign.map((item) => {
      return item.employeeBaseId;
    });
    let rows = this.state.searchResults.filter((row) => {
      return !excludedIds.includes(row.id);
    });
    rows = rows.map((row) => {
      const isSelected = this.state.selectedIds.includes(row.id);
      const departmentCode = row.department.code;
      const departmentName = row.department.name;
      return { ...row, isSelected, departmentCode, departmentName };
    });

    rows = rows.slice(0, this.props.maxNum);

    const isExceeded = this.state.searchResults.length > this.props.maxNum;

    return (
      <DialogFrame
        className={ROOT}
        title={msg().Exp_Lbl_SearchConditionPlaceholderEmployee}
        hide={this.props.hideDialog}
        footer={
          <DialogFrame.Footer>
            <Button
              className={`${ROOT}__button`}
              onClick={this.props.hideDialog}
            >
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              className={`${ROOT}__button ${ROOT}__add-button`}
              disabled={isEmpty(this.state.selectedIds)}
              onClick={this.linkCreditCardAssignments}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
          <SearchArea
            fields={[
              'code',
              'name',
              'departmentCode',
              'departmentName',
              'title',
            ]}
            onClickSearchBtn={this.onClickSearchBtn}
          />
          <DataGrid
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'code',
                name: msg().Exp_Lbl_EmployeeCodeFull,
              },
              {
                key: 'name',
                name: msg().Exp_Lbl_EmployeeName,
              },
              {
                key: 'departmentCode',
                name: msg().Exp_Lbl_DepartmentCode,
              },
              {
                key: 'departmentName',
                name: msg().Exp_Lbl_DepartmentName,
              },
              {
                key: 'title',
                name: msg().Exp_Lbl_Position,
              },
            ]}
            showCheckbox
            rows={rows}
            onRowClick={this.handleRowClick}
            onRowsSelected={this.handleRowsToggle}
            onRowsDeselected={this.handleRowsToggle}
          />
          {isExceeded && (
            <div className={`${ROOT}__too-many-results`}>
              {TextUtil.template(
                msg().Com_Lbl_SearchResultsExceededLimit,
                this.props.maxNum
              )}
            </div>
          )}
        </div>
      </DialogFrame>
    );
  }
}
