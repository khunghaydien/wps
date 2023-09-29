import React from 'react';

import get from 'lodash/get';

import msg from '../../../../../../commons/languages';
import FormatUtil from '../../../../../../commons/utils/FormatUtil';
import Navigation from '../../../../molecules/commons/Navigation';

import { includeEXReservation } from '../../../../../../domain/models/exp/jorudan/Route';

import Wrapper from '../../../../atoms/Wrapper';
import JorudanListItem from '../../../../molecules/expense/JorudanListItem';
import { RouteFormValues } from '../New';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-route-result';

type Props = {
  routeResults: any;
  defaultRouteOptions: any;
  routeFormParams: RouteFormValues;
  baseCurrencySymbol: string;
  onClickListItem: (index: number) => void;
  onClickBackButton: () => void;
};

const RouteList = (props: Props) => {
  const {
    baseCurrencySymbol,
    routeResults,
    routeFormParams: { origin, viaList, arrival },
  } = props;
  const routeLists = get(routeResults, 'route.routeList');

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_SelectRoute}
        backButtonLabel={msg().Com_Lbl_Back}
        onClickBack={props.onClickBackButton}
      />
      <div className="main-content">
        <div className={`${ROOT}__title`}>
          <div className={`${ROOT}__journey`}>
            <span className={`${ROOT}__to`}>{origin && origin.name}</span>
            {viaList &&
              viaList.map((via, index) => {
                return (
                  via.name && (
                    <span key={index} className={`${ROOT}__via`}>
                      {via.name}
                    </span>
                  )
                );
              })}
            <span className={`${ROOT}__from`}>{arrival && arrival.name}</span>
          </div>
          {props.defaultRouteOptions.jorudanFareType === '1' && (
            <div className={`${ROOT}__fare-type`}>
              {msg().Exp_Lbl_RouteOptionFareType_IC}
            </div>
          )}
        </div>
        {routeLists &&
          routeLists.map((route, index) => {
            return (
              <JorudanListItem
                key={index}
                onClick={() => props.onClickListItem(index)}
                lineNames={route.pathList.map((path) => {
                  return path.lineName;
                })}
                amount={`${baseCurrencySymbol} ${FormatUtil.convertToIntegerString(
                  route.cost
                )}`}
                returnAmount={`(${
                  msg().Exp_Lbl_RoundTrip
                }: ${baseCurrencySymbol}${FormatUtil.convertToIntegerString(
                  route.roundTripCost
                )})`}
                fast={route.status.isEarliest}
                cheap={route.status.isCheapest}
                easy={route.status.isMinTransfer}
                isIncludeEx={includeEXReservation(route)}
              />
            );
          })}
      </div>
    </Wrapper>
  );
};

export default RouteList;
