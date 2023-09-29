import { connect } from 'react-redux';

import { assign, find, get } from 'lodash';

import { confirm } from '../../../commons/actions/app';
import BaseCurrencyView from '../../../commons/components/exp/Form/RecordItem/General/BaseCurrency';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';

import {
  isFixedAllowanceMulti,
  RECORD_TYPE,
} from '../../../domain/models/exp/Record';
// calulating function for tax
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calcTaxFromGstVat,
  calculateTax,
  TaxRes,
} from '../../../domain/models/exp/TaxType';
import { mergeValues } from '../../models/expenses/ExpensesRequestForm';

import { actions as recordPanelLoadingActions } from '../../modules/ui/expenses/recordItemPane/isLoading';

import { searchTaxTypeList } from '../../action-dispatchers/Currency';

const mapStateToProps = (state, ownProps) => ({
  tax: state.ui.expenses.recordItemPane.tax,
  allowTaxAmountChange: state.userSetting.allowTaxAmountChange,
  allowTaxExcludedAmount: state.userSetting.allowTaxExcludedAmountInput,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  onChangeEditingExpReport: (key, value) => {
    ownProps.onChangeEditingExpReport(`report.${key}`, value);
  },
  isLoading: appSelectors.loadingSelector(state),
  loadingAreas: state.common.app.loadingAreas,
});

