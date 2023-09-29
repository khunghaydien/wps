import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import {
  Path,
  RouteItem,
} from '../../../../../../../domain/models/exp/jorudan/Route';
import { RouteInfo } from '../../../../../../../domain/models/exp/Record';

import FormatUtil from '../../../../../../utils/FormatUtil';
import TextUtil from '../../../../../../utils/TextUtil';

import ImgIconRouteVia from '../../../../../../images/iconRouteVia.png';
import msg from '../../../../../../languages';
import RouteAttentionIcon from './RouteAttentionIcon';
import RouteTransportationIcon from './RouteTransportationIcon';

import './index.scss';

const ROOT = 'ts-route-map';

type Props = {
  baseCurrencySymbol: string;
  mobile?: boolean;
  routeInfo?: RouteInfo;
};

export default class RouteMap extends React.Component<Props> {
  seatMap = (seat: string): string => {
    switch (seat) {
      case 'ICS':
        return msg().Exp_Lbl_RouteExShiteiseki;
      case 'ICF':
        return msg().Exp_Lbl_RouteExJiyuuseki;
      case 'ICG':
        return msg().Exp_Lbl_RouteExGreen;
      default:
        return '';
    }
  };

  renderTrainLine(item: Path, idx: number, arrival: boolean) {
    if (arrival) {
      return null;
    }

    const isCommuterRoute = _.get(
      this.props.routeInfo,
      `selectedRoute.fareMap.${item.fareKey}.exceptCommuterRoute`
    );
    const commuterRouteClass = isCommuterRoute
      ? ` ${ROOT}-route-info-line--commuter`
      : '';

    return (
      <div className={`${ROOT}-route-info`}>
        <span className={`${ROOT}-route-info-line${commuterRouteClass}`} />
        <div className={`${ROOT}-route-info-line-info`}>
          <div className={`${ROOT}-route-info-line-icon`}>
            <RouteTransportationIcon lineType={item.lineType} />
            &nbsp; {this.renderTransTypeName(item.lineType)}
          </div>
          <div className={`${ROOT}-route-info-line-info-name-fare-wrapper`}>
            <div className={`${ROOT}-route-info-line-info-name`}>
              {item.lineName}
            </div>
            {this.renderFare(item, idx)}
          </div>
        </div>
      </div>
    );
  }

  renderTransTypeName(lineType: string) {
    switch (lineType.toString()) {
      case '0':
        return msg().Exp_Lbl_TransTypeNameJROrdinaryLine;
      case '1':
        return msg().Exp_Lbl_TransTypeNamePrivateOrdinaryLine;
      case '2':
        return msg().Exp_Lbl_TransTypeNameSubway;
      case '3':
        return msg().Exp_Lbl_TransTypeNameTram;
      case '4':
        return msg().Exp_Lbl_TransTypeNameWalk;
      case '5':
        return msg().Exp_Lbl_TransTypeNameBus;
      case '6':
        return msg().Exp_Lbl_TransTypeNameAirline;
      case '7':
        return msg().Exp_Lbl_TransTypeNameFerry;
      case '8':
        return msg().Exp_Lbl_TransTypeNamePremierExpressTrain;
      case '9':
        return msg().Exp_Lbl_TransTypeNameShinkansen;
      case '10':
        return msg().Exp_Lbl_TransTypeNameSleeperTrain;
      case '11':
        return msg().Exp_Lbl_TransTypeNameExpressTrain;
      case '12':
        return msg().Exp_Lbl_TransTypeNameHighwayBus;
      case '13':
        return msg().Exp_Lbl_TransTypeNameCar;
      case '14':
        return msg().Exp_Lbl_TransTypeNameAirportBus;
      default:
        return null;
    }
  }

  renderStation(item: Path, idx: number, arrival: boolean) {
    let routeIcon = null;
    let stationClassName = `${ROOT}-station`;

    if (this.props.mobile && (idx === 0 || arrival)) {
      stationClassName = classNames(
        `${ROOT}-station`,
        `${ROOT}-station--origin-arrival`
      );
    } else {
      routeIcon = (
        <div className={`${ROOT}-station-icon`}>
          <img src={ImgIconRouteVia} alt="経由" />
        </div>
      );
    }

    return (
      <div className={stationClassName}>
        {routeIcon}
        <div className={`${ROOT}-station-name`}>
          {arrival ? item.toName : item.fromName}
        </div>
      </div>
    );
  }

