import React from 'react';

import classNames from 'classnames';

import Button from '../../../../commons/components/buttons/Button';
import Tooltip from '../../../../commons/components/Tooltip';
import AccessControl from '../../../../commons/containers/AccessControlContainer';
import iconStatusAttention from '../../../../commons/images/iconAttention_small.png';
import msg from '../../../../commons/languages';
import { Dropdown } from '../../../../core';

import { AttDailyRecordContractedDetail } from '../../../../domain/models/attendance/AttDailyRecord';
import {
  COMMUTE_STATE,
  toCommuteCount,
  toCommuteState,
} from '../../../../domain/models/attendance/CommuteCount';
import {
  isWithDeduction,
  isWithPayment,
} from '../../../../domain/models/attendance/LeaveType';
import { TimeRange } from '../../../../domain/models/attendance/TimeRange';
import { UserSetting } from '../../../../domain/models/UserSetting';
import AttRecordModel from '../../../models/AttRecord';
import DailyRequestConditionsModel from '../../../models/DailyRequestConditions';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@apps/domain/models/attendance/DailyActualWorkingTimePeriod';

import DailySummaryButton from '../../../containers/DailySummaryButtonContainer';

import AttChart from './AttChart';
import RequestButtonWithStatus from './RequestButtonWithStatus';

import './DailyRow.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-daily-row';

type Props = {
  attRecord: AttRecordModel;
  requestConditions: DailyRequestConditionsModel;
  onClickRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimeButton: (arg0: AttRecordModel) => void;
  onClickRemarksButton: (arg0: AttRecordModel) => void;
  onClickAttentionsButton: (arg0: Array<string>) => void;
  onDragChartStart: (
    arg0: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onChangeCommuteCount: (param: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate: string;
  }) => void;
  contractedDetail?: AttDailyRecordContractedDetail;
  requestedWorkingHours?: TimeRange;
  actualWorkingPeriodList?: Array<DailyActualWorkingTimePeriodModel>;
  useManageCommuteCount?: boolean;
  isManHoursGraphOpened?: boolean;
  chartPositionLeft?: number;
  attentionMessages?: Array<string>;
  userSetting: UserSetting;
};

export default class DailyRow extends React.Component<Props> {
  static defaultProps = {
    contractedDetail: null,
    requestedWorkingHours: null,
    actualWorkingPeriodList: null,
    isManHoursGraphOpened: false,
    chartPositionLeft: 0,
  };

  constructor(props: Props) {
    super(props);
    this.renderStatusIcon = this.renderStatusIcon.bind(this);
  }

  renderStatusIcon() {
    const { attentionMessages, onClickAttentionsButton, attRecord } =
      this.props;

    if (!attentionMessages || !attentionMessages.length) {
      return '';
    }

    const tipMsg =
      attentionMessages.length === 1
        ? attentionMessages[0]
        : msg().Att_Msg_MultipulAttentionMessage;

    return (
      <div>
        <Tooltip
          id={`${attRecord.recordDate}-attentions`}
          content={tipMsg}
          align="right"
        >
          <div
            className={`${ROOT}__attentions-button`}
            data-for={`${attRecord.recordDate}-attentions`}
            aria-label={tipMsg}
            onClick={() => onClickAttentionsButton(attentionMessages)}
          >
            <img src={iconStatusAttention} alt={tipMsg} />
          </div>
        </Tooltip>
      </div>
    );
  }

