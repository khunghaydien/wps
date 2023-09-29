import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { transactionFilterField } from '@mobile/constants/advSearch';

import TransactionList from '../../../components/pages/expense/commons/TransactionList';
import CurrencyUtil from '@apps/commons/utils/CurrencyUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import { showAlert } from '@apps/mobile-app/modules/commons/alert';
import msg from '@commons/languages';

import { Transaction as CCTransaction } from '@apps/domain/models/exp/CreditCard';
import {
  calculateAmountForCCTrans,
  calculateTotalTaxes,
  RECORD_TYPE,
  updateTaxItemRates,
} from '@apps/domain/models/exp/Record';
import { AmountInputMode, calculateTax } from '@apps/domain/models/exp/TaxType';
import { STATUS_LIST } from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as selectedCCTransactionsActions } from '../../../modules/expense/ui/creditCard/selectedTransactions';
import { actions as ccCardActions } from '@mobile/modules/expense/entities/ccCard';
import { UI_TYPE } from '@mobile/modules/expense/pages/routeFormPage';
import { actions as formValueActions } from '@mobile/modules/expense/ui/general/formValues';
import { actions as ccCardNameActions } from '@mobile/modules/expense/ui/transactionAdvSearch/cardName';
import {
  requestDateConverter,
  requestDateOptions,
} from '@mobile/modules/expense/ui/transactionAdvSearch/requestDateRange';
import { getStatusText } from '@mobile/modules/expense/ui/transactionAdvSearch/statusList';

import { CARD_TYPES } from './FilterDetailTransactionContainer';
import {
  cardNameSelector,
  detailSelector,
  requestDateSelector,
  statusSelector,
} from './ICTransactionsContainer';
import { toggleHideCC } from '@apps/expenses-pc/action-dispatchers/Expenses';
import { getCCTransactions } from '@mobile/action-dispatchers/expense/CreditCard';

type Props = RouteComponentProps & {
  reportId: string;
  recordId?: string;
};

type ContainerProps = ReturnType<typeof mergeProps> & Props;

