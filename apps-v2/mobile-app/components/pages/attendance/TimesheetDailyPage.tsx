import React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import Alert from '../../molecules/commons/Alert';
import AccessControl from '@apps/commons/containers/AccessControlContainer';

import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
} from '@apps/attendance/domain/models/FixDailyRequest';
import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import { ApprovalHistory } from '@apps/domain/models/approval/request/History';
import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';
import * as WorkingType from '@attendance/domain/models/WorkingType';

import {
  RestTime,
  RestTimes,
} from '@mobile/modules/attendance/timesheet/ui/daily/editing';

import Layout from '../../../containers/organisms/attendance/TimesheetDailyLayoutContainer';
import AttendanceRequestIgnoreWarningConfirm from '@mobile/containers/organisms/attendance/AttendanceRequestIgnoreWarningConfirmContainer';

import RequestStatusChip from '@apps/attendance/ui/pc/components/particles/RequestStatusChip';

import Button from '../../atoms/Button';
import Label from '../../atoms/Label';
import FixDailyRequestStatusBar from '../../molecules/attendance/FixDailyRequest/FixDailyRequestStatusBar';
import HistoryList from '../../organisms/approval/HistoryList';
import DailyDetailList from '../../organisms/attendance/DailyDetailList';

import './TimesheetDailyPage.scss';

const ROOT = 'mobile-app-pages-attendance-timesheet-daily-page';

type Record = {
  startTime: number | null;
  endTime: number | null;
  restReason: RestTimeReason;
  restTimes: RestTimes;
  restHours: number | null;
  otherRestReason: RestTimeReason | null;
  commuteCount: CommuteCount;
  remarks: string;
  contractedDetail: AttDailyRecord['contractedDetail'];
  hasOtherRestTime: boolean;
  attentionMessages: string[];
  fixDailyRequest: AttDailyRecord['fixDailyRequest'];
};

export type Props = Readonly<{
  currentDate: string;
  isEditable: boolean;
  record: Record;
  sourceRecord: Record | null | undefined;
  restTimeReasons: RestTimeReason[];
  minRestTimesCount?: number;
  maxRestTimesCount?: number;
  approvalHistories: ApprovalHistory[];
  lockedSummary: boolean;
  workingType: WorkingType.WorkingType;
  onChangeStartTime: (arg0: number | null) => void;
  onChangeEndTime: (arg0: number | null) => void;
  onChangeRestTime: (index: number, value: RestTime | null) => void;
  onClickRemoveRestTime: (arg0: number | null) => void;
  onClickAddRestTime: () => void;
  onChangeOtherRestTime: (arg0: number | null) => void;
  onChangeOtherRestReason: (arg0: RestTimeReason | null) => void;
  onChangeCommuteCount: (arg0: CommuteCount) => void;
  onChangeRemarks: (arg0: string) => void;
  onClickSave: () => void;
  onClickSaveAndRequest: () => void;
  onClickCancel: () => void;
}>;

const getPermissionTestConditions = (
  performableActionForFix: ActionsForFix
): DynamicTestConditions => {
  switch (performableActionForFix) {
    case ACTIONS_FOR_FIX.Submit:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelRequest:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelApproval:
      return {
        requireIfByEmployee: ['cancelAttApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttApprovalByDelegate'],
      };
    case ACTIONS_FOR_FIX.None:
      return {
        allowIfByEmployee: true,
      };
    default:
      return {};
  }
};

