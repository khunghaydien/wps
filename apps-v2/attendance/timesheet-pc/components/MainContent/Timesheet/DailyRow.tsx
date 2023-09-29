import React from 'react';

import classNames from 'classnames';
import reduce from 'lodash/reduce';

import Button from '@apps/commons/components/buttons/Button';
import Tooltip from '@apps/commons/components/Tooltip';
import AccessControl from '@apps/commons/containers/AccessControlContainer';
import iconStatusAttention from '@apps/commons/images/iconAttention_small.png';
import msg from '@apps/commons/languages';
import { Dropdown } from '@apps/core';

import STATUS from '@apps/domain/models/approval/request/Status';
import { UserSetting } from '@apps/domain/models/UserSetting';
import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import {
  CommuteCount,
  toCommuteCount,
  toCommuteState,
} from '@attendance/domain/models/CommuteCount';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@attendance/domain/models/DailyActualWorkingTimePeriod';
import {
  ATTENTION_TYPE,
  DailyObjectivelyEventLog,
  getAttentionTypeAtDaily,
} from '@attendance/domain/models/DailyObjectivelyEventLog';
import { FixDailyRequest } from '@attendance/domain/models/FixDailyRequest';
import { TimeRange } from '@attendance/domain/models/TimeRange';
import AttRecordModel from '@attendance/timesheet-pc/models/AttRecord';
import DailyRequestConditionsModel from '@attendance/timesheet-pc/models/DailyRequestConditions';

import { State as TimesheetViewModel } from '@attendance/timesheet-pc/modules/entities/timesheet';

import DailyAllowanceButton from '@attendance/timesheet-pc/containers/DailyAllowanceButtonContainer';
import DailySummaryButton from '@attendance/timesheet-pc/containers/DailySummaryButtonContainer';

import AttChart from './AttChart';
import FixedCell from './DailyRow/FixedCell';
import dailyRowCssClassName from './helpers/dailyRowCssClassName';
import modifierCssClassName from './helpers/modifierCssClassName';
import RequestButtonWithStatus from './RequestButtonWithStatus';
import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from './TimesheetViewType';
import * as commuteCountHelper from '@attendance/ui/helpers/dailyRecord/commuteCount';

import './DailyRow.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-daily-row';

const isOverAllowingDeviationTimeAtDaily = (
  param: Parameters<typeof getAttentionTypeAtDaily>[0]
) => {
  const { dailyObjectivelyEventLog: daily } = param;
  if (
    daily?.deviatedEnteringTimeReason.text ||
    daily?.deviatedEnteringTimeReason.value ||
    daily?.deviatedLeavingTimeReason.text ||
    daily?.deviatedLeavingTimeReason.value
  ) {
    return true;
  }
  return getAttentionTypeAtDaily(param) === ATTENTION_TYPE.ERROR;
};

const createFixDailyRequestClassName = (
  attRecord: AttRecordModel,
  today: string
) => {
  if (attRecord.startTime !== null || attRecord.endTime !== null) {
    switch (attRecord.fixDailyRequest.status) {
      case STATUS.Approved:
        return `${ROOT}--approved`;
      case STATUS.Pending:
        return `${ROOT}--pending`;
      case STATUS.Recalled:
      case STATUS.Rejected:
      case STATUS.Canceled:
        return `${ROOT}--warning`;
      case STATUS.NotRequested:
        return today >= attRecord.recordDate && attRecord.startTime !== null
          ? `${ROOT}--not-requested`
          : '';
    }
  } else if (
    attRecord.fixDailyRequest.status === STATUS.Approved ||
    attRecord.fixDailyRequest.status === STATUS.Pending
  ) {
    return `${ROOT}--warning`;
  } else {
    return '';
  }
};