const CCTransactionsContainer = (ownProps: ContainerProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const [transactions, setTransactions] = useState<CCTransaction[]>([]);

  useEffect(() => {
    ownProps.getCreditCardTransactions().then((res) => {
      if (res.length > 0) {
        const cardNameList = res.map((transaction) => transaction.cardNameL);
        const cardNameSet = [...new Set(cardNameList)];
        const cardNameOptions = cardNameSet.map((cardName: string) => ({
          label: cardName,
          value: cardName,
        }));
        ownProps.setCcCards(cardNameOptions);
        ownProps.setSelectedCCCardName(
          cardNameOptions.map((card) => card.value)
        );
        setTransactions(res);
      }
    });
    return () => {
      const isNavigateToExpType = get(
        ownProps.history,
        'location.pathname',
        ''
      ).includes('expense-type/list');
      if (!isNavigateToExpType) {
        ownProps.clearSelectedTransactions();
      }
    };
  }, []);

  const onSelectRow = (e) => {
    const transId = e.target.value;
    const transInfo = transactions.find(({ id }) => id === transId);
    dispatch(selectedCCTransactionsActions.toggle(transInfo));
  };

  const setHideStatus = (id: string, isHidden: boolean) => {
    setTransactions((filteredTransactions) =>
      cloneDeep(filteredTransactions).map((transaction) =>
        transaction.id === id ? { ...transaction, isHidden } : transaction
      )
    );
  };

  const hideCCCardTransaction = (id: string, toHide: boolean) => {
    setHideStatus(id, toHide);
    ownProps.toggleHideCC(id, toHide).then((isSuccess) => {
      if (!isSuccess) {
        setHideStatus(id, !toHide);
      }
    });
  };

  const ccTransactions = () => {
    return transactions.map((item) => {
      const {
        amount,
        transactionDescription,
        transactionDate,
        cardNameL,
        isHidden,
        isUsed,
        cardAssociation,
        cardNumber,
        reimbursementFlag,
      } = item;
      const symbol = ownProps.baseCurrencySymbol || '';
      const amountWithComma = CurrencyUtil.convertToCurrency(amount);
      const amountWithSymbol = `${symbol} ${amountWithComma}`;
      const cardInfo = TextUtil.nl2br(
        `${cardNameL}\n${cardAssociation} **** ${cardNumber}` +
          (reimbursementFlag ? '\n' + msg().Exp_Lbl_ReimbursementTooltip : '')
      );
      return {
        transactionAmount: amountWithSymbol,
        transactionPaymentDate: transactionDate,
        transactionName: cardNameL,
        isArchived: isHidden,
        transactionDescription,
        isClaimed: isUsed,
        transactionId: item.id,
        showAlert: () => dispatch(showAlert(cardInfo)),
      };
    });
  };

  const selected = requestDateOptions().find(
    ({ value }) => value === ownProps.requestDate
  );
  const tag = selected ? selected.label : ownProps.requestDate;

  const filterList = [
    {
      key: transactionFilterField.CARD_NAME,
      label: msg().Exp_Lbl_CardName,
      value: ownProps.selectedCardName,
      count: ownProps.selectedCardName?.length,
    },
    {
      key: transactionFilterField.DETAIL,
      label: msg().Exp_Lbl_Detail,
      value: ownProps.detail,
      count: ownProps.detail ? 1 : 0,
    },
    {
      key: transactionFilterField.REQUEST_DATE,
      label: msg().Exp_Btn_SearchConditionRequestDate,
      value: tag,
      count: 1,
    },
    {
      key: transactionFilterField.STATUS,
      label: msg().Exp_Btn_SearchConditionStatus,
      value: ownProps.statusList
        .map((status) => getStatusText(status))
        .join(', '),
      count: ownProps.statusList.length,
    },
  ];

  const isAddUIType = get(ownProps.location, 'state.type') === UI_TYPE.ADD;
  const isShowApplyBtn = ownProps.recordId || isAddUIType;
  return (
    <TransactionList
      mainBtnLabel={isShowApplyBtn ? msg().Com_Lbl_Apply : ''}
      onSelectRow={onSelectRow}
      selectedIds={ownProps.selectedIds}
      onClickBack={ownProps.onClickBack}
      onClickMainButton={
        isShowApplyBtn ? ownProps.onClickApply : ownProps.onClickNext
      }
      tags={filterList}
      onClickFilterItem={ownProps.onClickFilterItem}
      transactionList={ccTransactions()}
      hideCardTransaction={hideCCCardTransaction}
    />
  );
};

const mapStateToProps = (state: State) => {
  const statusList = statusSelector(state);
  const selectedCardName = cardNameSelector(state);
  const requestDate = requestDateSelector(state);
  const detail = detailSelector(state);
  const selectedIds = state.expense.ui.creditCard.selectedTransactions.map(
    (item) => item.id
  );
  const recordPaymentMethodId = get(
    state,
    'expense.ui.general.formValues.paymentMethodId'
  );
  const paymentMethodList = state.expense.entities.paymentMethodList;
  const { reimbursement } =
    paymentMethodList.find(({ id }) => id === recordPaymentMethodId) || {};
  return {
    userSetting: state.userSetting,
    statusList,
    requestDate,
    selectedCardName,
    detail,
    baseCurrencySymbol: state.userSetting.currencySymbol,
    baseCurrencyCode: state.userSetting.currencyCode,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    selectedIds,
    transactions: state.expense.entities.ccTransactions,
    taxTypeList: state.expense.entities.taxType,
    isReimbursePaymentMethod: reimbursement,
    formValues: state.expense.ui.general.formValues,
    selectedCCTransactions: state.expense.ui.creditCard.selectedTransactions,
  };
};

