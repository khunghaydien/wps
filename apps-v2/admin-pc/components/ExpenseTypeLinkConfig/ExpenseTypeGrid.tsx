import React from 'react';

import msg from '../../../commons/languages';

import { ITEMIZATION_SETTING_TYPE } from '@apps/domain/models/exp/Record';

import { Expense } from '../../modules/expTypeLinkConfig/ui';

import DataGrid from '../DataGrid';

import './ExpenseTypeGrid.scss';

const ROOT = 'admin-pc-detail-pane-expense-type-grid';

type Props = {
  selectedId: string;
  selectedExpense: Array<Expense>;
  toggleSelectedExp: (arg0: Expense) => void;
  setSelectedExp: (selectedId: string) => void;
  cleanSelectedExpense: () => void;
  disabled: boolean;
  config: Record<string, any>;
  mode: string;
  onChangeDetailItem: (
    key: string,
    value: Array<string> | string | boolean
  ) => void;
  isRemoveButtonDisabled: boolean;
};

export default class ExpenseTypeGrid extends React.Component<Props> {
  componentDidUpdate(preProps: Props) {
    const {
      selectedId,
      disabled,
      selectedExpense,
      onChangeDetailItem,
      config,
      setSelectedExp,
    } = this.props;

    const ids = selectedExpense.map((exp) => exp.id);
    const isSelectedIdChanged = preProps.selectedId !== selectedId;
    const isSelectedExpenseChanged =
      preProps.selectedExpense.length !== selectedExpense.length;
    const isDisabledChanged = preProps.disabled !== disabled;

    const isClone = this.props.mode === 'clone' && preProps.mode === '';

    const isClickedNewAfterClone =
      this.props.mode === 'new' && preProps.mode === 'clone';

    if (isSelectedIdChanged || isClickedNewAfterClone) {
      setSelectedExp(selectedId);
    }
    if (isClone) {
      setSelectedExp(preProps.selectedId);
    }
    if (isSelectedIdChanged || isSelectedExpenseChanged) {
      onChangeDetailItem(config.key, ids);
    }
    // when cancel current operation, reset to original data
    if (disabled && isDisabledChanged) {
      setSelectedExp(selectedId);
    }
  }

  componentWillUnmount() {
    const { cleanSelectedExpense, onChangeDetailItem, config } = this.props;
    cleanSelectedExpense();
    onChangeDetailItem(config.key, []);
    onChangeDetailItem('itemizationSetting', ITEMIZATION_SETTING_TYPE.NotUsed);
  }

  handleRowClick = (rowIdx: number, row: Expense) =>
    this.props.toggleSelectedExp(row);

  handleRowsToggle = (rows: Array<Record<string, any>>) => {
    return rows.forEach(({ row }) => this.props.toggleSelectedExp(row));
  };

  render() {
    let rootClassName = ROOT;
    if (this.props.disabled) {
      rootClassName += ` ${ROOT}__dataGrid-disabled`;
    }

    return (
      <div className={rootClassName}>
        <DataGrid
          key={this.props.selectedExpense.length}
          numberOfRowsVisibleWithoutScrolling={5}
          columns={[
            {
              key: 'expenseTypeCode',
              name: msg().Admin_Lbl_ExpenseTypeCode,
              filterable: true,
            },
            {
              key: 'expenseTypeName',
              name: msg().Admin_Lbl_ExpenseTypeName,
              filterable: true,
            },
            {
              key: 'expenseGroupCode',
              name: msg().Admin_Lbl_ExpenseTypeGroupCode,
              filterable: true,
            },
            {
              key: 'expenseGroupName',
              name: msg().Admin_Lbl_ExpenseTypeGroupName,
              filterable: true,
            },
          ]}
          showCheckbox
          rows={this.props.selectedExpense}
          onRowClick={this.handleRowClick}
          onRowsSelected={this.handleRowsToggle}
          onRowsDeselected={this.handleRowsToggle}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
