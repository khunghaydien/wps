import React from 'react';

import classNames from 'classnames';

// style
import '../../../commons/components/exp/Form/Dialog/RouteSelect/RecordBody/index.scss';
// images
import RouteTransportationIcon from '../../../commons/components/Route/RouteTransportationIcon';
import FormatUtil from '../../../commons/utils/FormatUtil';
// common utils
import ObjectUtil from '../../../commons/utils/ObjectUtil';

// prop types
import { RouteItem } from '../../../domain/models/exp/jorudan/Route';

const ROOT = 'ts-expenses-modal-route-contents-route-list__body';

type Props = {
  item: RouteItem;
};

const CommuterRouteRecordBody = (props: Props) => {
  const { pathList, fareMap, expressMap } = props.item;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}-wrap`}>
        {pathList.map((path, idx, array) => {
          const lastFareKey = idx === 0 ? '' : array[idx - 1].fareKey;
          const lastExpressKey = idx === 0 ? '' : array[idx - 1].expressKey;
          const fare = fareMap[path.fareKey].fare;
          const isAnotherCom = lastFareKey !== path.fareKey;
          const isAnotherExpress = lastExpressKey !== path.expressKey;
          const expressMapItem = ObjectUtil.getOrDefault(
            expressMap,
            path.expressKey,
            null
          );
          const stationCss = classNames({
            [`${ROOT}-box-station`]: true,
            [`${ROOT}-box-station--via`]: idx !== 0,
          });

          const seatName = path.seatName;

          return (
            <div className={`${ROOT}-box`} key={path.key}>
              <div className={stationCss}>{path.fromName}</div>
              <hr className={`${ROOT}-box-hr`} />

              <div className={`${ROOT}-box-transportation`}>
                <p className={`${ROOT}-box-transportation-title`}>
                  <RouteTransportationIcon lineType={path.lineType} />
                  {path.lineName}
                </p>
                <p className={`${ROOT}-map-fare`}>
                  {isAnotherCom
                    ? ` ￥${FormatUtil.convertToIntegerString(fare)}`
                    : '→ '}
                  {isAnotherExpress && expressMapItem && expressMapItem.fee
                    ? `（ ${seatName} ￥${FormatUtil.convertToIntegerString(
                        expressMapItem.fee
                      )} ）`
                    : ' '}
                </p>
              </div>
              <hr className={`${ROOT}-box-hr`} />
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
    </div>
  );
};

export default CommuterRouteRecordBody;
