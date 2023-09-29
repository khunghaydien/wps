import React from 'react';

import { isEmpty } from 'lodash';

import Button from '@commons/components/buttons/Button';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import { CardAssign, CardInfo } from '@apps/domain/models/exp/CreditCard';
import { Employee } from '@apps/domain/models/organization/Employee';

import DataGrid from '@apps/admin-pc/components/DataGrid';

import EmployeeSearchDialog, {
  SearchProps as CreditCardAssignSearchProps,
} from './EmployeeSearchDialog';

import './index.scss';

const ROOT = 'admin-pc-credit-card-assign-area';

type State = {
  isDialogOpen: boolean;
  selectedIds: string[];
};

export type Props = CreditCardAssignSearchProps & {
  actions: {
    search: (arg0: { creditCardInformationId: string }) => void;
    create: (arg0: CardAssign) => void;
    update: (arg0: { id: string }) => void;
    delete: (arg0: { ids: string[] }) => void;
    searchEmployee: () => void;
  };
  searchCreditCardAssign: Array<CardAssign>;
  searchEmployee: Array<Employee>;
  unlinkCreditCardAssignments: (ids: string[]) => Promise<void>;
  tmpEditRecord: CardInfo;
  changeCardholder: (ids: string[]) => Promise<void>;
};

const CardholderFlagFormatter = ({ value }: { value: boolean }) => {
  if (value) {
    return <>◯</>;
  } else {
    return null;
  }
};

export default class CreditCardAssignArea extends React.Component<
  Props,
  State
> {
  // eslint-disable-next-line react/sort-comp
  state = {
    isDialogOpen: false,
    selectedIds: [],
  };

  onFilterChange = () => {
    this.setState({ selectedIds: [] });
  };

  // eslint-disable-next-line react/sort-comp
  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  hideDialog = () => {
    this.setState({ isDialogOpen: false });
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

  handleRowClick = (rowIds: number, row: CardAssign) => {
    if (row && row.id) {
      this.toggleSelection([row.id]);
    }
  };

  handleRowsToggle = (rows: Array<{ row: CardAssign }>) => {
    const ids = rows.map((info) => info.row.id);
    this.toggleSelection(ids);
  };

  handleLink = async (list: Employee[]) => {
    this.props.linkCreditCardAssignments(list);
    this.setState({ isDialogOpen: false });
  };

  handleUnlink = () => {
    this.props.unlinkCreditCardAssignments(this.state.selectedIds);
    this.setState({ selectedIds: [] });
  };

  handleCardhodler = () => {
    this.props.changeCardholder(this.state.selectedIds);
    this.setState({ selectedIds: [] });
  };

  render() {
    const addBtn = (
      <Button
        type="secondary"
        className={`${ROOT}__new`}
        onClick={this.openDialog}
        disabled={false}
      >
        {msg().Admin_Lbl_AddEmployee}
      </Button>
    );

    const holderBtn = (
      <Button
        type="secondary"
        className={`${ROOT}__holder`}
        onClick={this.handleCardhodler}
        disabled={isEmpty(this.state.selectedIds)}
      >
        {msg().Admin_Lbl_CardholderAssign}
      </Button>
    );

    const deleteBtn = (
      <Button
        type="destructive"
        disabled={isEmpty(this.state.selectedIds)}
        className={`${ROOT}__delete`}
        onClick={this.handleUnlink}
      >
        {msg().Com_Btn_Remove}
      </Button>
    );
    const rows = this.props.searchCreditCardAssign.map((row) => {
      const isSelected = this.state.selectedIds.includes(row.id);
      return { ...row, isSelected };
    });

    const table = (
      <DataGrid
        numberOfRowsVisibleWithoutScrolling={5}
        columns={[
          {
            key: 'employeeCode',
            name: msg().Exp_Lbl_EmployeeCodeFull,
            filterable: true,
          },
          {
            key: 'employeeName',
            name: msg().Exp_Lbl_EmployeeName,
            filterable: true,
          },
          {
            key: 'cardholderFlag',
            name: (
              <div className={`${ROOT}__tooltip`}>
                <div>{msg().Admin_Lbl_Cardholder}</div>
                <Tooltip
                  align="top right"
                  content={msg().Admin_Lbl_CardholderHelp}
                  className={`${ROOT}__icon_help`}
                >
                  <div aria-label={msg().Admin_Lbl_CardholderHelp}>&nbsp;</div>
                </Tooltip>
              </div>
            ),
            filterable: false,
            formatter: CardholderFlagFormatter,
          },
        ]}
        showCheckbox
        rows={rows}
        onRowClick={this.handleRowClick}
        onRowsSelected={this.handleRowsToggle}
        onRowsDeselected={this.handleRowsToggle}
        disabled={false}
        onFilterChange={this.onFilterChange}
      />
    );

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__title`}>{msg().Admin_Lbl_CardAssignment}</div>
        {addBtn}
        {deleteBtn}
        {holderBtn}
        {table}
        {this.state.isDialogOpen && (
          <EmployeeSearchDialog
            maxNum={this.props.maxNum}
            hideDialog={this.hideDialog}
            searchCreditCardAssign={this.props.searchCreditCardAssign}
            linkCreditCardAssignments={this.handleLink}
            onClickSearchCreditCardAssignments={
              this.props.onClickSearchCreditCardAssignments
            }
          />
        )}
      </div>
    );
  }
}
