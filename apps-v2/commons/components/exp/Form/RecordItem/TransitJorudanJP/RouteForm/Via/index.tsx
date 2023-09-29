import React from 'react';

import classNames from 'classnames';
import { get } from 'lodash';

import { StationInfo } from '../../../../../../../../domain/models/exp/jorudan/Station';
import { ViaList } from '../../../../../../../../domain/models/exp/Record';

import btnDeleteVia from '../../../../../../../images/btnDeleteVia.png';
import msg from '../../../../../../../languages';
import Button from '../../../../../../buttons/Button';
import Condition from '../Condition';

import './index.scss';

const ROOT = 'ts-route-form-via-list';

type Props = {
  error: Array<string>;
  isHighlightDiff?: boolean;
  preViaList?: ViaList;
  readOnly: boolean;
  // component
  suggest: any;
  targetDate: string;
  tmpViaList: Array<string>;
  withDelete: boolean;
  onChange: (arg0: StationInfo, arg1: number) => void;
  onChangeTmp: (arg0: string, arg1: number, arg2: boolean) => void;
  onDeleteVia: (arg0: number) => void;
};

export default class Via extends React.Component<Props> {
  isHighlight = (idx: number, tmpVia: string): boolean => {
    const { isHighlightDiff } = this.props;
    const preVia = get(this.props.preViaList, `${idx}.name`);
    return isHighlightDiff && preVia !== tmpVia;
  };

  render() {
    if (this.props.tmpViaList.length === 0) {
      return null;
    }

    return (
      <div className={ROOT}>
        {this.props.tmpViaList.map((tmpVia: string, idx: number) => {
          return (
            <div
              key={`via${idx}`}
              className={
                this.props.withDelete ? `${ROOT}-point-delete` : `${ROOT}-point`
              }
            >
              <Condition
                title={msg().Exp_Lbl_Via}
                inputType="via"
                placeholder={msg().Exp_Lbl_RoutePlaceholder}
                onChange={(value) => this.props.onChange(value, idx)}
                onChangeTmp={(value, isClear) => {
                  this.props.onChangeTmp(value, idx, isClear);
                }}
                readOnly={this.props.readOnly}
                error={this.props.error[idx]}
                value={tmpVia}
                targetDate={this.props.targetDate}
                suggest={this.props.suggest}
                className={classNames({
                  'highlight-bg': this.isHighlight(idx, tmpVia),
                })}
              />
              {this.props.withDelete && (
                <Button
                  className={`${ROOT}-delete`}
                  onClick={() => this.props.onDeleteVia(idx)}
                  iconSrc={btnDeleteVia}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
