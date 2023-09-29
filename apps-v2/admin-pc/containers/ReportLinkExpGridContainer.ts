import { connect } from 'react-redux';

import _ from 'lodash';

import {
  actions as expTypeLinkConfigActions,
  setSelectedExp,
} from '../modules/expTypeLinkConfig/ui';

import { changeRecordValue } from '../action-dispatchers/Edit';

import ExpenseTypeGrid from '../components/ExpenseTypeLinkConfig/ExpenseTypeGrid';

const mapStateToProps = (state, ownProps) => ({
  selectedExpense: state.expTypeLinkConfig.ui.selectedExpense,
  mode: state.base.detailPane.ui.modeBase,
  disabled: ownProps.disabled,
  config: ownProps.config,
  selectedId: state.tmpEditRecord.id,
  expTypeIds: state.tmpEditRecord.expTypeIds,
  reportTypes: state.searchReportType,
  expenseTypes: state.searchExpenseType,
  isRemoveButtonDisabled:
    ownProps.disabled ||
    state.expTypeLinkConfig.ui.selectedExpense.filter((exp) => exp.isSelected)
      .length === 0,
});

const mapDispatchToProps = {
  toggleSelectedExp: expTypeLinkConfigActions.toggleSelectedExp,
  setSelectedExp,
  cleanSelectedExpense: expTypeLinkConfigActions.cleanSelectedExpense,
  changeRecordValue,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, value, charType) =>
    dispatchProps.changeRecordValue(key, value, charType),
  setSelectedExp: (selectedId) => {
    const expenseType = _.get(stateProps.expenseTypes, 'records', []);
    if (selectedId && !_.isEmpty(expenseType)) {
      const expTypeIds = stateProps.expTypeIds || [];
      dispatchProps.setSelectedExp(expTypeIds, expenseType);
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpenseTypeGrid);
