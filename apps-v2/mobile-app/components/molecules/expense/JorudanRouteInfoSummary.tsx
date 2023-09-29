import * as React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import {
  includeEXReservation,
  RouteItem,
} from '../../../../domain/models/exp/jorudan/Route';
import { RouteInfo } from '../../../../domain/models/exp/Record';

import JorudanStatusChips from './JorudanStatusChips';

import './JorudanRouteInfoSummary.scss';

const ROOT = 'mobile-app-molecules-expense-jorudan-route-info-summary';

type Props = Readonly<{
  className?: string;
  routeInfo: RouteInfo;
}>;

export default class JorudanRouteInfoSummary extends React.Component<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const {
      origin,
      arrival,
      selectedRoute = {} as RouteItem,
      roundTrip,
    } = this.props.routeInfo;

    return (
      <div className={className}>
        <div className={`${ROOT}__from-to`}>
          {(!isNil(origin) && origin.name) || ''}-
          {(!isNil(arrival) && arrival.name) || ''}
        </div>
        <div className={`${ROOT}__status`}>
          {!isNil(selectedRoute) && !isNil(selectedRoute.status) && (
            <JorudanStatusChips
              isEarliest={selectedRoute.status.isEarliest || false}
              isCheapest={selectedRoute.status.isCheapest || false}
              isMinTransfer={selectedRoute.status.isMinTransfer || false}
              isIncludeEx={includeEXReservation(selectedRoute) || false}
              isRoundTrip={roundTrip}
            />
          )}
        </div>
      </div>
    );
  }
}