const mapDispatchToProps = {
  getCCTransactions,
  toggleHideCC,
  saveFormValue: formValueActions.save,
  clearSelectedTransactions: selectedCCTransactionsActions.clear,
  setSelectedCCCardName: ccCardNameActions.set,
  setCcCards: ccCardActions.set,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickApply: () => {
    const selected = stateProps.selectedCCTransactions[0];
    const {
      amount,
      cardAssociation,
      cardNumber,
      id,
      transactionDate,
      transactionDescription,
      merchantName,
    } = selected;
    const remarks = `${merchantName}: ${transactionDescription || ''}`;

    // update record with new CC info and recalc based on tax and withholding tax
    const recordCopy = cloneDeep(stateProps.formValues);
    const recordItem = recordCopy.items[0];
    const { taxRate, taxTypeBaseId, withholdingTaxAmount } = recordItem;
    // withholding tax
    let newAmount = amount;
    if (withholdingTaxAmount !== 0) {
      newAmount = calculateAmountForCCTrans(
        amount,
        stateProps.baseCurrencyDecimal,
        withholdingTaxAmount
      );
    }
    recordCopy.creditCardTransactionId = id || null;
    recordCopy.creditCardAssociation = cardAssociation;
    recordCopy.creditCardNo = cardNumber;
    recordCopy.amountInputMode = AmountInputMode.TaxIncluded;
    recordCopy.amount = newAmount;
    recordCopy.recordDate = transactionDate;
    recordItem.amount = newAmount;
    recordItem.amountPayable = amount;
    recordItem.taxManual = false;
    recordItem.merchant = merchantName;
    recordItem.transactionDescription = transactionDescription;
    recordItem.recordDate = transactionDate;
    recordItem.remarks = remarks;

    const isMultipleTax = recordItem?.taxItems?.length > 0;

    if (isMultipleTax) {
      const updatedTaxItems = updateTaxItemRates({
        taxItems: recordItem.taxItems,
        taxTypeList: stateProps.taxTypeList,
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
      // tax
      let rate = taxRate;
      if (!rate) {
        const taxType = stateProps.taxTypeList.find(
          ({ baseId }) => baseId === taxTypeBaseId
        );
        rate = get(taxType, 'rate');
      }
      const taxRes = calculateTax(
        rate || 0,
        newAmount,
        stateProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );

      recordItem.gstVat = taxRes.gstVat;
      recordItem.withoutTax = taxRes.amountWithoutTax;
    }

    dispatchProps.saveFormValue(recordCopy);

    const url = ownProps.reportId
      ? `/expense/record/detail/${ownProps.reportId}/${ownProps.recordId}`
      : ownProps.recordId
      ? `/expense/record/detail/${ownProps.recordId}`
      : '/expense/records/record/new/general';
    pushHistoryWithPrePage(ownProps.history, url);
  },
  onClickNext: () => {
    const target =
      ownProps.reportId && ownProps.reportId !== 'undefined'
        ? 'report'
        : 'record';
    ownProps.history.push(`/expense/expense-type/list/${RECORD_TYPE.General}`, {
      target,
    });
  },
  onClickBack: () => {
    goBack(ownProps.history);
  },
  onClickFilterItem: (key) => {
    pushHistoryWithPrePage(
      ownProps.history,
      '/expense/transaction/advance-search/detail',
      {
        key,
        card_type: CARD_TYPES.CREDIT_CARD,
      }
    );
  },
  getCreditCardTransactions: () => {
    const { companyId, employeeId } = stateProps.userSetting;
    const checkIsStatusSelected = (
      status: string,
      selected: string[]
    ): boolean => selected.includes(status);
    const includeHidden = checkIsStatusSelected(
      STATUS_LIST.INCLUDED_ARCHIVED,
      stateProps.statusList
    );
    const includeClaimed = checkIsStatusSelected(
      STATUS_LIST.INCLUDED_CLAIMED,
      stateProps.statusList
    );
    const { startDate, endDate } = requestDateConverter(stateProps.requestDate);

    return dispatchProps
      .getCCTransactions(
        companyId,
        employeeId,
        startDate,
        endDate,
        stateProps.isReimbursePaymentMethod,
        stateProps.selectedCardName,
        stateProps.detail,
        includeHidden,
        includeClaimed
      )
      .then((res) => res);
  },
  // @ts-ignore
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CCTransactionsContainer);
