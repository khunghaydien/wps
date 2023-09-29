import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import { Expense } from '../../modules/expTypeLinkConfig/ui';

import ExpenseSearchDialog, {
  Props as SearchDialogProps,
} from './ExpenseSearchDialog';

import './ExpTypeLinkConfigItem.scss';

const ROOT = 'admin-pc-expense-type-link-config';

type Props = SearchDialogProps & {
  disabled: boolean;
  isDialogOpen: boolean;
  isSelectedEmpty: boolean;
  selectedExpense: Expense[];
  openSelection: () => void;
  remove: () => void;
};

export default class ExpTypeLinkConfigItem extends React.Component<Props> {
  render() {
    const hasNoSelectedExp =
      this.props.selectedExpense.filter((exp) => exp.isSelected).length === 0;
    return (
      <div className={ROOT}>
        {this.props.isSelectedEmpty && (
          <span className={`${ROOT}__text`}>
            {msg().Admin_Lbl_ExpenseNoItemInTheSet}
          </span>
        )}
        <div className={`${ROOT}__btn-group`}>
          <Button
            className={`${ROOT}__action-btn`}
            disabled={this.props.disabled || hasNoSelectedExp}
            type="destructive"
            onClick={this.props.remove}
          >
            {msg().Com_Btn_Remove}
          </Button>
          <Button
            type="secondary"
            className={`${ROOT}__action-btn`}
            onClick={this.props.openSelection}
            disabled={this.props.disabled}
          >
            {msg().Com_Btn_Add}
          </Button>
        </div>
        {this.props.isDialogOpen && (
          <ExpenseSearchDialog
            foundExpense={this.props.foundExpense}
            isAddButtonDisabled={this.props.isAddButtonDisabled}
            cancelSelection={this.props.cancelSelection}
            addSelectedExp={this.props.addSelectedExp}
            search={this.props.search}
            toggleSelection={this.props.toggleSelection}
          />
        )}
      </div>
    );
  }
}
