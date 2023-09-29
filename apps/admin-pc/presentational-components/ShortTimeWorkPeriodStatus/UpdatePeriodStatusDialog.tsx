import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import { EditingShortTimeWorkPeriodStatus } from '../../models/short-time-work/ShortTimeWorkPeriodStatus';

import PeriodStatusFieldSet from './common/PeriodStatusFieldSet';

import './UpdatePeriodStatusDialog.scss';

const ROOT =
  'admin-pc-short-time-work-period-status-update-period-status-dialog';

export type Props = {
  editingShortTimeWorkPeriodStatus: EditingShortTimeWorkPeriodStatus;
  onUpdateValue: (arg0: string, arg1: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onClickDeleteButton: () => void;
};

export default class UpdatePeriodStatusDialog extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.props.onSubmit();
  }

  renderFooter() {
    return (
      <DialogFrame.Footer
        sub={
          <Button type="destructive" onClick={this.props.onClickDeleteButton}>
            {msg().Com_Btn_Delete}
          </Button>
        }
      >
        <Button key="cancel" onClick={this.props.onCancel}>
          {msg().Com_Btn_Cancel}
        </Button>
        <Button key="submit" type="primary" submit>
          {msg().Com_Btn_Execute}
        </Button>
      </DialogFrame.Footer>
    );
  }

  render() {
    if (!this.props.editingShortTimeWorkPeriodStatus) {
      return null;
    }

    return (
      // @ts-ignore
      <form onSubmit={this.onSubmit} action="/#">
        <DialogFrame
          className={ROOT}
          title={msg().Admin_Lbl_Edit}
          footer={this.renderFooter()}
          hide={this.props.onCancel}
        >
          <div className={`${ROOT}__body`}>
            <PeriodStatusFieldSet
              parentViewType="Dialog"
              editingShortTimeWorkPeriodStatus={
                this.props.editingShortTimeWorkPeriodStatus
              }
              onUpdateValue={this.props.onUpdateValue}
            />
          </div>
        </DialogFrame>
      </form>
    );
  }
}