  renderRoute(item: Path, idx: number, arrival: boolean) {
    return (
      <div key={idx}>
        {this.renderStation(item, idx, arrival)}
        {this.renderTrainLine(item, idx, arrival)}
      </div>
    );
  }

  // TODO: 徒歩の場合、priceが0なのかundefinedになるかを確認
  // TODO: 選択された情報の保持方法は特急なのか？
  renderFare(item: Path, idx: number) {
    if (!this.props.routeInfo || !this.props.routeInfo.selectedRoute) {
      return null;
    }
    // NOTE :直前の経路情報と同じ支払いキー（乗り換えはあっても支払いが発生しない）
    const lastFareKey =
      idx === 0
        ? ''
        : this.props.routeInfo.selectedRoute.pathList[idx - 1].fareKey;
    const lastExpressKey =
      idx === 0
        ? ''
        : this.props.routeInfo.selectedRoute.pathList[idx - 1].expressKey;
    const fee =
      this.props.routeInfo.selectedRoute.expressMap[item.expressKey].fee;
    const fare = this.props.routeInfo.selectedRoute.fareMap[item.fareKey].fare;
    const isAnotherCom = lastFareKey !== item.fareKey;
    const isAnotherExpress = lastExpressKey !== item.fareKey;
    const selectedSeat =
      this.props.routeInfo.selectedRoute.pathList[idx].seatName;

    return (
      <div className={`${ROOT}-route-info-line-info-fare`}>
        {isAnotherCom
          ? ` ${this.seatMap(item.seatCode)} ${
              this.props.baseCurrencySymbol
            }${FormatUtil.convertToIntegerString(fare)}`
          : '( ↓ ) '}
        {isAnotherExpress && fee !== 0 ? (
          <span className={`${ROOT}-route-info-line-info-fare-fee`}>
            {`（ ${selectedSeat} ${this.props.baseCurrencySymbol}         
              ${FormatUtil.convertToIntegerString(fee)} ）`}
          </span>
        ) : (
          ' '
        )}
      </div>
    );
  }

  renderDistance(distance?: number) {
    if (distance === null || distance === undefined) {
      return null;
    }
    return (
      <div className={`${ROOT}-header-area-distance`}>
        {TextUtil.template(msg().Exp_Lbl_RouteDistance, distance)}
      </div>
    );
  }

  renderHeader(routeInfo: RouteInfo, selectedRoute: RouteItem) {
    if (this.props.mobile) {
      return (
        <div className={`${ROOT}-header-area`}>
          {this.renderDistance(selectedRoute.distance)}
        </div>
      );
    }
    return (
      <div className={`${ROOT}-header-area`}>
        <RouteAttentionIcon
          item={selectedRoute}
          isRoundTrip={routeInfo.roundTrip}
        />
        {this.renderDistance(selectedRoute.distance)}
      </div>
    );
  }

  render() {
    const { routeInfo } = this.props;
    if (!routeInfo) {
      return null;
    }
    const { selectedRoute } = routeInfo;
    if (!selectedRoute) {
      return null;
    }
    // NOTE:経路情報は１つの要素に出発駅と到着駅の情報を持っており、最後の経路情報から到着駅を取得する。
    const lastIdx = selectedRoute.pathList.length - 1;
    const lastPath = selectedRoute.pathList[lastIdx];

    const className = classNames(ROOT, {
      [`${ROOT}--mobile`]: this.props.mobile,
    });

    return (
      <div className={className} data-testid={ROOT}>
        {this.renderHeader(routeInfo, selectedRoute)}
        {selectedRoute.pathList.map((item: Path, idx: number) => {
          return this.renderRoute(item, idx, false);
        })}
        {this.renderRoute(lastPath, lastIdx, true)}
      </div>
    );
  }
}
