import React from 'react';

import classNames from 'classnames';

import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';
import DurationUtil from '../../commons/utils/DurationUtil';
import TextUtil from '../../commons/utils/TextUtil';
import TimeUtil from '../../commons/utils/TimeUtil';

import { DaysAndHours } from '../models/DaysAndHours';

import './SummaryItem.scss';

const ROOT = 'timesheet-pc-summary-summary-item';

type Props = {
  closingDate: string;
  name: string;
  unit: string | null | undefined;
  value: number;
  daysAndHours: DaysAndHours;
  isAsAtClosingDate: boolean | null | undefined;
  isSubItem: boolean | null | undefined;
  hasTranslatedName: boolean | null | undefined;
  maskValue: boolean;
};

const UNCONFIRMED_VALUE_MASK = '* *';

const messageIdByItemNameTranslations = {
  ContractualWorkDays: 'Att_Lbl_ContractualWorkDays',
  RealWorkDays: 'Att_Lbl_RealWorkDays',
  LegalHolidayWorkCount: 'Att_Lbl_LegalHolidayWorkCount',
  HolidayWorkCount: 'Att_Lbl_HolidayWorkCount',
  ContractedWorkHours: 'Att_Lbl_ContractedWorkHours',
  RealWorkTime: 'Att_Lbl_RealWorkTime',
  DifferenceTime: 'Att_Lbl_DifferenceTime',
  PlainTime: 'Att_Lbl_PlainTime',
  VirtualWorkTime: 'Att_Lbl_VirtualWorkTime',
  WholeLegalWorkTime: 'Att_Lbl_WholeLegalWorkTime',
  LegalWorkHours: 'Att_Lbl_LegalWorkHours',
  LegalOverTime: 'Att_Lbl_LegalOverTime',
  CommuteCount: 'Att_Lbl_CommuteCount',
  QuarterLegalOverTime: 'Att_Lbl_QuarterLegalOverTime',
  YearLegalOverTime: 'Att_Lbl_YearLegalOverTime',
  YearLegalOverCount: 'Att_Lbl_YearLegalOverCount',
  SafetyObligationalExcessTime: 'Att_Lbl_SafetyObligationalExcessTime',
  WorkTime01: 'Att_Lbl_OutWorkTime01',
  WorkTime02: 'Att_Lbl_OutWorkTime02',
  WorkTime03: 'Att_Lbl_OutWorkTime03',
  WorkTime04: 'Att_Lbl_OutWorkTime04',
  WorkTime05: 'Att_Lbl_OutWorkTime05',
  WorkTime06: 'Att_Lbl_OutWorkTime06',
  WorkTime07: 'Att_Lbl_OutWorkTime07',
  CompensatoryLeaveExpiredTime: 'Att_Lbl_CompensatoryLeaveExpiredTime',
  LateArriveCount: 'Att_Lbl_LateArriveCount',
  LateArriveTime: 'Att_Lbl_LateArriveTime',
  LateArriveLostTime: 'Att_Lbl_LateArriveLostTime',
  EarlyLeaveCount: 'Att_Lbl_EarlyLeaveCount',
  EarlyLeaveTime: 'Att_Lbl_EarlyLeaveTime',
  EarlyLeaveLostTime: 'Att_Lbl_EarlyLeaveLostTime',
  BreakLostCount: 'Att_Lbl_BreakLostCount',
  BreakTime: 'Att_Lbl_BreakTime',
  BreakLostTime: 'Att_Lbl_BreakLostTime',
  LeaveLostTime: 'Att_Lbl_LeaveLostTime',
  ShortenedWorkTime: 'Att_Lbl_ShortenedWorkTime',
  AnnualPaidLeaveDays: 'Att_Lbl_AnnualPaidLeaveDays',
  GeneralPaidLeaveDays: 'Att_Lbl_GeneralPaidLeaveDays',
  UnpaidLeaveDays: 'Att_Lbl_UnpaidLeaveDays',
  WorkAbsenceDays: 'Att_Lbl_WorkAbsenceDays',
  AnnualPaidLeaveDaysLeft: 'Att_Lbl_AnnualPaidLeaveDaysLeft',
};

const formatItemName = (name) => {
  const msgId = messageIdByItemNameTranslations[name];
  return msgId ? msg()[msgId] || '' : '';
};

const formatCount = (count) => `${count} ${msg().Com_Lbl_Times}`;

const formatItemValueAndUnit = (name, unit, value, daysAndHours) => {
  // TODO Refactor this
  // Treat difference time as duration.
  if (name === 'DifferenceTime') {
    if (typeof value === 'number') {
      return DurationUtil.toHHmm(value, true);
    }
  }

  switch (unit) {
    case 'days':
      return DateUtil.formatDaysWithUnit(value);
    case 'hours':
      return TimeUtil.toHHmm(value);
    case 'count':
      return formatCount(value);
    case 'daysAndHours':
      return DurationUtil.formatDaysAndHoursWithUnit(
        daysAndHours.days,
        daysAndHours.hours
      );
    default:
  }

  // This line should not be evaluated
  return value;
};

export default class SummaryItem extends React.Component<Props> {
  static defaultProps = {
    isAsAtClosingDate: false,
    isSubItem: false,
    hasTranslatedName: false,
  };

  renderClosingDate() {
    const { isAsAtClosingDate, closingDate } = this.props;

    if (!isAsAtClosingDate || !closingDate) {
      return null;
    }

    const dateStr = TextUtil.template(
      msg().Com_Lbl_AsAt,
      DateUtil.formatYMD(closingDate)
    );

    return (
      <span className={`${ROOT}__as_at_closing_date`}>
        {TextUtil.template(msg().Com_Str_Parenthesis, dateStr)}
      </span>
    );
  }

  render() {
    const name = this.props.hasTranslatedName
      ? this.props.name
      : formatItemName(this.props.name);

    return (
      <div
        key={this.props.name}
        className={classNames(ROOT, {
          [`${ROOT}--sub-item`]: this.props.isSubItem,
        })}
      >
        <div className={`${ROOT}__name`}>
          <span>
            {name}
            {this.renderClosingDate()}
          </span>
        </div>
        <div className={`${ROOT}__value`}>
          <span>
            {this.props.maskValue
              ? UNCONFIRMED_VALUE_MASK
              : formatItemValueAndUnit(
                  this.props.name,
                  this.props.unit,
                  this.props.value,
                  this.props.daysAndHours
                )}
          </span>
        </div>
      </div>
    );
  }
}
