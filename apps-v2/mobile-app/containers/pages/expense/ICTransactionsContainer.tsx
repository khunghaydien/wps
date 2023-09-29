import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { transactionFilterField } from '@apps/mobile-app/constants/advSearch';

import TransactionList from '../../../components/pages/expense/commons/TransactionList';
import msg from '@apps/commons/languages';
import CurrencyUtil from '@apps/commons/utils/CurrencyUtil';

import { RECORD_TYPE } from '@apps/domain/models/exp/Record';
import { calculateTax } from '@apps/domain/models/exp/TaxType';
import {
  getDetailDisplay,
  getRouteInfo,
  IcCards,
  IcTransactionWithCardNo,
  STATUS_LIST,
} from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as formValueAction } from '../../../modules/expense/ui/general/formValues';
import { actions as selectedTransactionsActions } from '../../../modules/expense/ui/icCard/selectedTransactions';
import {
  requestDateConverter,
  requestDateOptions,
} from '@apps/mobile-app/modules/expense/ui/transactionAdvSearch/requestDateRange';
import { getStatusText } from '@apps/mobile-app/modules/expense/ui/transactionAdvSearch/statusList';
import { UI_TYPE } from '@mobile/modules/expense/pages/routeFormPage';

import { getICTransactions } from '../../../action-dispatchers/expense/ICCard';
import { CARD_TYPES } from './FilterDetailTransactionContainer';
import { hideICCardTransaction } from '@apps/expenses-pc/action-dispatchers/Expenses';

type Props = RouteComponentProps & {
  reportId?: string;
  recordId?: string;
};

export const statusSelector = (state: State) =>
  state.expense.ui.transactionAdvSearch.statusList;
export const cardNameSelector = (state: State) =>
  state.expense.ui.transactionAdvSearch.cardName;
export const detailSelector = (state: State) =>
  state.expense.ui.transactionAdvSearch.detail;
export const requestDateSelector = (state: State) =>
  state.expense.ui.transactionAdvSearch.requestDateRange;

type ContainerProps = ReturnType<typeof mergeProps> & Props;

