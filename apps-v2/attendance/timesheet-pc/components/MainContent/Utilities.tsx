import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';
import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';

import './Utilities.scss';

const ROOT = 'timesheet-pc-utilities';

type Props = Readonly<{
  onClickOpenSummaryWindowButton: (event: React.MouseEvent) => void;
  onClickOpenLeaveWindowButton: (event: React.MouseEvent) => void;
  AccessControlContainer: IAccessControlContainer;
}>;

// FIXME: 適した名前を検討して適用する
export default class Utilities extends React.Component<Props> {
  render() {
    const { AccessControlContainer } = this.props;
    return (
      <ul className={ROOT}>
        <AccessControlContainer
          requireIfByEmployee={['viewAttSummaryByEmployee']}
          requireIfByDelegate={['viewAttSummaryByDelegate']}
        >
          <li className={`${ROOT}__item`}>
            <Button
              type="text"
              onClick={this.props.onClickOpenSummaryWindowButton}
            >
              {msg().Att_Lbl_MonthlySummary}
            </Button>
          </li>
        </AccessControlContainer>
        <li className={`${ROOT}__item`}>
          <Button type="text" onClick={this.props.onClickOpenLeaveWindowButton}>
            {msg().Att_Lbl_LeaveDetails}
          </Button>
        </li>
      </ul>
    );
  }
}
