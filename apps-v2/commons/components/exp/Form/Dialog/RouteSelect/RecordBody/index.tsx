import React from 'react';

import classNames from 'classnames';

import { RouteItem } from '../../../../../../../domain/models/exp/jorudan/Route';

import FormatUtil from '../../../../../../utils/FormatUtil';
import ObjectUtil from '../../../../../../utils/ObjectUtil';

import msg from '../../../../../../languages';
import RouteTransportationIcon from '../../../RecordItem/TransitJorudanJP/RouteMap/RouteTransportationIcon';

import './index.scss';

const ROOT = 'ts-expenses-modal-route-contents-route-list__body';

type Props = {
  baseCurrencySymbol: string;
  item: RouteItem;
};

export default class RecordBody extends React.Component<Props> {
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

  // NOTE:折り返しを考慮し、出発駅と次の駅までの経路を1セットとして表示する
  render() {
    const { pathList, fareMap, expressMap } = this.props.item;
    const { baseCurrencySymbol } = this.props;
    return (
      <td className={ROOT}>
        <div className={`${ROOT}-wrap`}>
          {pathList.map((path, idx, array) => {
            const lastFareKey = idx === 0 ? '' : array[idx - 1].fareKey;
            const lastExpressKey = idx === 0 ? '' : array[idx - 1].expressKey;
            const { fare } = fareMap[path.fareKey];
            const isCommuterRoute = fareMap[path.fareKey].exceptCommuterRoute;
            const commuterRouteClass = isCommuterRoute
              ? ` ${ROOT}-box-hr--commuter`
              : '';
            const isAnotherCom = lastFareKey !== path.fareKey;
            const isAnotherExpress = lastExpressKey !== path.expressKey;
            const expressMapItem = ObjectUtil.getOrDefault(
              expressMap,
              path.expressKey,
              null
            );
            const hasExpress = isAnotherCom && expressMapItem;
            const stationCss = classNames({
              [`${ROOT}-box-station`]: true,
              [`${ROOT}-box-station--via`]: idx !== 0,
            });

            const { seatName, seatCode } = path;
            return (
              <div className={`${ROOT}-box`} key={path.key}>
                <div className={stationCss}>{path.fromName}</div>
                <hr className={`${ROOT}-box-hr${commuterRouteClass}`} />

                <div className={`${ROOT}-box-transportation`}>
                  <p className={`${ROOT}-box-transportation-title`}>
                    <RouteTransportationIcon lineType={path.lineType} />
                    {path.lineName}
                  </p>
                  <p className={`${ROOT}-map-fare`}>
                    {isAnotherCom
                      ? ` ${this.seatMap(
                          seatCode
                        )} ${baseCurrencySymbol}${FormatUtil.convertToIntegerString(
                          fare
                        )}`
                      : '→ '}
                    {isAnotherExpress && expressMapItem.fee
                      ? `（ ${seatName} ${baseCurrencySymbol}${FormatUtil.convertToIntegerString(
                          expressMapItem.fee
                        )} ）`
                      : ' '}
                  </p>
                  {hasExpress ? null : ''}
                </div>

                <hr className={`${ROOT}-box-hr${commuterRouteClass}`} />
              </div>
            );
          })}
          <div
            className={`${ROOT}-box`}
            key={`${pathList[pathList.length - 1].key}_to`}
          >
            <div className={`${ROOT}-box-station`}>
              {pathList[pathList.length - 1].toName}
            </div>
          </div>
        </div>
      </td>
    );
  }
}
