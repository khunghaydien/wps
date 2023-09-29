import React from 'react';

import { RouteItem } from '../../../../../../../domain/models/exp/jorudan/Route';

import FormatUtil from '../../../../../../utils/FormatUtil';

import msg from '../../../../../../languages';
import RouteAttentionIcon from '../../../RecordItem/TransitJorudanJP/RouteMap/RouteAttentionIcon';

import './index.scss';

const ROOT = 'ts-expenses-modal-route-contents-route-list__header';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
type Props = {
  baseCurrencySymbol: string;
  item: RouteItem;
};

export default class RecordHeader extends React.Component<Props> {
  renderIcon(status: boolean, iconClass: string, text: string) {
    if (!status) {
      return null;
    }
    return <li className={iconClass}>{text}</li>;
  }

  render() {
    const { item, baseCurrencySymbol } = this.props;
    return (
      <td className={ROOT}>
        <div className={`${ROOT}-amount`}>
          {baseCurrencySymbol}
          {FormatUtil.convertToIntegerString(item.cost)}
        </div>
        <div className={`${ROOT}-amount-round-trip`}>
          ({msg().Exp_Lbl_RoundTrip}:{baseCurrencySymbol}
          {FormatUtil.convertToIntegerString(item.roundTripCost)})
        </div>
        <RouteAttentionIcon item={item} />
      </td>
    );
  }
}
