import React from 'react';

import { StationInfo } from '../../../../../../../domain/models/exp/jorudan/Station';
import { ViaList } from '../../../../../../../domain/models/exp/Record';

import msg from '../../../../../../languages';

import './index.scss';

const ROOT = 'ts-expenses-modal-route-contents__header';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
type Props = {
  arrival: StationInfo;
  origin: StationInfo;
  viaList: ViaList;
};

export default class ContentsHeader extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}-title`}>{msg().Exp_Lbl_RouteSearch} :</div>
        <div className={`${ROOT}-station`}>
          <div className={`${ROOT}-station-item`}>{this.props.origin.name}</div>
          {this.props.viaList.map((via) => {
            return [
              <hr className={`${ROOT}-station-hr`} />,
              <div className={`${ROOT}-station-item ${ROOT}-station-item--via`}>
                {via ? via.name : ''}
              </div>,
            ];
          })}
          <hr className={`${ROOT}-station-hr`} />
          <div className={`${ROOT}-station-item`}>
            {this.props.arrival.name}
          </div>
        </div>
      </div>
    );
  }
}
