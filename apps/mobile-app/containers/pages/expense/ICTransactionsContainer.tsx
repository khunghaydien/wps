import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import TransactionList from '../../../components/pages/expense/commons/TransactionList';
import msg from '@apps/commons/languages';
import CurrencyUtil from '@apps/commons/utils/CurrencyUtil';
import DateUtil from '@apps/commons/utils/DateUtil';

import { RECORD_TYPE } from '@apps/domain/models/exp/Record';
import { calculateTax } from '@apps/domain/models/exp/TaxType';
import {
  CATEGORY_MAP,
  getRouteInfo,
} from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as formValueAction } from '../../../modules/expense/ui/general/formValues';
import { actions as selectedTransactionsActions } from '../../../modules/expense/ui/icCard/selectedTransactions';

type Props = RouteComponentProps & {
  reportId?: string;
  recordId?: string;
};

const ICTransactionsContainer = (ownProps: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  useEffect(() => {
    return () => {
      const isNavigateToExpType = get(
        ownProps.history,
        'location.pathname',
        ''
      ).includes('expense-type/list');
      if (!isNavigateToExpType) {
        dispatch(selectedTransactionsActions.clear());
      }
    };
  }, []);

  const selectedCard = useSelector(
    (state: State) => state.expense.ui.icCard.selectedCard
  );
  const selectedIds = useSelector((state: State) =>
    state.expense.ui.icCard.selectedTransactions.map((item) => item.recordId)
  );
  const transactions = useSelector((state: State) => {
    const transBySelectedCard = state.expense.entities.icTransactions.filter(
      ({ cardNumber }) => cardNumber === selectedCard
    );
    let trans = get(transBySelectedCard, '0.records', []);
    trans = trans.map((item) => ({ ...item, cardNo: selectedCard }));
    return trans;
  });

  const selectedICTransactions = useSelector(
    (state: State) => state.expense.ui.icCard.selectedTransactions
  );

  const baseCurrencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const baseCurrencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const taxRoundingSetting = useSelector(
    (state: State) => state.userSetting.expTaxRoundingSetting
  );
  const formValues = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );

  const onSelectRow = useCallback(
    (e) => {
      const id = e.target.value;
      const transInfo = transactions.find(({ recordId }) => recordId === id);
      const action = ownProps.recordId
        ? selectedTransactionsActions.set
        : selectedTransactionsActions.toggle;
      dispatch(action(transInfo));
    },
    [dispatch, transactions]
  );
  const onClickConfirm = useCallback(() => {
    // link ic to record flow
    const selected = selectedICTransactions[0];
    const { paymentDate, amount, recordId, cardNo, category } = selected;

    // update record with new IC info & recalc tax
    const recordCopy = cloneDeep(formValues);

    const taxRate = recordCopy.items[0].taxRate || 0;
    const taxRes = calculateTax(
      taxRate,
      amount,
      baseCurrencyDecimal,
      taxRoundingSetting
    );

    const route = getRouteInfo(selected);
    const transitIcRecordInfo = { category, route };
    const extendedInfo = {
      amount,
      withoutTax: taxRes.amountWithoutTax,
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

    dispatch(formValueAction.save(recordCopy));
    const url = ownProps.reportId
      ? `/expense/record/detail/${ownProps.reportId}/${recordCopy.recordId}`
      : `/expense/record/detail/${recordCopy.recordId}`;
    pushHistoryWithPrePage(ownProps.history, url);
  }, [ownProps.history, selectedICTransactions, formValues, ownProps.reportId]);

  const onClickNext = useCallback(() => {
    const target =
      ownProps.reportId && ownProps.reportId !== 'undefined'
        ? 'report'
        : 'record';
    const path = `/expense/expense-type/list/${RECORD_TYPE.TransportICCardJP}`;
    pushHistoryWithPrePage(ownProps.history, path, { target });
  }, [ownProps.history, selectedIds, ownProps.reportId]);

  const onClickBack = useCallback(() => {
    goBack(ownProps.history);
  }, [ownProps.history]);

  const icTransactions = useMemo(() => {
    const trans = transactions.map((item) => {
      const { category, amount, paymentDate } = item;
      const msgKey = category ? CATEGORY_MAP[category] : '';
      const categoryName = msg()[msgKey];
      const routeDisplay = get(item, 'route') || getRouteInfo(item);
      const symbol = baseCurrencySymbol || '';
      const amountWithComma = CurrencyUtil.convertToCurrency(amount);
      const content = (
        <div className="content" data-id={item.recordId}>
          <div className="top">
            <span>{categoryName}</span>
            <span>
              {symbol} {amountWithComma}
            </span>
          </div>
          <div className="bottom">
            <span className="description">{routeDisplay}</span>
            <span>{DateUtil.dateFormat(paymentDate)}</span>
          </div>
        </div>
      );
      return content;
    });
    return trans;
  }, [transactions, baseCurrencySymbol]);

  return (
    <TransactionList
      rowContent={icTransactions}
      onSelectRow={onSelectRow}
      selectedIds={selectedIds}
      onClickBack={onClickBack}
      onClickMainButton={ownProps.recordId ? onClickConfirm : onClickNext}
      mainBtnLabel={ownProps.recordId && msg().Com_Lbl_Apply}
      displayHint={!ownProps.recordId}
    />
  );
};

export default ICTransactionsContainer;
