import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import CardList from '../../../components/pages/expense/commons/CardList';
import msg from '@apps/commons/languages';

import { getMobileInitDates } from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as selectedIcCardActions } from '../../../modules/expense/ui/icCard/selectedCard';
import { actions as selectedTransactionsActions } from '../../../modules/expense/ui/icCard/selectedTransactions';

import { getICTransactions } from '../../../action-dispatchers/expense/ICCard';

type Props = RouteComponentProps & {
  reportId?: string;
  recordId?: string;
};

const ICCardListContainer = (ownProps: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const userSetting = useSelector((state: State) => state.userSetting);

  const icCardList = useSelector(
    (state: State) => state.expense.entities.icCard
  );

  const onClickBack = useCallback(() => {
    goBack(ownProps.history);
  }, [ownProps.history]);

  const onClickRow = useCallback(
    (cardNo) => {
      const { salesId, customerId, companyId, employeeCode } = userSetting;
      dispatch(selectedIcCardActions.set(cardNo));
      dispatch(selectedTransactionsActions.clear());

      const dates = getMobileInitDates();
      dispatch(
        getICTransactions(
          salesId,
          customerId,
          companyId,
          employeeCode,
          dates.startDate,
          dates.endDate
        )
      )
        // @ts-ignore
        .then(() => {
          pushHistoryWithPrePage(
            ownProps.history,
            `/expense/ic-card/transactions/${ownProps.reportId}/${ownProps.recordId}`
          );
        });
    },
    [userSetting, dispatch, ownProps.history]
  );

  return (
    <CardList
      title={msg().Exp_Lbl_SelectIcCard}
      cardList={icCardList}
      onClickRow={onClickRow}
      onClickBack={onClickBack}
    />
  );
};

export default ICCardListContainer;
