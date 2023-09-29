import React from 'react';

import {
  Delegator,
  Delegators,
} from '../../../../../../domain/models/exp/DelegateApplicant';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import SwitchEmployeeTable from './SwitchEmployeeTable';

import './index.scss';

const ROOT = 'ts-expenses-modal-switch-employee';

export type Props = {
  delegatorList: Delegators;
  onClickEmployee: (data: Delegator) => void;
  onClickHideDialogButton: () => void;
};

export default class SwitchEmployee extends React.Component<Props> {
  render() {
    return (
      <DialogFrame
        title={msg().Com_Lbl_SwitchEmployee}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Cancel}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <SwitchEmployeeTable
            onClickEmployee={this.props.onClickEmployee}
            empList={this.props.delegatorList}
          />
        </div>
      </DialogFrame>
    );
  }
}
