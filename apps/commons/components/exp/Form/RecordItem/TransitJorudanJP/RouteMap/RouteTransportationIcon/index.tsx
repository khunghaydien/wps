import React from 'react';

import ImgIconTransportationAirplane from '../../../../../../../images/iconTransportationAirplane.png';
import ImgIconTransportationBulletTrain from '../../../../../../../images/iconTransportationBulletTrain.png';
import ImgIconTransportationBus from '../../../../../../../images/iconTransportationBus.png';
import ImgIconTransportationCar from '../../../../../../../images/iconTransportationCar.png';
import ImgIconTransportationShip from '../../../../../../../images/iconTransportationShip.png';
import ImgIconTransportationTrain from '../../../../../../../images/iconTransportationTrain.png';
import ImgIconTransportationWalk from '../../../../../../../images/iconTransportationWalk.png';

import './index.scss';

/**
 * 経路の移動手段のアイコンを表示する
 */
type Props = {
  lineType: string;
};

export default class RouteTransportationIcon extends React.Component<Props> {
  render() {
    switch (String(this.props.lineType)) {
      case '0':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="JR在来線"
            className="iconTransportationTrain"
          />
        );
      case '1':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="私鉄在来線"
            className="iconTransportationTrain"
          />
        );
      case '2':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="地下鉄"
            className="iconTransportationTrain"
          />
        );
      case '3':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="路面電車"
            className="iconTransportationTrain"
          />
        );
      case '4':
        return (
          <img
            src={ImgIconTransportationWalk}
            alt="徒歩"
            className="iconTransportationWalk"
          />
        );
      case '5':
        return (
          <img
            src={ImgIconTransportationBus}
            alt="バス"
            className="iconTransportationBus"
          />
        );
      case '6':
        return (
          <img
            src={ImgIconTransportationAirplane}
            alt="飛行機"
            className="iconTransportationAirplane"
          />
        );
      case '7':
        return (
          <img
            src={ImgIconTransportationShip}
            alt="船"
            className="iconTransportationShip"
          />
        );
      case '8':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="有料特急列車"
            className="iconTransportationTrain"
          />
        );
      case '9':
        return (
          <img
            src={ImgIconTransportationBulletTrain}
            alt="新幹線"
            className="iconTransportationBulletTrain"
          />
        );
      case '10':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="寝台列車"
            className="iconTransportationTrain"
          />
        );
      case '11':
        return (
          <img
            src={ImgIconTransportationTrain}
            alt="料急行列車"
            className="iconTransportationTrain"
          />
        );
      case '12':
        return (
          <img
            src={ImgIconTransportationBus}
            alt="高速バス"
            className="iconTransportationBus"
          />
        );
      case '13':
        return (
          <img
            src={ImgIconTransportationCar}
            alt="自動車"
            className="iconTransportationBus"
          />
        );
      case '14':
        return (
          <img
            src={ImgIconTransportationBus}
            alt="空港連絡バス"
            className="iconTransportationBus"
          />
        );
      default:
        return null;
    }
  }
}
