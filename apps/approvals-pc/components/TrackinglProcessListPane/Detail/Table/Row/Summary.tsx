import React from 'react';

import classNames from 'classnames';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';
import TimeUtil from '@commons/utils/TimeUtil';

import '../column.scss';
import './Summary.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table-row-summary';
const COLUMN_ROOT =
  'approvals-pc-tracking-process-list-pane-detail-table-column';

type Props = {
  sumTaskTime: number;
  note: string | null | undefined;
  showComment: boolean;
  isEllipsis: boolean;
};

export default class Summary extends React.Component<Props> {
  render() {
    const cssClass = classNames(ROOT, {
      [`${ROOT}--is-ellipsis`]: this.props.isEllipsis,
    });

    return (
      <div className={cssClass}>
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

        {this.props.showComment && (
          <div
            className={`${ROOT}__item ${ROOT}__item--comment ${COLUMN_ROOT}--comment`}
          >
            <p>{TextUtil.nl2br(this.props.note)}</p>
          </div>
        )}
      </div>
    );
  }
}
