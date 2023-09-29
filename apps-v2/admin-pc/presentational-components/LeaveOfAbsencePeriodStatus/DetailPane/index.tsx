import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import { EmployeePersonalInfo } from '../../../models/common/EmployeePersonalInfo';
import { LeaveOfAbsence } from '../../../models/leave-of-absence/LeaveOfAbsence';
import { LeaveOfAbsencePeriodStatus } from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

import DetailPaneFrame from '../../../components/Common/DetailPaneFrame';

import PeriodStatusForm from '../common/PeriodStatusFieldSet';
import HistoryList from './HistoryList';

import './index.scss';

const ROOT = 'admin-pc-leave-of-absence-period-status-detail-pane';

export type Props = {
  targetEmployee: EmployeePersonalInfo | null | undefined;
  leaveOfAbsenceList: LeaveOfAbsence[];
  leaveOfAbsencePeriodStatusList: LeaveOfAbsencePeriodStatus[];
  editingLeaveOfAbsencePeriodStatus: LeaveOfAbsencePeriodStatus;
  onUpdateEntryFormValue: (key: string, value: string) => void;
  onSubmitEntryForm: () => void;
  onClickCloseButton: () => void;
  onClickEditHistoryButton: (arg0: LeaveOfAbsencePeriodStatus) => void;
};

export default class DetailPane extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onSubmitEntryForm = this.onSubmitEntryForm.bind(this);
  }

  onSubmitEntryForm(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmitEntryForm();
  }

  render() {
    const headerSubTitle = [
      `${msg().Com_Lbl_EmployeeName}: `,
      <span key="employeeName" className={`${ROOT}__employee-name`}>
        {(this.props.targetEmployee || {}).name}
      </span>,
    ];

    return (
      <DetailPaneFrame
        className={ROOT}
        title={msg().Admin_Lbl_Apply}
        subTitle={headerSubTitle}
        headerButtons={
          <Button
            className={`${ROOT}__close-button`}
            onClick={this.props.onClickCloseButton}
          >
            {msg().Com_Btn_Close}
          </Button>
        }
      >
        <form onSubmit={this.onSubmitEntryForm} action="/#">
          <PeriodStatusForm
            parentViewType="Pane"
            editingLeaveOfAbsencePeriodStatus={
              this.props.editingLeaveOfAbsencePeriodStatus
            }
            leaveOfAbsenceList={this.props.leaveOfAbsenceList}
            onUpdateValue={this.props.onUpdateEntryFormValue}
          />
          <div className={`${ROOT}__entry-form-footer`}>
            <Button submit type="primary" className={`${ROOT}__entry-button`}>
              {msg().Com_Btn_Execute}
            </Button>
          </div>
        </form>

        <HistoryList
          historyList={this.props.leaveOfAbsencePeriodStatusList}
          onClickEditButton={this.props.onClickEditHistoryButton}
        />
      </DetailPaneFrame>
    );
  }
}
