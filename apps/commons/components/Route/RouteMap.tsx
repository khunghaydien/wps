import React from 'react';

import { findLast, findLastIndex, isEmpty } from 'lodash';

import {
  Path,
  RouteItem,
  RouteItemStatus,
} from '../../../domain/models/exp/jorudan/Route';

import FormatUtil from '../../utils/FormatUtil';

import ImgIconHayai from '../../images/iconHayai.png';
import ImgIconRaku from '../../images/iconRaku.png';
import ImgIconRouteFrom from '../../images/iconRouteFrom.png';
import ImgIconRouteTo from '../../images/iconRouteTo.png';
import ImgIconRouteVia from '../../images/iconRouteVia.png';
import ImgIconYasui from '../../images/iconYasui.png';
import RouteTransportationIcon from './RouteTransportationIcon';

import './RouteMap.scss';

/**
 * 経路情報の設定されたレコードが選択された際に経路情報を出力する
 * 日本語専用のコンポーネントで他の言語では利用しない
 * NOTE: 日本語の直打ちの部分について日本語以外に対応する予定がないためこのままとする
 */
type Props = {
  isEditing: boolean;
  selectedRoute?: RouteItem;
};
export default class RouteMap extends React.Component<Props> {
  renderTransration = (item: Path, idx: number, arrival: boolean) => {
    if (arrival) {
      return null;
    }

    return (
      <div className="value slds-grid ts-route-map__route-info">
        <span className="ts-route-map__route-info__line" />
        <div className="slds-col slds-align-middle slds-size--1-of-12" />
        <div className="slds-col slds-align-middle slds-size--1-of-12">
          <RouteTransportationIcon lineType={item.lineType} />
        </div>
        <div className="slds-col slds-align-middle slds-size--8-of-12">
          {item.lineName}
        </div>
        {this.renderFare(item, idx)}
      </div>
    );
  };

  renderStation = (item: Path, idx: number, arrival: boolean) => {
    let routeIcon = null;
    let routeClassName = 'slds-grid ts-route-map__station';

    if (idx === 0) {
      routeIcon = <img src={ImgIconRouteFrom} alt="出発" />;
      routeClassName += ' from';
    } else if (arrival) {
      routeIcon = <img src={ImgIconRouteTo} alt="到着" />;
    } else {
      routeIcon = <img src={ImgIconRouteVia} alt="経由" />;
    }

    return (
      <div className={routeClassName}>
        <div className="slds-col slds-align-middle slds-size--1-of-12 ts-route-map__station__icon">
          {routeIcon}
        </div>
        <div className="slds-col slds-align-middle slds-size--11-of-12 ts-route-map__station__name">
          {arrival ? item.toName : item.fromName}
        </div>
      </div>
    );
  };

  renderRoute = (item: Path, idx: number, arrival: boolean) => (
    <div key={idx}>
      {this.renderStation(item, idx, arrival)}
      {this.renderTransration(item, idx, arrival)}
    </div>
  );

  renderAttentionIcon = (status: RouteItemStatus) => (
    <div className="value slds-grid">
      <div className="slds-col slds-size--12-of-12 ts-route-map__attention-icon">
        {status.isCheapest ? <img src={ImgIconYasui} alt="安" /> : null}
        {status.isEarliest ? <img src={ImgIconHayai} alt="早" /> : null}
        {status.isMinTransfer ? <img src={ImgIconRaku} alt="楽" /> : null}
      </div>
    </div>
  );

  // TODO: 徒歩の場合、priceが0なのかundefinedになるかを確認
  // TODO: 選択された情報の保持方法は特急なのか？
  renderFare(item: Path, idx: number) {
    if (
      isEmpty(this.props.selectedRoute) ||
      isEmpty(this.props.selectedRoute.pathList)
    ) {
      return null;
    }
    // NOTE :直前の経路情報と同じ支払いキー（乗り換えはあっても支払いが発生しない）

    const { pathList, fareMap, expressMap } = this.props.selectedRoute;
    const lastFareKey = idx === 0 ? '' : pathList[idx - 1].fareKey;
    if (lastFareKey === item.fareKey) {
      return (
        <div className="slds-col slds-align-middle slds-size--2-of-12 slds-text-align--center">
          ( ↓ )
        </div>
      );
    } else {
      const fare = fareMap[item.fareKey].fare;
      // NOTE: 特急がない路線（山手線等）の場合は0が設定される
      const fee = expressMap[item.expressKey].fee;

      return (
        <div className="slds-col slds-align-middle slds-size--2-of-12 right">
          {fare !== 0
            ? `${FormatUtil.convertToIntegerString(fare + fee)} 円`
            : ''}
        </div>
      );
    }
  }

  render() {
    const { selectedRoute, isEditing } = this.props;
    if (
      isEmpty(selectedRoute) ||
      isEmpty(selectedRoute.pathList) ||
      isEditing
    ) {
      return null;
    }
    // NOTE:経路情報は１つの要素に出発駅と到着駅の情報を持っており、最後の経路情報から到着駅を取得する。

    return (
      <div className="slds-grid ts-route-map">
        <div className="slds-col slds-size--3-of-12 slds-align-middle" />
        <div className="slds-col slds-size--9-of-12 slds-align-middle">
          {this.renderAttentionIcon(selectedRoute.status)}
          {selectedRoute.pathList.map((item, idx) =>
            this.renderRoute(item, idx, false)
          )}
          {this.renderRoute(
            findLast(selectedRoute.pathList),
            findLastIndex(selectedRoute.pathList),
            true
          )}
        </div>
      </div>
    );
  }
}
