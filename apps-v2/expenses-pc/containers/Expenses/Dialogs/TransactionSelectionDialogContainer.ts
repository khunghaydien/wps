import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import TransactionSelection, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/TransactionSelection';
import { PROGRESS_STATUS } from '../../../../commons/components/ProgressBar';
import {
  actions as toastActions,
  showErrorToast,
} from '@commons/modules/toast';

import {
  calculateAmountForCCTrans,
  calculateTotalTaxes,
  getCCExcludedRecordTypes,
  updateTaxItemRates,
} from '@apps/domain/models/exp/Record';
import {
  AmountInputMode,
  calculateTax,
  ExpTaxType,
} from '@apps/domain/models/exp/TaxType';

import { State } from '../../../modules';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';
import { actions as transactionSelectActions } from '../../../modules/ui/expenses/dialog/transactionSelect/selected';

import { openExpenseTypeDialog } from '../../../action-dispatchers/Dialog';
import {
  getCreditCardTransactions,
  toggleHideCC,
} from '../../../action-dispatchers/Expenses';
import { searchTaxTypeList } from '@apps/expenses-pc/action-dispatchers/Currency';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const recordPaymentMethodId = get(
    ownProps.expReport,
    `records.${ownProps.recordIdx}.paymentMethodId`
  );
  const paymentMethodList = state.common.exp.entities.paymentMethodList;
  const { reimbursement } =
    paymentMethodList.find(({ id }) => id === recordPaymentMethodId) || {};
  return {
    companyId: state.userSetting.companyId,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    employeeId: state.userSetting.employeeId,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    overlap: state.ui.expenses.overlap,
    progressBar: state.ui.expenses.dialog.progressBar,
    selectedTransaction: state.ui.expenses.dialog.transactionSelect.selected,
    tax: state.ui.expenses.recordItemPane.tax,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    isReimbursePaymentMethod: reimbursement,
    isShowToast: state.common.toast.isShow,
  };
};

const mapDispatchToProps = {
  getCCTransaction: getCreditCardTransactions,
  openExpenseTypeDialog,
  toggleHideCC,
  setProgressBar: progressBarActions.set,
  resetProgressBar: progressBarActions.clear,
  setSelectedTransaction: transactionSelectActions.set,
  clearSelectedTransaction: transactionSelectActions.clear,
  showErrorToast,
  hideToast: toastActions.hide,
  searchTaxTypeList,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  getCreditCardTransactions: (
    from,
    to,
    cardNameList,
    description,
    includeHidden,
    includeClaimed
  ) =>
    // @ts-ignore
    dispatchProps.getCCTransaction(
      stateProps.companyId,
      stateProps.employeeId,
      from,
      to,
      stateProps.isReimbursePaymentMethod,
      cardNameList,
      description,
      includeHidden,
      includeClaimed
    ),
  onClickNextButton: () => {
    const recordDate =
      stateProps.selectedTransaction.transactionDate ||
      ownProps.expReport.accountingDate;

    dispatchProps.openExpenseTypeDialog(
      stateProps.employeeId,
      stateProps.companyId,
      recordDate,
      '',
      ownProps.expReport.expReportTypeId || '',
      false,
      getCCExcludedRecordTypes()
    );

    const steps = stateProps.progressBar || [];
    steps[steps.length - 1].status = PROGRESS_STATUS.SELECTED;
    dispatchProps.setProgressBar(steps);
  },
  onClickConfirmButton: async () => {
    // update record with new CC info and recalc based on tax and withholding tax
    const { expReport, recordIdx } = ownProps;
    const {
      baseCurrencyDecimal,
      selectedTransaction,
      tax,
      taxRoundingSetting,
    } = stateProps;
    const {
      amount,
      cardAssociation,
      cardNumber,
      id,
      merchantName,
      transactionDate,
      transactionDescription,
    } = selectedTransaction;
    const recordCopy = cloneDeep(get(expReport, `records.${recordIdx}`));
    const recordItem = recordCopy.items[0];
    const {
      expTypeId = '',
      taxTypeBaseId = '',
      withholdingTaxAmount = 0,
    } = recordItem;

    // withholding tax
    let newAmount = amount;
    if (withholdingTaxAmount !== 0) {
      newAmount = calculateAmountForCCTrans(
        amount,
        baseCurrencyDecimal,
        withholdingTaxAmount
      );
    }
    // tax
    let taxTypeList = get(tax, expTypeId, {})[transactionDate];
    if (!taxTypeList) {
      const taxTypeResult = await dispatchProps.searchTaxTypeList(
        expTypeId,
        transactionDate
      );
      taxTypeList = get(
        taxTypeResult,
        `payload.${expTypeId}.${transactionDate}`,
        []
      );
    }

    recordCopy.creditCardTransactionId = id;
    recordCopy.creditCardAssociation = cardAssociation;
    recordCopy.creditCardNo = cardNumber;
    recordCopy.recordDate = transactionDate;
    recordItem.merchant = merchantName;
    recordItem.recordDate = transactionDate;
    recordItem.remarks = transactionDescription;
    recordCopy.amountInputMode = AmountInputMode.TaxIncluded;
    recordCopy.amount = newAmount;
    recordItem.amount = newAmount;
    recordItem.amountPayable = amount;
    recordItem.taxManual = false;

    const isMultipleTax = recordItem?.taxItems?.length > 0;

    if (isMultipleTax) {
      const updatedTaxItems = updateTaxItemRates({
        taxItems: recordItem.taxItems,
        taxTypeList,
        baseCurrencyDecimal: stateProps.baseCurrencyDecimal,
        taxRoundingSetting: stateProps.taxRoundingSetting,
        isTaxIncludedMode: AmountInputMode.TaxIncluded,
      });

      const { totalAmountExclTax, totalGstVat } = calculateTotalTaxes(
        updatedTaxItems,
        stateProps.baseCurrencyDecimal
      );

      recordItem.gstVat = totalGstVat;
      recordItem.withoutTax = totalAmountExclTax;
    } else {
      const taxType =
        taxTypeBaseId === 'noIdSelected'
          ? taxTypeList[0] || ({} as ExpTaxType)
          : taxTypeList.find(({ baseId }) => baseId === taxTypeBaseId) ||
            ({} as ExpTaxType);
      const taxRes = calculateTax(
        taxType.rate || 0,
        newAmount,
        baseCurrencyDecimal,
        taxRoundingSetting
      );

      recordItem.gstVat = taxRes.gstVat;
      recordItem.withoutTax = taxRes.amountWithoutTax;
    }

    ownProps.onChangeEditingExpReport(
      `report.records.${ownProps.recordIdx}`,
      recordCopy
    );
    ownProps.onClickHideDialogButton();
    dispatchProps.clearSelectedTransaction();
  },
  hideAndReset: () => {
    ownProps.onClickHideDialogButton();
    dispatchProps.clearSelectedTransaction();
  },
  selectedAccountingPeriod: (() => {
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    return selectedAccountingPeriod;
  })(),
  hideToast: () => {
    if (stateProps.isShowToast) dispatchProps.hideToast();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TransactionSelection) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
