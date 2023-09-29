import { connect } from 'react-redux';

import DateUtil from '../../commons/utils/DateUtil';

import {
  actions as expTypeLinkConfigActions,
  addSelectedExp,
  cancelSearch,
  openSearchDialog,
  searchExpense,
} from '../modules/expTypeLinkConfig/ui';

import ExpTypeLinkConfigItem from '../components/ExpenseTypeLinkConfig/ExpTypeLinkConfigItem';

const mapStateToProps = (state, ownProps) => ({
  selectedExpense: state.expTypeLinkConfig.ui.selectedExpense,
  isDialogOpen: state.expTypeLinkConfig.ui.isDialogOpen,
  isSelectedEmpty: state.expTypeLinkConfig.ui.selectedExpense.length === 0,
  searchExpenseType: state.searchExpenseType,
  foundExpense: state.expTypeLinkConfig.ui.foundExpense,
  disabled: ownProps.disabled,
  companyId: state.base.menuPane.ui.targetCompanyId,
  isAddButtonDisabled:
    state.expTypeLinkConfig.ui.foundExpense.filter((exp) => exp.isSelected)
      .length === 0,
  config: ownProps.config,
  selectedId: state.expenseType.ui.detail.baseRecord.id,
  selectedForeignCurrencyUsage:
    state.expenseType.ui.detail.baseRecord.foreignCurrencyUsage,
  selectedFixedForeignCurrencyId:
    state.expenseType.ui.detail.baseRecord.fixedForeignCurrencyId,
});

const mapDispatchToProps = {
  toggleSelection: expTypeLinkConfigActions.toggleSelection,
  openSelection: openSearchDialog,
  addSelectedExp,
  cancelSelection: cancelSearch,
  search: searchExpense,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  addSelectedExp: () => dispatchProps.addSelectedExp(stateProps.foundExpense),
  // if it's exp to exp config, only General recordType expsense type are avialable to link
  search: (query) => {
    const isExpenseToExpenseLink =
      stateProps.config.key === 'expenseToExpenseConfig';
    const recordType = isExpenseToExpenseLink ? 'General' : '';
    dispatchProps.search(
      {
        ...query,
        targetDate: DateUtil.getToday(),
        companyId: stateProps.companyId,
        recordType,
        foreignCurrencyUsage: isExpenseToExpenseLink
          ? stateProps.selectedForeignCurrencyUsage
          : undefined,
        fixedForeignCurrencyId: isExpenseToExpenseLink
          ? stateProps.selectedFixedForeignCurrencyId
          : undefined,
        limitNumber: 5000,
      },
      stateProps.selectedExpense
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpTypeLinkConfigItem);
