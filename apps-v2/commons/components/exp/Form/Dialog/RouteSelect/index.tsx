import React from 'react';

import {
  Route,
  RouteItem,
} from '../../../../../../domain/models/exp/jorudan/Route';
import { StationInfo } from '../../../../../../domain/models/exp/jorudan/Station';
import { ViaList } from '../../../../../../domain/models/exp/Record';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import ContentsHeader from './ContentsHeader';
import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';

import './index.scss';

const ROOT = 'ts-expenses-modal-route';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  arrival: StationInfo;
  baseCurrencySymbol: string;
  origin: StationInfo;
  route: Route;
  seatPreference: number | string;
  viaList: ViaList;
  onClickHideDialogButton: () => void;
  onClickRouteSelectListItem: (arg0: RouteItem) => void;
};

export default class RouteSelect extends React.Component<Props> {
  render() {
    if (!this.props.route) {
      return null;
    }
    const { routeList } = this.props.route.route;
    return (
      <DialogFrame
        title={msg().Exp_Lbl_Transit}
        hide={this.props.onClickHideDialogButton}
        className={ROOT}
        footer={
          <div className={`${ROOT}-btn-close`}>
            <Button onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Close}
            </Button>
          </div>
        }
      >
        <div className={`${ROOT}-contents`}>
          <ContentsHeader
            origin={this.props.origin}
            viaList={this.props.viaList}
            arrival={this.props.arrival}
          />
          <table className={`${ROOT}-contents-route-list`}>
            <tbody>
              {routeList.map((item) => {
                return (
                  <tr key={item.key}>
                    <RecordHeader
                      item={item}
                      baseCurrencySymbol={this.props.baseCurrencySymbol}
                    />
                    <RecordBody
                      item={item}
                      baseCurrencySymbol={this.props.baseCurrencySymbol}
                    />
                    <td className={`${ROOT}-contents-route-list-btn-area`}>
                      <Button
                        type="primary"
                        onClick={() => {
                          this.props.onClickRouteSelectListItem(item);
                        }}
                      >
                        {msg().Com_Btn_Select}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogFrame>
    );
  }
}