type Props = {
  viewType: TimesheetViewType;
  today: string;
  attRecord: AttRecordModel;
  dailyObjectivelyEventLog?: DailyObjectivelyEventLog | null;
  requestConditions: DailyRequestConditionsModel;
  onClickRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimeButton: (arg0: string) => void;
  onClickRemarksButton: (arg0: AttRecordModel) => void;
  onClickAttentionsButton: (arg0: Array<string>) => void;
  onDragChartStart: (
    arg0: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onChangeCommuteCount: (
    targetDate: string,
    commuteCount: CommuteCount
  ) => void;
  contractedDetail?: AttDailyRecordContractedDetail;
  requestedWorkingHours?: TimeRange;
  actualWorkingPeriodList?: Array<DailyActualWorkingTimePeriodModel>;
  workingType?: TimesheetViewModel['workingType'];
  dailyWorkingType?: TimesheetViewModel['workingTypes'][number];
  isManHoursGraphOpened?: boolean;
  chartPositionLeft?: number;
  attentionMessages?: Array<string>;
  userSetting: UserSetting;
  TableCellsContainer: React.ComponentType<{
    targetDate: string;
    recordId: string;
    requestConditions: DailyRequestConditionsModel;
    fixDailyRequest: FixDailyRequest;
    useFixDailyRequest: boolean;
  }>;
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
    this.fixedCellCssClassName = this.fixedCellCssClassName.bind(this);
  }

  fixedCellCssClassName(baseClassName: string) {
    return classNames(
      baseClassName,
      modifierCssClassName(
        baseClassName,
        this.props.viewType,
        this.props.workingType
      )
    );
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
      viewType: type,
      attRecord,
      dailyObjectivelyEventLog,
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
      workingType,
      dailyWorkingType,
      TableCellsContainer,
    } = this.props;

    const {
      effectualAllDayLeaveType,
      isApprovedAbsence,
      isAllowWorkDuringLeaveOfAbsence,
    } = requestConditions || {};

    const useFixDailyRequest = dailyWorkingType?.useFixDailyRequest;

    const dailyRowCssClassNameMap = dailyRowCssClassName({
      ROOT,
      record: attRecord,
      effectualAllDayLeaveType,
      isManHoursGraphOpened,
      isApprovedAbsence,
      isAllowWorkDuringLeaveOfAbsence,
    });

    const className = classNames(
      ROOT,
      modifierCssClassName(ROOT, this.props.viewType, this.props.workingType),
      dailyRowCssClassNameMap,
      reduce(
        dailyRowCssClassNameMap,
        (arr, value, key) => {
          if (value) {
            arr.push(
              modifierCssClassName(
                key,
                this.props.viewType,
                this.props.workingType
              )
            );
          }
          return arr;
        },
        []
      )
    );

    return (
      <tr className={className}>
        {workingType?.useFixDailyRequest ? (
          <FixedCell
            key="fix-daily-request"
            type={type}
            className={classNames(
              this.fixedCellCssClassName(`${ROOT}__col-fix-daily-request`),
              useFixDailyRequest
                ? createFixDailyRequestClassName(attRecord, this.props.today)
                : null
            )}
          />
        ) : (
          ''
        )}
        <FixedCell
          type={type}
          className={this.fixedCellCssClassName(`${ROOT}__col-status`)}
        >
          {this.renderStatusIcon()}
        </FixedCell>
        <FixedCell
          type={type}
          className={this.fixedCellCssClassName(`${ROOT}__col-application`)}
        >
          <RequestButtonWithStatus
            requestConditions={requestConditions}
            onClick={onClickRequestButton}
          />
        </FixedCell>
        <FixedCell
          type={type}
          className={this.fixedCellCssClassName(`${ROOT}__col-date`)}
        >
          <em>{attRecord.displayDate}</em>
          {attRecord.displayDay}
        </FixedCell>
        <FixedCell
          type={type}
          className={this.fixedCellCssClassName(`${ROOT}__col-start-time`)}
        >
          {requestConditions.isAvailableToOperateAttTime ||
          isOverAllowingDeviationTimeAtDaily({
            startTime: attRecord.startTime,
            endTime: attRecord.endTime,
            dailyObjectivelyEventLog,
          }) ? (
            <Button
              type="default"
              className={`${ROOT}__input-time`}
              onClick={() => onClickTimeButton(attRecord.id)}
            >
              {attRecord.displayStartTime}
            </Button>
          ) : (
            attRecord.displayStartTime
          )}
        </FixedCell>
        <FixedCell
          type={type}
          className={this.fixedCellCssClassName(`${ROOT}__col-end-time`)}
        >
          {requestConditions.isAvailableToOperateAttTime ||
          isOverAllowingDeviationTimeAtDaily({
            startTime: attRecord.startTime,
            endTime: attRecord.endTime,
            dailyObjectivelyEventLog,
          }) ? (
            <Button
              type="default"
              className={`${ROOT}__input-time`}
              onClick={() => onClickTimeButton(attRecord.id)}
            >
              {attRecord.displayEndTime}
            </Button>
          ) : (
            attRecord.displayEndTime
          )}
        </FixedCell>
        {workingType?.useAllowanceManagement && (
          <td className={`${ROOT}__col-daily-allowance`}>
            {dailyWorkingType?.useAllowanceManagement ? (
              <DailyAllowanceButton
                date={attRecord.recordDate}
                isLocked={requestConditions.isLocked || attRecord.isLocked}
              />
            ) : null}
          </td>
        )}
        {workingType?.useManageCommuteCount && (
          <td className={`${ROOT}__col-commute-count`}>
            <div className={`${ROOT}__dropdown-commute-count-container`}>
              {dailyWorkingType?.useManageCommuteCount ? (
                <Dropdown
                  className={`${ROOT}__dropdown-commute-count`}
                  value={toCommuteState(attRecord.commuteCount)}
                  options={commuteCountHelper.options()}
                  onSelect={({ value }) => {
                    onChangeCommuteCount(
                      attRecord.recordDate,
                      toCommuteCount(value)
                    );
                  }}
                  readOnly={requestConditions.isLocked || attRecord.isLocked}
                />
              ) : null}
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
        {type === TIMESHEET_VIEW_TYPE.TABLE ? (
          <TableCellsContainer
            targetDate={attRecord.recordDate}
            recordId={attRecord.id}
            requestConditions={requestConditions}
            fixDailyRequest={attRecord.fixDailyRequest}
            useFixDailyRequest={useFixDailyRequest}
          />
        ) : (
          <React.Fragment>
            <td className={`${ROOT}__col-chart`}>
              <div
                className={`${ROOT}__chart-container`}
                onMouseDown={onDragChartStart}
                style={{ left: chartPositionLeft }}
                role="button"
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
                  isApprovedAbsence={isApprovedAbsence}
                  isHolLegalHoliday={attRecord.isHolLegalHoliday}
                  isAllowWorkDuringLeaveOfAbsence={
                    isAllowWorkDuringLeaveOfAbsence
                  }
                />
              </div>
            </td>
            <td className={`${ROOT}__col-remarks`}>
              <button
                type="button"
                className={`${ROOT}__input-remarks`}
                onClick={() => onClickRemarksButton(attRecord)}
              >
                {attRecord.remarks || ''}
              </button>
            </td>
          </React.Fragment>
        )}
      </tr>
    );
  }
}