  render() {
    const {
      attRecord,
      contractedDetail,
      requestedWorkingHours,
      actualWorkingPeriodList,
      requestConditions,
      isManHoursGraphOpened,
      chartPositionLeft,
      onClickRequestButton,
      onClickTimeButton,
      onClickRemarksButton,
      onDragChartStart,
      onChangeCommuteCount,
      useManageCommuteCount,
    } = this.props;

    const { effectualAllDayLeaveType } = requestConditions || {};

    const className = classNames(ROOT, {
      [`${ROOT}--man-hours-graph-opened`]: isManHoursGraphOpened,

      [`${ROOT}--day-type-workday`]:
        attRecord.dayType === AttRecordModel.DAY_TYPE.WORKDAY,
      [`${ROOT}--day-type-holiday`]:
        attRecord.dayType === AttRecordModel.DAY_TYPE.HOLIDAY,
      [`${ROOT}--day-type-legal-holiday`]:
        attRecord.dayType === AttRecordModel.DAY_TYPE.LEGAL_HOLIDAY,

      [`${ROOT}--leave-with-payment`]:
        effectualAllDayLeaveType !== null &&
        isWithPayment(effectualAllDayLeaveType),
      [`${ROOT}--leave-with-deduction`]:
        effectualAllDayLeaveType !== null &&
        isWithDeduction(effectualAllDayLeaveType),

      [`${ROOT}--leave-of-absence`]: attRecord.isLeaveOfAbsence,

      [`${ROOT}--absence`]: requestConditions.isApprovedAbsence,

      [`${ROOT}--paternity-leave-at-birth`]:
        requestConditions.isPaternityLeaveAtBirth,
    });

    return (
      <tr className={className}>
        <td className={`${ROOT}__col-status`}>{this.renderStatusIcon()}</td>
        <td className={`${ROOT}__col-application`}>
          <RequestButtonWithStatus
            requestConditions={requestConditions}
            onClick={onClickRequestButton}
          />
        </td>
        <td className={`${ROOT}__col-date`}>
          <em>{attRecord.displayDate}</em>
          {attRecord.displayDay}
        </td>
        <td className={`${ROOT}__col-start-time`}>
          {requestConditions.isAvailableToOperateAttTime ? (
            <Button
              type="default"
              className={`${ROOT}__input-time`}
              onClick={() => onClickTimeButton(attRecord)}
            >
              {attRecord.displayStartTime}
            </Button>
          ) : (
            attRecord.displayStartTime
          )}
        </td>
        <td className={`${ROOT}__col-end-time`}>
          {requestConditions.isAvailableToOperateAttTime ? (
            <Button
              type="default"
              className={`${ROOT}__input-time`}
              onClick={() => onClickTimeButton(attRecord)}
            >
              {attRecord.displayEndTime}
            </Button>
          ) : (
            attRecord.displayEndTime
          )}
        </td>
        {useManageCommuteCount && (
          <td className={`${ROOT}__col-commute-count`}>
            <div className={`${ROOT}__dropdown-commute-count-container`}>
              <Dropdown
                className={`${ROOT}__dropdown-commute-count`}
                value={toCommuteState(
                  attRecord.commuteForwardCount,
                  attRecord.commuteBackwardCount
                )}
                options={[
                  {
                    value: COMMUTE_STATE.UNENTERED,
                    label: msg().Att_Lbl_CommuteCountUnentered,
                  },
                  {
                    value: COMMUTE_STATE.NONE,
                    label: msg().Att_Lbl_CommuteCountNone,
                  },
                  {
                    value: COMMUTE_STATE.BOTH_WAYS,
                    label: msg().Att_Lbl_CommuteCountBothWays,
                  },
                  {
                    value: COMMUTE_STATE.FORWARD,
                    label: msg().Att_Lbl_CommuteCountForward,
                  },
                  {
                    value: COMMUTE_STATE.BACKWARD,
                    label: msg().Att_Lbl_CommuteCountBackward,
                  },
                ]}
                onSelect={(option) => {
                  const { value } = option;
                  const [commuteForwardCount, commuteBackwardCount] =
                    toCommuteCount(value);
                  onChangeCommuteCount({
                    commuteForwardCount,
                    commuteBackwardCount,
                    targetDate: attRecord.recordDate,
                  });
                }}
                readOnly={requestConditions.isLocked}
              />
            </div>
          </td>
        )}
        <AccessControl
          allowIfByEmployee
          requireIfByDelegate={['viewTimeTrackByDelegate']}
        >
          {this.props.userSetting.useWorkTime && (
            <td className={`${ROOT}__col-daily-summary-container`}>
              <div className={`${ROOT}__col-daily-summary`}>
                <DailySummaryButton date={attRecord.recordDate} />
              </div>
            </td>
          )}
        </AccessControl>
        <td className={`${ROOT}__col-chart`}>
          <div
            className={`${ROOT}__chart-container`}
            onMouseDown={onDragChartStart}
            style={{ left: chartPositionLeft }}
          >
            <AttChart
              dayType={attRecord.dayType}
              startTime={attRecord.startTime}
              endTime={attRecord.endTime}
              scheduledWorkingHours={
                contractedDetail ||
                (requestedWorkingHours as AttDailyRecordContractedDetail)
              }
              actualWorkingPeriodList={actualWorkingPeriodList}
              effectualLeaveRequestList={
                requestConditions.effectualLeaveRequests || []
              }
              isLeaveOfAbsence={attRecord.isLeaveOfAbsence}
              isApprovedAbsence={requestConditions.isApprovedAbsence}
              isPaternityLeaveAtBirth={
                requestConditions.isPaternityLeaveAtBirth
              }
            />
          </div>
        </td>
        <td className={`${ROOT}__col-remarks`}>
          <button
            className={`${ROOT}__input-remarks`}
            onClick={() => onClickRemarksButton(attRecord)}
          >
            {attRecord.remarks || ''}
          </button>
        </td>
      </tr>
    );
  }
}
