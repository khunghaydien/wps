import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { State } from '../../../modules';
import { UI_TYPE } from '../../../modules/expense/pages/routeFormPage';

import { searchRouteWithParam } from '../../../action-dispatchers/expense/RouteSearch';

import RouteListPage from '../../../components/pages/expense/Route/List';

type OwnProps = RouteComponentProps & {
  type: string;
  reportId?: string;
  recordId?: string;
};

const RouteListContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const baseCurrencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const routeFormParams = useSelector(
    (state: State) => state.expense.pages.routeFormPage
  );
  const routeResults = useSelector(
    (state: State) => state.expense.entities.routeResults
  );
  const defaultRouteOptions = useSelector(
    (state: State) => state.expense.pages.defaultRouteOptions
  );

  useEffect(() => {
    // if cache results exist, do not call api again.
    if (!routeResults.route.storeData) {
      dispatch(searchRouteWithParam(routeFormParams))
        // @ts-ignore
        .then((hasResults) => {
          if (!hasResults) {
            goBack(ownProps.history);
          }
        });
    }
  }, []);

  const onClickBackButton = () => {
    const { recordId, reportId } = ownProps;
    let target = get(ownProps.history, 'location.state.target');
    target = ownProps.reportId ? 'report' : target;

    if (ownProps.type === UI_TYPE.ADD) {
      ownProps.history.push(`/expense/report/route/new`, { target });
    } else if (ownProps.type === UI_TYPE.REPORT) {
      ownProps.history.push(
        `/expense/report/route/edit/${recordId}/${reportId}`,
        { target }
      );
    } else {
      ownProps.history.push(`/expense/route/new`, { target });
    }
  };

  const onClickListItem = (routeNo: number) => {
    const { recordId, reportId, history, type } = ownProps;
    let target = get(ownProps.history, 'location.state.target');
    target = ownProps.reportId ? 'report' : target;

    if (type === UI_TYPE.ADD) {
      pushHistoryWithPrePage(
        history,
        `/expense/report/route/list/item/${routeNo}`,
        { target }
      );
    } else if (type === UI_TYPE.REPORT) {
      history.push(`/expense/record/jorudan-detail/${recordId}/${reportId}`, {
        target,
        routeNo,
      });
    }
  };

  return (
    <RouteListPage
      routeResults={routeResults}
      defaultRouteOptions={defaultRouteOptions}
      routeFormParams={routeFormParams}
      baseCurrencySymbol={baseCurrencySymbol}
      onClickListItem={onClickListItem}
      onClickBackButton={onClickBackButton}
    />
  );
};

export default RouteListContainer;