const ICTransactionsContainer = (ownProps: ContainerProps) => {
  const [transactions, setTransactions] = useState<IcTransactionWithCardNo[]>(
    []
  );

  const filterTransactions = (
    transactionsList: Array<IcTransactionWithCardNo>,
    cards: IcCards,
    selectedCards: Array<string>,
    detailSearchInput: string
  ) => {
    const filtered = [];

    cloneDeep(transactionsList).forEach((transaction) => {
      const cardNo = transaction.cardNo;
      const cardInfo = find(cards, { cardNo });
      const cardName = get(cardInfo, 'cardName', '');
      const detailDisplay = getDetailDisplay(transaction);

      const isCardNumberMatch = selectedCards.includes(String(cardNo));
      const isDetailMatch = detailDisplay
        .toLowerCase()
        .includes(detailSearchInput.toLowerCase());
      if (isCardNumberMatch && isDetailMatch) {
        const extendedTransaction = {
          ...transaction,
          detailDisplay,
          cardName,
          showCheckbox: !transaction.isUsed,
        };
        filtered.push(extendedTransaction);
      }
    });

    return filtered;
  };

  const formatTransactionsWithCardNo = (transactionsList) => {
    let formattedRecords = [];
    cloneDeep(transactionsList).forEach((detail) => {
      const recordsWithCardNo = detail.records.map((record) => ({
        ...record,
        cardNo: detail.cardNumber,
        cardName: detail.cardName,
      }));
      formattedRecords = formattedRecords.concat(recordsWithCardNo);
    });
    return formattedRecords;
  };

  useEffect(() => {
    ownProps.getIcTransactionsWithCardNo().then((res) => {
      const transactionsListWithCardNo = formatTransactionsWithCardNo(
        res || []
      );
      setTransactions(transactionsListWithCardNo);
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

  const setTransHideStatus = (id: string, isHidden: boolean) => {
    setTransactions((filteredTransactions) =>
      cloneDeep(filteredTransactions).map((transaction) =>
        transaction.recordId === id ? { ...transaction, isHidden } : transaction
      )
    );
  };

  const hideICCardTransaction = (
    icRecordId: string,
    isHidden: boolean,
    cardNo: string
  ): void => {
    setTransHideStatus(icRecordId, isHidden);
    ownProps
      .hideICCardTransaction(cardNo, icRecordId, isHidden)
      .then((isSuccess) => {
        if (!isSuccess) setTransHideStatus(icRecordId, !isHidden);
      });
  };

  const onSelectRow = (e) => {
    const id = e.target.value;
    const transInfo = filteredTransactionList.find(
      ({ recordId }) => recordId === id
    );
    const action = ownProps?.recordId
      ? ownProps.setSelectedTransactions
      : ownProps.toggleSelectedTransaction;
    action(transInfo);
  };

  const filteredTransactionList = filterTransactions(
    transactions,
    ownProps.cardList,
    ownProps.selectedCardName,
    ownProps.detail
  );

  const icTransactions = () => {
    return filteredTransactionList.map((item) => {
      const {
        amount,
        paymentDate,
        cardName,
        detailDisplay,
        isHidden,
        isUsed,
        cardNo,
      } = item;

      const symbol = ownProps.baseCurrencySymbol || '';
      const amountWithComma = CurrencyUtil.convertToCurrency(amount);
      const amountWithSymbol = `${symbol} ${amountWithComma}`;
      return {
        transactionAmount: amountWithSymbol,
        transactionPaymentDate: paymentDate,
        transactionName: cardName,
        isArchived: isHidden,
        transactionDescription: detailDisplay,
        isClaimed: isUsed,
        transactionId: item.recordId,
        cardNo,
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
      value: ownProps.cardList
        .filter(({ cardNo }) => ownProps.selectedCardName.includes(cardNo))
        .map(({ cardName }) => cardName),
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
      onSelectRow={onSelectRow}
      selectedIds={ownProps.selectedIds}
      onClickBack={ownProps.onClickBack}
      onClickMainButton={
        isShowApplyBtn ? ownProps.onClickConfirm : ownProps.onClickNext
      }
      mainBtnLabel={isShowApplyBtn ? msg().Com_Lbl_Apply : ''}
      displayHint={!ownProps.recordId}
      onClickFilterItem={ownProps.onClickFilterItem}
      tags={filterList}
      transactionList={icTransactions()}
      hideCardTransaction={hideICCardTransaction}
    />
  );
};

const mapStateToProps = (state: State) => {
  const statusList = statusSelector(state);
  const selectedCardName = cardNameSelector(state);
  const requestDate = requestDateSelector(state);
  const detail = detailSelector(state);
  const selectedIds = state.expense.ui.icCard.selectedTransactions.map(
    ({ recordId }) => recordId
  );

  return {
    userSetting: state.userSetting,
    statusList,
    requestDate,
    selectedCardName,
    detail,
    baseCurrencySymbol: state.userSetting.currencySymbol,
    baseCurrencyCode: state.userSetting.currencyCode,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    baseCurrencyDecimal: state.userSetting.currencyDecimal,
    selectedICTransactions: state.expense.ui.icCard.selectedTransactions,
    cardList: state.expense.entities.icCard,
    selectedIds,
    transactions: state.expense.entities.icTransactions,
    formValues: state.expense.ui.general.formValues,
  };
};

const mapDispatchToProps = {
  getICTransactions,
  hideICCardTransaction,
  saveFormValue: formValueAction.save,
  setSelectedTransactions: selectedTransactionsActions.set,
  toggleSelectedTransaction: selectedTransactionsActions.toggle,
  clearSelectedTransactions: selectedTransactionsActions.clear,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickConfirm: () => {
    // link ic to record flow
    const selected = stateProps.selectedICTransactions[0];
    const { paymentDate, amount, recordId, cardName, cardNo, category } =
      selected;

    // update record with new IC info & recalc tax
    const recordCopy = cloneDeep(stateProps.formValues);

    const taxRate = recordCopy.items[0].taxRate || 0;
    const taxRes = calculateTax(
      taxRate,
      amount,
      stateProps.baseCurrencyDecimal,
      stateProps.taxRoundingSetting
    );

    const route = getRouteInfo(selected);
    const transitIcRecordInfo = { category, route };
    const extendedInfo = {
      amount,
      withoutTax: taxRes.amountWithoutTax,
      transitIcCardName: cardName,
      transitIcCardNo: cardNo,
      transitIcRecordId: recordId,
      recordDate: paymentDate,
      transitIcRecordInfo,
    };
    Object.assign(recordCopy, extendedInfo);
    recordCopy.items[0].recordDate = paymentDate;
    recordCopy.items[0].amount = amount;
    recordCopy.items[0].withoutTax = taxRes.amountWithoutTax;
    recordCopy.items[0].gstVat = taxRes.gstVat;

    dispatchProps.saveFormValue(recordCopy);
    const url = ownProps.reportId
      ? `/expense/record/detail/${ownProps.reportId}/${recordCopy.recordId}`
      : ownProps.recordId
      ? `/expense/record/detail/${recordCopy.recordId}`
      : '/expense/records/record/new/general';
    pushHistoryWithPrePage(ownProps.history, url);
  },

  onClickFilterItem: (key) => {
    pushHistoryWithPrePage(
      ownProps.history,
      '/expense/transaction/advance-search/detail',
      {
        key,
        card_type: CARD_TYPES.IC_CARD,
      }
    );
  },
  onClickNext: () => {
    const target =
      ownProps.reportId && ownProps.reportId !== 'undefined'
        ? 'report'
        : 'record';
    const path = `/expense/expense-type/list/${RECORD_TYPE.TransportICCardJP}`;
    pushHistoryWithPrePage(ownProps.history, path, { target });
  },
  getIcTransactionsWithCardNo: () => {
    const { salesId, customerId, companyId, employeeCode } =
      stateProps.userSetting;
    const checkIsStatusSelected = (
      status: string,
      selected: string[]
    ): boolean => selected.includes(status);
    const includeHidden = checkIsStatusSelected(
      STATUS_LIST.INCLUDED_ARCHIVED,
      stateProps.statusList
    );
    const includeUsed = checkIsStatusSelected(
      STATUS_LIST.INCLUDED_CLAIMED,
      stateProps.statusList
    );
    const { startDate, endDate } = requestDateConverter(stateProps.requestDate);

    return dispatchProps.getICTransactions(
      salesId,
      customerId,
      companyId,
      employeeCode,
      startDate,
      endDate,
      includeHidden,
      includeUsed
    );
  },
  hideICCardTransaction: (
    cardNo: string,
    icRecordId: string,
    isHidden: boolean
  ) => {
    const { salesId, customerId, companyId, employeeCode } =
      stateProps.userSetting;
    return (
      dispatchProps
        .hideICCardTransaction(
          salesId || '',
          customerId || '',
          employeeCode || '',
          companyId || '',
          cardNo || '',
          icRecordId || '',
          isHidden
        )
        // @ts-ignore
        .then((isSuccess: boolean) => isSuccess)
    );
  },
  onClickBack: () => {
    goBack(ownProps.history);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ICTransactionsContainer);
