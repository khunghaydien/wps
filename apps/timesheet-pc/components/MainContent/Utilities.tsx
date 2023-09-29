import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import msg from '../../../commons/languages';

import './Utilities.scss';

const ROOT = 'timesheet-pc-utilities';

type Props = Readonly<{
  onClickOpenSummaryWindowButton: (event: React.MouseEvent) => void;
  onClickOpenLeaveWindowButton: (event: React.MouseEvent) => void;
}>;

// FIXME: 適した名前を検討して適用する
export default class Utilities extends React.Component<Props> {
  render() {
    return (
      <ul className={ROOT}>
        <li className={`${ROOT}__item`}>
          <Button
            type="text"
            onClick={this.props.onClickOpenSummaryWindowButton}
          >
            {msg().Att_Lbl_MonthlySummary}
          </Button>
        </li>
        <li className={`${ROOT}__item`}>
          <Button type="text" onClick={this.props.onClickOpenLeaveWindowButton}>
            {msg().Att_Lbl_LeaveDetails}
          </Button>
        </li>
      </ul>
    );
  }
}
