import * as React from 'react';

import styled from 'styled-components';

import DialogFrame from '../../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import { Button } from '../../../../../core';

import { ApproverEmployee } from '../../../../../domain/models/approval/ApproverEmployee';
import DailyRequestConditionsModel from '../../../models/DailyRequestConditions';
import { AttDailyRequest } from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State as Editing } from '../../../modules/ui/dailyRequest/editing';

import FormForAbsence from '../../../containers/dialogs/DailyAttRequestDialog/FormForAbsenceContainer';
import FormForDirect from '../../../containers/dialogs/DailyAttRequestDialog/FormForDirectContainer';
import FormForEarlyLeave from '../../../containers/dialogs/DailyAttRequestDialog/FormForEarlyLeaveContainer';
import FormForEarlyStartWork from '../../../containers/dialogs/DailyAttRequestDialog/FormForEarlyStartWorkContainer';
import FormForHolidayWork from '../../../containers/dialogs/DailyAttRequestDialog/FormForHolidayWorkContainer';
import FormForLateArrival from '../../../containers/dialogs/DailyAttRequestDialog/FormForLateArrivalContainer';
import FormForLeave from '../../../containers/dialogs/DailyAttRequestDialog/FormForLeaveContainer';
import FormForOvertimeWork from '../../../containers/dialogs/DailyAttRequestDialog/FormForOvertimeWorkContainer';
import FormForPattern from '../../../containers/dialogs/DailyAttRequestDialog/FormForPatternContainer';

import FormFrame from './FormFrame';
import Menu from './Menu';

import './index.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog';

type Props = {
  // State
  isLoading: boolean;
  editing: Editing;
  targetRequest: AttDailyRequest | null;
  approverEmployee: ApproverEmployee | null;
  requestConditions: DailyRequestConditionsModel;

  // Actions
  onClickRequestDetailButton: (arg0: AttDailyRequest) => void;
  onClickRequestEntryButton: (arg0: string, arg1: string) => void;
  onStartEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancelEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmitRequest: Function;
  onDisableRequest: () => void;
  onCancel: () => void;
  onClickOpenApprovalHistoryDialog: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onClickOpenApproverEmployeeSettingDialog: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

const S = {
  Button: styled(Button)`
    padding: 0 17px;
  `,
};

export default class DailyAttRequestDialog extends React.Component<Props> {
  renderHeaderSub() {
    const { requestConditions } = this.props;
    const displayYMDd = [
      DateUtil.formatYMD(requestConditions.recordDate),
      `(${DateUtil.formatWeekday(requestConditions.recordDate)})`,
    ].join(' ');

    return (
      <time
        className={`${ROOT}__date`}
        dateTime={new Date(requestConditions.recordDate).toISOString()}
      >
        {displayYMDd}
      </time>
    );
  }

  renderBody() {
    const { editing, targetRequest, requestConditions } = this.props;

    if (!targetRequest) {
      return null;
    }

    const isReadOnly =
      !requestConditions.isAvailableToModifySubmittedRequest ||
      !editing.isEditing;

    switch (targetRequest.type) {
      case CODE.Leave:
        return <FormForLeave isReadOnly={isReadOnly} />;
      case CODE.HolidayWork:
        return <FormForHolidayWork isReadOnly={isReadOnly} />;
      case CODE.EarlyStartWork:
        return <FormForEarlyStartWork isReadOnly={isReadOnly} />;
      case CODE.OvertimeWork:
        return <FormForOvertimeWork isReadOnly={isReadOnly} />;
      case CODE.LateArrival:
        return <FormForLateArrival isReadOnly={isReadOnly} />;
      case CODE.EarlyLeave:
        return <FormForEarlyLeave isReadOnly={isReadOnly} />;
      case CODE.Absence:
        return <FormForAbsence isReadOnly={isReadOnly} />;
      case CODE.Direct:
        return <FormForDirect isReadOnly={isReadOnly} />;
      case CODE.Pattern:
        return <FormForPattern isReadOnly={isReadOnly} />;
      default:
        return null;
    }
  }

  renderFooter() {
    return (
      <DialogFrame.Footer>
        <S.Button type="button" color="default" onClick={this.props.onCancel}>
          {msg().Com_Btn_Cancel}
        </S.Button>
      </DialogFrame.Footer>
    );
  }

  renderDetailPane() {
    const { editing, targetRequest, requestConditions } = this.props;

    if (!targetRequest) {
      return (
        <div className={`${ROOT}__no-detail`}>
          <p>{msg().Att_Msg_SelectRequestTypeFromList}</p>
        </div>
      );
    }

    const body = this.renderBody();

    return (
      body && (
        <FormFrame
          isLoading={this.props.isLoading}
          isEditing={editing.isEditing}
          editAction={editing.editAction}
          disableAction={editing.disableAction}
          isAvailableToModify={
            requestConditions.isAvailableToModifySubmittedRequest || false
          }
          approverEmployee={this.props.approverEmployee}
          onStartEditing={this.props.onStartEditing}
          onCancelEditing={this.props.onCancelEditing}
          onSubmit={this.props.onSubmitRequest}
          onDisable={this.props.onDisableRequest}
          onClickOpenApprovalHistoryDialog={
            this.props.onClickOpenApprovalHistoryDialog
          }
          onClickOpenApproverEmployeeSettingDialog={
            this.props.onClickOpenApproverEmployeeSettingDialog
          }
        >
          {body}
        </FormFrame>
      )
    );
  }

  render() {
    if (!this.props.requestConditions) {
      return null;
    }

    return (
      <DialogFrame
        title={msg().Att_Lbl_Request}
        className={ROOT}
        headerSub={this.renderHeaderSub()}
        footer={this.renderFooter()}
        hide={this.props.onCancel}
      >
        <div className={`${ROOT}__menu`}>
          <Menu
            requestConditions={this.props.requestConditions}
            onClickRequestDetailButton={this.props.onClickRequestDetailButton}
            onClickRequestEntryButton={this.props.onClickRequestEntryButton}
            selectedRequestId={this.props.editing.id}
            selectedRequestTypeCode={this.props.editing.requestTypeCode}
          />
        </div>

        <div className={`${ROOT}__content`}>{this.renderDetailPane()}</div>
      </DialogFrame>
    );
  }
}
