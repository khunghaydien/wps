import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import ExpenseSearchDialog, {
  Props as SearchDialogProps,
} from './ExpenseSearchDialog';

import './ExpTypeLinkConfigItem.scss';

const ROOT = 'admin-pc-expense-type-link-config';

type Props = SearchDialogProps & {
  disabled: boolean;
  isDialogOpen: boolean;
  isSelectedEmpty: boolean;
  openSelection: () => void;
};

export default class ExpTypeLinkConfigItem extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        {this.props.isSelectedEmpty && (
          <span className={`${ROOT}__text`}>
            {msg().Admin_Lbl_ExpenseNoItemInTheSet}
          </span>
        )}
        <Button
          type="secondary"
          className={`${ROOT}__editAction`}
          onClick={this.props.openSelection}
          disabled={this.props.disabled}
        >
          {msg().Admin_Lbl_AddExpenseType}
        </Button>
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
