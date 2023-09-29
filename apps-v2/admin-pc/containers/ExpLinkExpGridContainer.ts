import { connect } from 'react-redux';

import _ from 'lodash';

import { actions as expenseTypeDetailActions } from '../modules/expense-type/ui/detail';
import {
  actions as expTypeLinkConfigActions,
  setSelectedExp,
} from '../modules/expTypeLinkConfig/ui';

import ExpenseTypeGrid from '../components/ExpenseTypeLinkConfig/ExpenseTypeGrid';

const mapStateToProps = (state, ownProps) => ({
  selectedExpense: state.expTypeLinkConfig.ui.selectedExpense,
  disabled: ownProps.disabled,
  config: ownProps.config,
  selectedId: state.expenseType.ui.detail.baseRecord.id,
  expTypeChildIds: state.expenseType.ui.detail.baseRecord.expTypeChildIds,
  expenseTypes: state.searchExpenseType,
  mode: state.base.detailPane.ui.modeBase,
});

const mapDispatchToProps = {
  toggleSelectedExp: expTypeLinkConfigActions.toggleSelectedExp,
  setSelectedExp,
  cleanSelectedExpense: expTypeLinkConfigActions.cleanSelectedExpense,
  changeRecordValue: expenseTypeDetailActions.setBaseRecordByKeyValue,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, value) => {
    dispatchProps.changeRecordValue(key, value);
  },
  setSelectedExp: (selectedId) => {
    const expenseType = _.get(stateProps.expenseTypes, 'records', []);
    if (selectedId && !_.isEmpty(expenseType)) {
      const expTypeChildIds = stateProps.expTypeChildIds || [];
      dispatchProps.setSelectedExp(expTypeChildIds, expenseType);
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpenseTypeGrid);
