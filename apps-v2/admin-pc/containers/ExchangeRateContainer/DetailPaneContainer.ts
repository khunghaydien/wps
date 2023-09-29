import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { catchBusinessError } from '../../../commons/actions/app';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import { ExchangeRate } from '../../models/exchange-rate/ExchangeRate';

import {
  actions as exchangeRateUIActions,
  selectors as exchangeRateUISelectors,
} from '../../modules/exchangeRate/ui/editingExchangeRate';

import DetailPane from '../../presentational-components/ExchangeRate/DetailPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  companyList: state.searchCompany,
  editingRecord:
    state.exchangeRate.ui.editingExchangeRate.editingRecord ||
    exchangeRateUISelectors.selectedExchangeRate(state),
  mode: state.base.detailPane.ui.modeBase,
  sfObjFieldValues: state.sfObjFieldValues,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onClickCloneButton: exchangeRateUIActions.startEditingClone,
      onClickClosePane: exchangeRateUIActions.deselect,
      onClickSaveButton: exchangeRateUIActions.save,
      onClickEditDetailButton: exchangeRateUIActions.startEditing,
      onClickCancelEditButton: exchangeRateUIActions.cancelEditing,
      onClickUpdateButton: exchangeRateUIActions.save,
      onClickDeleteButton: exchangeRateUIActions.confirmAndDelete,
      onUpdateDetailItemValue: exchangeRateUIActions.update,
    },
    dispatch
  ),
  clearCurrencyInfo: (editingRecord) => {
    editingRecord.currencyName = '';
    editingRecord.currencyCode = '';
    editingRecord.currencyPair = '';
    editingRecord.currencyPairLabel = '';
  },

  setCurrencyInfo: (editingRecord, sfObjFieldValues) => {
    const currencyInfo = _.filter(sfObjFieldValues.currencyId, {
      id: editingRecord.currencyId,
    })[0];
    editingRecord.currencyName = currencyInfo.name;
    editingRecord.currencyCode = currencyInfo.isoCurrencyCode;
  },
  setCurrencyPair: (editingRecord, sfObjFieldValues) => {
    const currencyCode = editingRecord.currencyCode;
    const baseCurrencyCode = editingRecord.baseCurrencyCode;

    const currencyPair = sfObjFieldValues.currencyPair.filter((pair) => {
      const curA = pair.value.substr(0, 3);
      const curB = pair.value.substr(4, 3);
      if (
        (curA === currencyCode && curB === baseCurrencyCode) ||
        (curA === baseCurrencyCode && curB === currencyCode)
      ) {
        return pair;
      }

      return null;
    })[0];

    if (!currencyPair) {
      dispatch(
        catchBusinessError(
          msg().Admin_Lbl_ValidationCheck,
          TextUtil.template(
            msg().Com_Err_NotFound,
            msg().Admin_Lbl_CurrencyPair
          ),
          msg().Exp_Msg_Inquire
        )
      );
      return;
    }
    editingRecord.currencyPair = currencyPair.value;
    editingRecord.currencyPairLabel = currencyPair.label;
  },
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickSaveButton: () =>
    dispatchProps.onClickSaveButton(stateProps.editingRecord),
  onClickEditDetailButton: () =>
    dispatchProps.onClickEditDetailButton(stateProps.editingRecord),
  onClickUpdateButton: () =>
    dispatchProps.onClickUpdateButton(stateProps.editingRecord),
  onClickDeleteButton: () => {
    dispatchProps.onClickDeleteButton(stateProps.editingRecord);
  },
  clearCurrencyInfo: (editingRecord: ExchangeRate) => {
    dispatchProps.clearCurrencyInfo(editingRecord);
  },
  setCurrencyInfo: (editingRecord: ExchangeRate) => {
    dispatchProps.setCurrencyInfo(editingRecord, stateProps.sfObjFieldValues);
  },
  setCurrencyPair: (editingRecord: ExchangeRate) => {
    dispatchProps.setCurrencyPair(editingRecord, stateProps.sfObjFieldValues);
  },
  onClickCloneButton: () => {
    dispatchProps.onClickCloneButton(stateProps.editingRecord);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane) as React.ComponentType<Record<string, any>>;
