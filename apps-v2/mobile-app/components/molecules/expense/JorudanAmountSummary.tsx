import React from 'react';

import msg from '../../../../commons/languages';

import {
  includeEXReservation,
  RouteItem,
} from '../../../../domain/models/exp/jorudan/Route';

import Amount from '../../atoms/Amount';
import JorudanStatusChips from './JorudanStatusChips';

import './JorudanAmountSummary.scss';

const ROOT = 'mobile-app-molecules-expense-jorudan-amount-summary';

type Props = {
  baseCurrencySymbol: string;
  route?: RouteItem;
  isRoundTrip: boolean;
};

const JorudanAmountSummary = (props: Props) => {
  const { route, baseCurrencySymbol } = props;

  if (!route) {
    return null;
  }

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__amount`}>
        <div className={`${ROOT}__amount__single-trip`}>
          <Amount
            amount={route.cost}
            decimalPlaces={0}
            symbol={baseCurrencySymbol}
          />
        </div>
        <div className={`${ROOT}__amount__round-trip`}>
          ({msg().Exp_Lbl_RoundTrip}:
          <Amount
            className={`${ROOT}__amount__round-trip-text`}
            amount={route.roundTripCost}
            decimalPlaces={0}
            symbol={baseCurrencySymbol}
          />
          )
        </div>
      </div>
      <JorudanStatusChips
        isEarliest={route.status.isEarliest}
        isCheapest={route.status.isCheapest}
        isMinTransfer={route.status.isMinTransfer}
        isIncludeEx={includeEXReservation(route)}
        isRoundTrip={props.isRoundTrip}
      />
      {route.existsIcCost && (
        <div className={`${ROOT}-fare-type`}>
          {msg().Exp_Lbl_RouteOptionFareType_IC}
        </div>
      )}
    </div>
  );
};

export default JorudanAmountSummary;
