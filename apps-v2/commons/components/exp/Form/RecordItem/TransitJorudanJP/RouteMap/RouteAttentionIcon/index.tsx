import React from 'react';

import {
  includeEXReservation,
  RouteItem,
} from '../../../../../../../../domain/models/exp/jorudan/Route';

import msg from '../../../../../../../languages';

import './index.scss';

const ROOT = 'ts-route-map__attention-icon';

type Props = {
  isApproval?: boolean;
  isRoundTrip?: boolean;
  item: RouteItem;
};

export default class RouteAttentionIcon extends React.Component<Props> {
  renderIcon(status: boolean, iconClass: string, text: string) {
    if (!status) {
      return null;
    }
    if (
      text !== msg().Exp_Lbl_RouteExUsed &&
      includeEXReservation(this.props.item)
    ) {
      return null;
    }
    return <li className={iconClass}>{text}</li>;
  }

  render() {
    const { item, isApproval } = this.props;

    return (
      <ul className={ROOT}>
        {this.renderIcon(
          item.status.isCheapest,
          `${ROOT}--cheap`,
          msg().Exp_Lbl_RouteIconCheap
        )}
        {this.renderIcon(
          item.status.isEarliest,
          `${ROOT}--fast`,
          msg().Exp_Lbl_RouteIconFast
        )}
        {this.renderIcon(
          item.status.isMinTransfer,
          `${ROOT}--easy`,
          msg().Exp_Lbl_RouteIconEasy
        )}
        {!isApproval && (
          <>
            {this.renderIcon(
              includeEXReservation(item),
              `${ROOT}--ex`,
              msg().Exp_Lbl_RouteExUsed
            )}
            {this.renderIcon(
              item.existsIcCost,
              `${ROOT}--ic`,
              msg().Exp_Lbl_RouteIconIcCard
            )}
          </>
        )}
        {this.renderIcon(
          this.props.isRoundTrip || false,
          `${ROOT}--round`,
          msg().Exp_Lbl_RouteIconRoundTrip
        )}
      </ul>
    );
  }
}