const mapDispatchToProps = {
  toggleRecordLoading: recordPanelLoadingActions.toggle,
  searchTaxTypeList,
  confirm,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  searchTaxTypeList: (loadInBackground) => {
    const target = ownProps.expRecord.items[0];
    const expTypeId = target.expTypeId;
    const recordDate = ownProps.expRecord.recordDate;
    if (expTypeId) {
      const taxTypeList = get(stateProps.tax, `${expTypeId}.${recordDate}`);
      if (!taxTypeList) {
        // when switch record, display loading skeleton instead of full screen spinner
        dispatchProps.toggleRecordLoading(true);
        dispatchProps
          .searchTaxTypeList(expTypeId, recordDate, null, loadInBackground)
          .then(() => {
            dispatchProps.toggleRecordLoading(false);
          });
      }
    }
  },
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId: string = null,
    taxName: string = null
  ) => {
    const isParentItem = ownProps.recordItemIdx === 0;
    const recordItem = ownProps.expRecord.items[ownProps.recordItemIdx];
    const expTypeId = recordItem.expTypeId;

    // if no expType selected OR is itemized, only update value
    if (!expTypeId || ownProps.isItemized) {
      ownProps.onChangeEditingExpReport(
        `${ownProps.targetRecord}.items.${ownProps.recordItemIdx}.${
          isTaxIncluded ? 'amount' : 'withoutTax'
        }`,
        amount,
        true
      );
      if (isParentItem) {
        ownProps.onChangeEditingExpReport(
          `${ownProps.targetRecord}.${isTaxIncluded ? 'amount' : 'withoutTax'}`,
          amount,
          true
        );
      }
      return;
    }

    const taxTypeName = taxName || recordItem.taxTypeName;
    const taxTypeBaseId = baseId || recordItem.taxTypeBaseId;

    const recordDate = recordItem.recordDate || ownProps.expRecord.recordDate;
    let taxTypeList =
      stateProps.tax &&
      stateProps.tax[expTypeId] &&
      stateProps.tax[expTypeId][recordDate] &&
      stateProps.tax[expTypeId][recordDate];

    let taxRes = {} as TaxRes;

    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;

    let historyId = '';
    let rate;

    const isTaxSame = !taxName || taxName === recordItem.taxTypeName;
    const isAmountSame =
      !isFixedAllowanceMulti(ownProps.expRecord.recordType) && isTaxIncluded
        ? amount === recordItem.amount
        : amount === recordItem.withoutTaxl;
    if (isTaxSame && isAmountSame) return;

    // if tax state has not already existed, fetch it from API
    if (!taxTypeList) {
      dispatchProps.searchTaxTypeList(expTypeId, recordDate).then((result) => {
        taxTypeList = result.payload[expTypeId][recordDate];
        const taxType =
          find(taxTypeList, { baseId: taxTypeBaseId }) || taxTypeList[0];
        historyId = taxType ? taxType.historyId : null;
        rate = taxType ? taxType.rate : 0;
        taxRes = calcTaxAction(
          rate,
          amount || 0,
          ownProps.baseCurrencyDecimal,
          stateProps.taxRoundingSetting
        );
      });
    } else {
      const taxType =
        find(taxTypeList, { baseId: taxTypeBaseId }) || taxTypeList[0];
      historyId = taxType ? taxType.historyId : null;
      rate = taxType ? taxType.rate : 0;
      taxRes = calcTaxAction(
        rate,
        amount || 0,
        ownProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );
    }

    const targetPath = `items.${ownProps.recordItemIdx}`;

    const updateObj = {
      [`${targetPath}.amount`]:
        (isTaxIncluded ? amount : taxRes.amountWithTax) || 0,
      [`${targetPath}.withoutTax`]:
        (isTaxIncluded ? taxRes.amountWithoutTax : amount) || 0,
      [`${targetPath}.gstVat`]: taxRes.gstVat,
      [`${targetPath}.taxTypeBaseId`]: taxTypeBaseId,
      [`${targetPath}.taxTypeHistoryId`]: historyId,
      [`${targetPath}.taxTypeName`]: taxTypeName,
      [`${targetPath}.taxRate`]: rate,
      [`${targetPath}.taxManual`]: false,
    };
    if (isParentItem) {
      assign(updateObj, {
        amount: (isTaxIncluded ? amount : taxRes.amountWithTax) || 0,
        withoutTax: (isTaxIncluded ? taxRes.amountWithoutTax : amount) || 0,
      });
    }

    const mergedExpRecord = mergeValues(
      ownProps.expRecord,
      ownProps.touched,
      updateObj
    );

    ownProps.onChangeEditingExpReport(
      ownProps.targetRecord,
      mergedExpRecord.values,
      true,
      mergedExpRecord.touched
    );
  },
  toggleInputMode: () => {
    const isHotelFee = ownProps.expRecord.recordType === RECORD_TYPE.HotelFee;
    const toggleMode = () => {
      const inputMode = ownProps.expRecord.amountInputMode;
      const nextMode =
        inputMode === AmountInputMode.TaxIncluded
          ? AmountInputMode.TaxExcluded
          : AmountInputMode.TaxIncluded;
      ownProps.onChangeEditingExpReport(
        `${ownProps.targetRecord}.amountInputMode`,
        nextMode
      );
    };
    if (isHotelFee && ownProps.expRecord.items.length > 1) {
      dispatchProps.confirm(
        msg().Exp_Msg_ConfirmChangeInputMode,
        async (yes) => {
          if (yes) {
            ownProps.removeAllChildItems();
            toggleMode();
          }
        }
      );
    } else {
      toggleMode();
    }
  },

  onClickEditButton: () => {
    const idx = ownProps.recordItemIdx;
    const isParentItem = idx === 0;
    const isTaxIncluded =
      ownProps.expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    const taxManual = !ownProps.expRecord.items[idx].taxManual;
    if (!taxManual) {
      const recordDate =
        ownProps.expRecord.items[idx].recordDate ||
        ownProps.expRecord.recordDate;
      const expTypeId = ownProps.expRecord.items[idx].expTypeId;

      const taxTypeList = get(stateProps, `tax.${expTypeId}.${recordDate}`, []);
      const taxType = find(taxTypeList, {
        historyId: ownProps.expRecord.items[idx].taxTypeHistoryId,
      });
      const rate = taxType ? taxType.rate : 0;
      const baseAmount = isTaxIncluded
        ? ownProps.expRecord.items[idx].amount
        : ownProps.expRecord.items[idx].withoutTax;
      const taxRes: TaxRes = calcTaxAction(
        rate,
        baseAmount,
        ownProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );
      const targetPath = `items.${idx}`;
      const updateObj = {
        [`${targetPath}.amount`]: isTaxIncluded
          ? baseAmount
          : taxRes.amountWithTax,
        [`${targetPath}.withoutTax`]: isTaxIncluded
          ? taxRes.amountWithoutTax
          : baseAmount,
        [`${targetPath}.gstVat`]: taxRes.gstVat,
        [`${targetPath}.taxManual`]: taxManual,
      };
      if (isParentItem) {
        assign(updateObj, {
          amount: isTaxIncluded ? baseAmount : taxRes.amountWithTax,
          withoutTax: isTaxIncluded ? taxRes.amountWithoutTax : baseAmount,
        });
      }
      const mergedExpRecord = mergeValues(
        ownProps.expRecord,
        ownProps.touched,
        updateObj
      );

      ownProps.onChangeEditingExpReport(
        ownProps.targetRecord,
        mergedExpRecord.values,
        false,
        mergedExpRecord.touched
      );
    } else {
      const targetPath = `${ownProps.targetRecord}.items.${idx}.taxManual`;
      ownProps.onChangeEditingExpReport(targetPath, taxManual);
    }
  },
  calcTaxFromGstVat: (gstVat: number) => {
    const isTaxIncluded =
      ownProps.expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const baseAmount = isTaxIncluded
      ? ownProps.expRecord.items[ownProps.recordItemIdx].amount
      : ownProps.expRecord.items[ownProps.recordItemIdx].withoutTax;
    const modifiedGstVat = isTaxIncluded
      ? Math.min(baseAmount, gstVat)
      : gstVat;
    const taxRes = calcTaxFromGstVat(
      modifiedGstVat,
      baseAmount,
      ownProps.baseCurrencyDecimal,
      isTaxIncluded
    );

    const isParentItem = ownProps.recordItemIdx === 0;
    const targetPath = `items.${ownProps.recordItemIdx}`;
    const updateObj = {
      [`${targetPath}.amount`]: taxRes.amountWithTax,
      [`${targetPath}.withoutTax`]: taxRes.amountWithoutTax,
      [`${targetPath}.gstVat`]: modifiedGstVat,
    };
    if (isParentItem) {
      assign(updateObj, {
        amount: taxRes.amountWithTax,
        withoutTax: taxRes.amountWithoutTax,
      });
    }

    const mergedExpRecord = mergeValues(
      ownProps.expRecord,
      ownProps.touched,
      updateObj
    );

    ownProps.onChangeEditingExpReport(
      ownProps.targetRecord,
      mergedExpRecord.values,
      false,
      mergedExpRecord.touched
    );
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BaseCurrencyView) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
