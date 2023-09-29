import { connect } from 'react-redux';

import { assign, find, get, isEmpty } from 'lodash';

import { confirm } from '../../../commons/actions/app';
import BaseCurrencyView, {
  ContainerProps as BaseCurrencyContainerProps,
} from '../../../commons/components/exp/Form/RecordItem/General/BaseCurrency';
import { selectors as appSelectors } from '../../../commons/modules/app';
import { calculateBCChildItemListAmount } from '@commons/utils/exp/ItemizationUtil';

import {
  calculateAmountForCCTrans,
  calculateAmountPayable,
  isFixedAllowanceMulti,
  isItemizedRecord,
  isMileageRecord,
  isUseWithholdingTax,
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

import {
  searchChildItemTaxTypeList,
  searchTaxTypeList,
} from '../../action-dispatchers/Currency';

const mapStateToProps = (state, ownProps) => ({
  tax: state.ui.expenses.recordItemPane.tax,
  allowTaxAmountChange: state.userSetting.allowTaxAmountChange,
  allowTaxExcludedAmount: state.userSetting.allowTaxExcludedAmountInput,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  onChangeEditingExpReport: (key, value) => {
    ownProps.onChangeEditingExpReport(`report.${key}`, value);
  },
  isLoading: appSelectors.loadingSelector(state),
  isUseWithholdingTax: isUseWithholdingTax(
    ownProps.expRecord.withholdingTaxUsage
  ),
  loadingAreas: state.common.app.loadingAreas,
  isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
});

const mapDispatchToProps = {
  searchChildItemTaxTypeList,
  searchTaxTypeList,
  toggleRecordLoading: recordPanelLoadingActions.toggle,
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
  onChangeAmountOrTaxType: async (
    amount: number,
    isTaxIncluded: boolean,
    baseId: string = null,
    taxName: string = null
  ) => {
    const isParentItem = ownProps.recordItemIdx === 0;
    const recordItem = ownProps.expRecord.items[ownProps.recordItemIdx];
    const expTypeId = recordItem.expTypeId;
    const isRecalc = !stateProps.isBulkEditMode;
    const { withholdingTaxAmount } = recordItem;

    // if no expType selected, only update value
    if (!expTypeId) {
      ownProps.onChangeEditingExpReport(
        `${ownProps.targetRecord}.items.${ownProps.recordItemIdx}.${
          isTaxIncluded ? 'amount' : 'withoutTax'
        }`,
        amount,
        isRecalc
      );
      if (isParentItem) {
        ownProps.onChangeEditingExpReport(
          `${ownProps.targetRecord}.${isTaxIncluded ? 'amount' : 'withoutTax'}`,
          amount,
          isRecalc
        );
      }
      if (stateProps.isUseWithholdingTax) {
        const amountPayable = calculateAmountPayable(
          amount,
          ownProps.baseCurrencyDecimal,
          withholdingTaxAmount
        );
        ownProps.onChangeEditingExpReport(
          `${ownProps.targetRecord}.items.0.amountPayable`,
          amountPayable
        );
      }
      return;
    }

    const taxTypeName = taxName || recordItem.taxTypeName;
    const taxTypeBaseId = baseId || recordItem.taxTypeBaseId;

    const recordDate = isParentItem
      ? recordItem.recordDate || ownProps.expRecord.recordDate
      : ownProps.expRecord.recordDate;
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
      !isFixedAllowanceMulti(ownProps.expRecord.recordType) &&
      !isMileageRecord(ownProps.expRecord.recordType) &&
      isTaxIncluded
        ? amount === recordItem.amount
        : amount === recordItem.withoutTax;
    if (isTaxSame && isAmountSame) return;

    // if tax state has not already existed, fetch it from API
    if (!taxTypeList || isEmpty(taxTypeList)) {
      await dispatchProps
        .searchTaxTypeList(expTypeId, recordDate)
        .then((result) => {
          taxTypeList = result.payload[expTypeId][recordDate];
          const defaultTaxType = isParentItem ? taxTypeList[0] : null;
          const taxType =
            find(taxTypeList, { baseId: taxTypeBaseId }) || defaultTaxType;
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
      const defaultTaxType = isParentItem ? taxTypeList[0] : null;
      const taxType =
        find(taxTypeList, { baseId: taxTypeBaseId }) || defaultTaxType;
      historyId = taxType ? taxType.historyId : null;
      rate = taxType ? taxType.rate : 0;
      taxRes = calcTaxAction(
        rate,
        amount || 0,
        ownProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );
    }

    const updateObj = {};
    const itemList = ownProps.expRecord.items;
    const isParentHasChild = isParentItem && isItemizedRecord(itemList.length);
    if (!isTaxSame && isParentHasChild) {
      const [_, ...childItemList] = itemList;

      const taxTypeObj = await dispatchProps.searchChildItemTaxTypeList(
        childItemList,
        recordDate
      );

      const updateChildItemObj = calculateBCChildItemListAmount(
        ownProps.expRecord.amountInputMode,
        ownProps.baseCurrencyDecimal,
        childItemList,
        recordDate,
        stateProps.taxRoundingSetting,
        taxTypeObj,
        baseId
      );
      assign(updateObj, updateChildItemObj);
    }

    const amountPayable = stateProps.isUseWithholdingTax
      ? calculateAmountPayable(
          isTaxIncluded ? amount : Number(taxRes.amountWithTax),
          ownProps.baseCurrencyDecimal,
          withholdingTaxAmount
        )
      : 0;

    const targetPath = `items.${ownProps.recordItemIdx}`;

    assign(updateObj, {
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
      [`${targetPath}.amountPayable`]: amountPayable,
    });
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
      isRecalc,
      mergedExpRecord.touched
    );
  },
  onChangeTaxWithholdingAmount: (withholdingAmount: number) => {
    const {
      baseCurrencyDecimal,
      expRecord,
      recordItemIdx,
      targetRecord,
      touched,
    } = ownProps;
    const { tax, taxRoundingSetting } = stateProps;
    const {
      creditCardTransactionId,
      items,
      recordDate: expRecordDate,
    } = expRecord;
    const {
      amount,
      amountPayable,
      expTypeId,
      recordDate: itemRecordDate,
      taxTypeBaseId,
    } = items[recordItemIdx];

    let amountOrPayableObj = {};
    if (creditCardTransactionId) {
      const recordDate = itemRecordDate || expRecordDate;
      const taxTypeList = get(tax, `${expTypeId}.${recordDate}`);
      const taxType =
        find(taxTypeList, { baseId: taxTypeBaseId }) || taxTypeList[0];

      const newAmount = calculateAmountForCCTrans(
        amountPayable,
        baseCurrencyDecimal,
        withholdingAmount
      );
      const taxRes = calculateTax(
        taxType ? taxType.rate : 0,
        newAmount,
        baseCurrencyDecimal,
        taxRoundingSetting
      );
      const targetPath = `items.${recordItemIdx}`;
      amountOrPayableObj = {
        [`${targetPath}.amount`]: newAmount,
        [`${targetPath}.gstVat`]: taxRes.gstVat,
        [`${targetPath}.withoutTax`]: taxRes.amountWithoutTax,
      };
    } else {
      const amountPayable = calculateAmountPayable(
        amount,
        baseCurrencyDecimal,
        withholdingAmount
      );
      amountOrPayableObj = {
        'items.0.amountPayable': amountPayable,
      };
    }

    const updateObj = {
      ...amountOrPayableObj,
      'items.0.withholdingTaxAmount':
        withholdingAmount > 0 ? -withholdingAmount : withholdingAmount,
    };
    const mergedExpRecord = mergeValues(expRecord, touched, updateObj);
    ownProps.onChangeEditingExpReport(
      targetRecord,
      mergedExpRecord.values,
      creditCardTransactionId
    );
  },
  toggleInputMode: () => {
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
    toggleMode();
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
      const recordDate = isParentItem
        ? ownProps.expRecord.items[idx].recordDate ||
          ownProps.expRecord.recordDate
        : ownProps.expRecord.recordDate;
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

      const amountPayable = stateProps.isUseWithholdingTax
        ? calculateAmountPayable(
            isTaxIncluded ? baseAmount : Number(taxRes.amountWithTax),
            ownProps.baseCurrencyDecimal,
            ownProps.expRecord.items[idx].withholdingTaxAmount
          )
        : 0;

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
        [`${targetPath}.amountPayable`]: amountPayable,
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
    let taxAmount = gstVat;
    const { baseCurrencyDecimal, expRecord } = ownProps;
    const { amount, withoutTax } = expRecord.items[ownProps.recordItemIdx];
    const isTaxIncluded =
      ownProps.expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const baseAmount = isTaxIncluded ? amount : withoutTax;
    if (amount * taxAmount < 0) {
      taxAmount = taxAmount * -1;
    }
    const modifiedGstVat = isTaxIncluded
      ? baseAmount >= 0
        ? Math.min(baseAmount, taxAmount)
        : Math.max(baseAmount, taxAmount)
      : taxAmount;
    const taxRes = calcTaxFromGstVat(
      modifiedGstVat,
      baseAmount,
      ownProps.baseCurrencyDecimal,
      isTaxIncluded
    );
    const amountPayable = stateProps.isUseWithholdingTax
      ? calculateAmountPayable(
          Number(taxRes.amountWithTax),
          baseCurrencyDecimal,
          expRecord.items[0].withholdingTaxAmount
        )
      : 0;
    const isParentItem = ownProps.recordItemIdx === 0;
    const targetPath = `items.${ownProps.recordItemIdx}`;
    const updateObj = {
      [`${targetPath}.amount`]: taxRes.amountWithTax,
      [`${targetPath}.withoutTax`]: taxRes.amountWithoutTax,
      [`${targetPath}.gstVat`]: modifiedGstVat,
      [`${targetPath}.amountPayable`]: amountPayable,
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
)(
  BaseCurrencyView
) as React.ComponentType<any> as React.ComponentType<BaseCurrencyContainerProps>;
