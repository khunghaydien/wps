import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import { goBack } from '@mobile/concerns/routingHistory';

import TransactionList from '../../../components/pages/expense/commons/TransactionList';
import CurrencyUtil from '@apps/commons/utils/CurrencyUtil';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import { showAlert } from '@apps/mobile-app/modules/commons/alert';
import msg from '@commons/languages';

import { RECORD_TYPE } from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';
import { actions as selectedCCTransactionsActions } from '../../../modules/expense/ui/creditCard/selectedTransactions';

import IconButton from '@mobile/components/atoms/IconButton';

type Props = RouteComponentProps & {
  reportId: string;
};

const CCTransactionsContainer = (ownProps: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  useEffect(() => {
    return () => {
      const isNavigateToExpType = get(
        ownProps.history,
        'location.pathname',
        ''
      ).includes('expense-type/list');
      if (!isNavigateToExpType) {
        dispatch(selectedCCTransactionsActions.clear());
      }
    };
  }, []);

  const selectedIds = useSelector((state: State) =>
    state.expense.ui.creditCard.selectedTransactions.map((item) => item.id)
  );
  const transactions = useSelector(
    (state: State) => state.expense.entities.ccTransactions
  );

  const baseCurrencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );

  const onSelectRow = useCallback(
    (e) => {
      const transId = e.target.value;
      const transInfo = transactions.find(({ id }) => id === transId);
      dispatch(selectedCCTransactionsActions.toggle(transInfo));
    },
    [dispatch, transactions]
  );

  const onClickApply = useCallback(() => {
    const target =
      ownProps.reportId && ownProps.reportId !== 'undefined'
        ? 'report'
        : 'record';
    ownProps.history.push(`/expense/expense-type/list/${RECORD_TYPE.General}`, {
      target,
    });
  }, [ownProps.history, selectedIds, ownProps.reportId]);

  const onClickBack = useCallback(() => {
    goBack(ownProps.history);
  }, [ownProps.history]);

  const ccTransactions = useMemo(() => {
    const trans = transactions.map((item) => {
      const {
        merchantName,
        amount,
        transactionDescription,
        transactionDate,
        cardNameL,
        cardAssociation,
        cardNumber,
        reimbursementFlag,
      } = item;
      const symbol = baseCurrencySymbol || '';
      const amountWithComma = CurrencyUtil.convertToCurrency(amount);
      const cardInfo = TextUtil.nl2br(
        `${cardNameL}\n${cardAssociation} **** ${cardNumber}` +
          (reimbursementFlag ? '\n' + msg().Exp_Lbl_ReimbursementTooltip : '')
      );
      const content = (
        <div className="content" data-id={item.id}>
          <div className="top">
            <span>{cardNameL}</span>
            <span>
              <IconButton
                className="info-icon"
                icon="info_alt"
                onClick={() => {
                  dispatch(showAlert(cardInfo));
                }}
              />
            </span>
          </div>
          <div className="top">
            <span>{merchantName}</span>
            <span>
              {symbol} {amountWithComma}
            </span>
          </div>
          <div className="bottom">
            <span className="description">{transactionDescription}</span>
            <span>{DateUtil.dateFormat(transactionDate)}</span>
          </div>
        </div>
      );
      return content;
    });
    return trans;
  }, [transactions, baseCurrencySymbol]);

  return (
    <TransactionList
      rowContent={ccTransactions}
      onSelectRow={onSelectRow}
      selectedIds={selectedIds}
      onClickBack={onClickBack}
      onClickMainButton={onClickApply}
    />
  );
};

export default CCTransactionsContainer;
