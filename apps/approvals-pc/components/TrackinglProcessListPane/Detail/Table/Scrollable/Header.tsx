import React from 'react';

import msg from '../../../../../../commons/languages';

import './Header.scss';
import '../column.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table-header';
const COLUMN_ROOT =
  'approvals-pc-tracking-process-list-pane-detail-table-column';

type Props = {
  showComment: boolean;
};

export default class Header extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`} role="row">
        <div
          className={`${ROOT}__cell ${COLUMN_ROOT}--date`}
          role="columnheader"
        >
          {msg().Appr_Lbl_Date}
        </div>
        <div
          className={`${ROOT}__cell ${COLUMN_ROOT}--name`}
          role="columnheader"
        >
          {msg().Appr_Lbl_Job} / {msg().Appr_Lbl_WorkCategory}
        </div>
        <div
          className={`${ROOT}__cell ${COLUMN_ROOT}--work-time`}
          role="columnheader"
        >
          {msg().Appr_Lbl_Work}
        </div>

        {this.props.showComment && (
          <div
            className={`${ROOT}__cell ${COLUMN_ROOT}--comment`}
            role="columnheader"
          >
            {msg().Appr_Lbl_Comments}
          </div>
        )}
      </div>
    );
  }
}
