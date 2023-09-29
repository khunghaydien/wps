import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import { Expense } from '../../modules/expTypeLinkConfig/ui';

import DataGrid from '../DataGrid';
import ExpenseSearchForm, {
  Props as SearchFormProps,
} from './ExpenseSearchForm';

import './ExpenseSearchDialog.scss';

const ROOT = 'admin-pc-expense-type-search-dialog';

export type Props = Readonly<
  SearchFormProps & {
    foundExpense: Array<Expense>;
    isAddButtonDisabled: boolean;
    cancelSelection: () => void;
    addSelectedExp: () => void;
    toggleSelection: (arg0: Expense) => void;
  }
>;

export default class ExpenseSearchDialog extends React.Component<Props> {
  handleRowClick = (rowIdx: number, row: Expense) =>
    this.props.toggleSelection(row);

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) => this.props.toggleSelection(row));
  };

  render() {
    const MAX_NUM = 100;
    const rows = this.props.foundExpense.slice(0, MAX_NUM);
    const isExceeded = this.props.foundExpense.length > MAX_NUM;
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg().Admin_Lbl_ExpenseSearch}
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
              onClick={this.props.addSelectedExp}
            >
              {msg().Com_Btn_Add}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body ${ROOT}__list--search-result`}>
          <ExpenseSearchForm search={this.props.search} />
          <DataGrid
            rowHeight={44}
            numberOfRowsVisibleWithoutScrolling={5}
            columns={[
              {
                key: 'expenseTypeCode',
                name: msg().Admin_Lbl_ExpenseTypeCode,
              },
              {
                key: 'expenseTypeName',
                name: msg().Admin_Lbl_ExpenseTypeName,
              },
              {
                key: 'expenseGroupCode',
                name: msg().Admin_Lbl_ExpenseTypeGroupCode,
              },
              {
                key: 'expenseGroupName',
                name: msg().Admin_Lbl_ExpenseTypeGroupName,
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
                MAX_NUM
              )}
            </div>
          )}
        </div>
      </DialogFrame>
    );
  }
}
