import React from 'react';

import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';

import '../column.scss';
import './Summary.scss';

const ROOT = 'tracking-pc-list-item-summary';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  note: string | null | undefined;
  sumTaskTime: number;
};

export default class Summary extends React.Component<Props> {
  static defaultProps = {
    note: '',
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <div
          className={`${ROOT}__item ${ROOT}__item--name ${COLUMN_ROOT}--name`}
        />
        <div
          className={`${ROOT}__item ${ROOT}__item--label-summary ${COLUMN_ROOT}--label-summary`}
        >
          {msg().Trac_Lbl_Total}
        </div>
        <div
          className={`${ROOT}__item ${ROOT}__item--work-time ${COLUMN_ROOT}--work-time`}
        >
          {TimeUtil.toHHmm(this.props.sumTaskTime)}
        </div>
        <div
          className={`${ROOT}__item ${ROOT}__item--comment ${COLUMN_ROOT}--comment`}
        >
          <p>{TextUtil.nl2br(this.props.note)}</p>
        </div>
      </div>
    );
  }
}