export default class TimesheetDailyPage extends React.Component<Props> {
  render() {
    const { props } = this;
    return (
      <div className={`${ROOT}`} key={props.currentDate}>
        {props.workingType?.useFixDailyRequest && (
          <div className={`${ROOT}__fix-daily-request-status-bar`}>
            <FixDailyRequestStatusBar
              date={this.props.currentDate}
              status={this.props.sourceRecord?.fixDailyRequest?.status}
              endTime={this.props.sourceRecord?.endTime?.toString() ?? ''}
              startTime={this.props.sourceRecord?.startTime?.toString() ?? ''}
            />
          </div>
        )}
        <Layout>
          <div className={`${ROOT}__package`}>
            {props.record.attentionMessages && (
              <Alert
                className={`${ROOT}__alert`}
                variant="attention"
                message={props.record.attentionMessages}
              />
            )}
            <div className={`${ROOT}__request-status-chip`}>
              {props.workingType?.useFixDailyRequest &&
                props.sourceRecord?.fixDailyRequest?.status && (
                  <RequestStatusChip
                    status={props.sourceRecord.fixDailyRequest.status}
                  />
                )}
            </div>
            <DailyDetailList
              key={props.currentDate}
              className={`${ROOT}__detail-list`}
              readOnly={!props.isEditable}
              startTime={props.record.startTime}
              endTime={props.record.endTime}
              restTimes={props.record.restTimes}
              otherRestTime={props.record.restHours}
              otherRestReason={props.record.otherRestReason}
              restTimeReasons={props.restTimeReasons}
              remarks={props.record.remarks}
              contractedDetail={props.record.contractedDetail}
              isShowOtherRestTime={props.record.hasOtherRestTime}
              minRestTimesCount={props.minRestTimesCount}
              maxRestTimesCount={props.maxRestTimesCount}
              commuteCount={props.record.commuteCount}
              workingType={props.workingType}
              onChangeStartTime={props.onChangeStartTime}
              onChangeEndTime={props.onChangeEndTime}
              onChangeRestTime={props.onChangeRestTime}
              onClickAddRestTime={props.onClickAddRestTime}
              onClickRemoveRestTime={props.onClickRemoveRestTime}
              onChangeOtherRestTime={props.onChangeOtherRestTime}
              onChangeOtherRestReason={props.onChangeOtherRestReason}
              onChangeCommuteCount={props.onChangeCommuteCount}
              onChangeRemarks={props.onChangeRemarks}
            />
            {props.approvalHistories.length > 0 && (
              <div className={`${ROOT}__history-list`}>
                <Label text={msg().Com_Lbl_ApprovalHistory} />
                <HistoryList historyList={props.approvalHistories} />
              </div>
            )}
            <div className={`${ROOT}__save-button-area`}>
              {props.workingType?.useFixDailyRequest &&
              (
                [
                  ACTIONS_FOR_FIX.CancelApproval,
                  ACTIONS_FOR_FIX.CancelRequest,
                ] as ActionsForFix[]
              ).includes(
                props.sourceRecord?.fixDailyRequest?.performableActionForFix
              ) ? (
                <AccessControl
                  conditions={getPermissionTestConditions(
                    props.sourceRecord?.fixDailyRequest?.performableActionForFix
                  )}
                >
                  <Button
                    priority="secondary"
                    variant="alert"
                    disabled={props.lockedSummary}
                    onClick={props.onClickCancel}
                  >
                    {msg().Com_Btn_Reset}
                  </Button>
                </AccessControl>
              ) : (
                <div
                  className={classNames(`${ROOT}__save-button`, {
                    [`${ROOT}__save-button--has-fix-button`]:
                      props.sourceRecord?.fixDailyRequest
                        ?.performableActionForFix === ACTIONS_FOR_FIX.Submit,
                  })}
                >
                  <Button
                    priority="primary"
                    variant="neutral"
                    onClick={props.onClickSave}
                    disabled={!props.isEditable}
                  >
                    {msg().Com_Btn_Save}
                  </Button>
                  {props.workingType?.useFixDailyRequest &&
                    props.sourceRecord?.fixDailyRequest
                      ?.performableActionForFix === ACTIONS_FOR_FIX.Submit && (
                      <AccessControl
                        conditions={getPermissionTestConditions(
                          props.sourceRecord?.fixDailyRequest
                            ?.performableActionForFix
                        )}
                      >
                        <div className={`${ROOT}__fix-daily-request-button`}>
                          <Button
                            priority="primary"
                            variant="add"
                            onClick={props.onClickSaveAndRequest}
                            disabled={!props.isEditable}
                          >
                            {msg().Att_Btn_SaveAndSubmitFixDailyRequest}
                          </Button>
                        </div>
                      </AccessControl>
                    )}
                </div>
              )}
            </div>
          </div>
        </Layout>
        <AttendanceRequestIgnoreWarningConfirm />
      </div>
    );
  }
}
