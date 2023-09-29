import { connect } from 'react-redux';

import { cloneDeep, isEmpty } from 'lodash';

import { actions as amountListActions } from '../modules/fixedAllowanceList';

import * as expenseTypeDetailActions from '../action-dispatchers/expense-type/Detail';

import AmountList from '../components/AmountList';

const mapStateToProps = (state, ownProps) => ({
  baseCurrencyDecimal: state.common.userSetting.currencyDecimalPlaces,
  currencySet: state.searchCurrency,
  disabled: ownProps.disabled,
  editRecord: state.expenseType.entities.baseRecord,
  fixedAllowanceList: state.fixedAllowanceList,
  languageSet: state.getOrganizationSetting,
  tmpEditRecord: state.expenseType.ui.detail.baseRecord,
  saveError: state.common.app.error,
  sfObjFieldValues: state.sfObjFieldValues,
  configKey: ownProps.config.key,
  modeBase: state.detailPane.ui.modeBase,
});

const mapDispatchToProps = (dispatch) => ({
  addRow: (rows) => dispatch(amountListActions.add(rows)),
  onReset: (rows) => dispatch(amountListActions.reset(rows)),
  onValidate: (rows) => dispatch(amountListActions.validate(rows)),
  removeRow: (index, rows) => dispatch(amountListActions.remove(index, rows)),
  update: (idx, key, value, rows) =>
    dispatch(amountListActions.update(idx, key, value, rows)),
  onChangeDetailItem: (key, value) =>
    dispatch(expenseTypeDetailActions.changeBaseRecordValue(key, value)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickAddRow: () => {
    const currentRows = stateProps.fixedAllowanceList;
    dispatchProps.onChangeDetailItem(stateProps.configKey, [
      ...currentRows,
      {
        id: null,
        label: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        label_L0: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        label_L1: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        label_L2: '',
        allowanceAmount: 0,
      },
    ]);
    dispatchProps.addRow(currentRows);
  },
  onClickRemoveRow: (index) => {
    const currentRows = cloneDeep(stateProps.fixedAllowanceList);
    const remainRows = currentRows.filter((items, idx) => idx !== index);
    dispatchProps.onChangeDetailItem(stateProps.configKey, remainRows);
    dispatchProps.removeRow(index, stateProps.fixedAllowanceList);
  },
  onChange: (idx, key, value) => {
    dispatchProps.update(idx, key, value, stateProps.fixedAllowanceList);
  },
  onChangeDetailItem: (isReset = false) =>
    dispatchProps.onChangeDetailItem(
      stateProps.configKey,
      isReset ? null : stateProps.fixedAllowanceList
    ),
  onValidate: () => dispatchProps.onValidate(stateProps.fixedAllowanceList),
  convertDecimal: () => {
    const foreignCurrencyId =
      stateProps.tmpEditRecord.foreignCurrencyUsage !== 'NOT_USED' &&
      stateProps.tmpEditRecord.fixedForeignCurrencyId;
    let decimalPlace = stateProps.baseCurrencyDecimal;
    const targetForeignCurrency = stateProps.currencySet.find(
      (item) => item.id === foreignCurrencyId
    );
    if (!isEmpty(targetForeignCurrency)) {
      decimalPlace = targetForeignCurrency.decimalPlaces;
    }
    const currentRows = stateProps.fixedAllowanceList;
    const convertedRows = [];
    currentRows.forEach((item) => {
      const convertRow = cloneDeep(item);
      const decimals = 10 ** decimalPlace;
      convertRow.allowanceAmount =
        Math.floor(item.allowanceAmount * decimals) / decimals;
      convertedRows.push(convertRow);
    });
    dispatchProps.onChangeDetailItem(stateProps.configKey, convertedRows);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AmountList);
