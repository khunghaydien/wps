import * as React from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v1';

import ImgArrowNarrowUnderBlue from '../../../../commons/images/arrowNarrowUnderBlue.png';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import { AttDailyRecordContractedDetail } from '../../../../domain/models/attendance/AttDailyRecord';
import { LeaveRequest } from '../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { LEAVE_RANGE } from '../../../../domain/models/attendance/LeaveRange';
import {
  isWithDeduction,
  isWithPayment,
} from '../../../../domain/models/attendance/LeaveType';
import { TimeRange } from '../../../../domain/models/attendance/TimeRange';
import AttRecordModel from '../../../models/AttRecord';
import {
  ACTUAL_WORKING_PERIOD_TYPE,
  DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel,
} from '@apps/domain/models/attendance/DailyActualWorkingTimePeriod';

import './AttChart.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-att-chart';

const TIME_RANGE_TYPE = {
  WORK: 'WORK',
  REST: 'REST',
} as const;

const DISPLAYING_HOURS = 48;

const WIDTH_PX_OF_ONE_HOUR = 20;
const WIDTH_PX_OF_SIDE_GUTTER = WIDTH_PX_OF_ONE_HOUR;
const WIDTH_PX_OF_ONE_MINUTE = WIDTH_PX_OF_ONE_HOUR / 60;
const VIEW_BOX_OF_BAR_BODY = `0 0 ${
  DISPLAYING_HOURS * WIDTH_PX_OF_ONE_HOUR
} 16`;

const DEFAULT_PALETTE_FOR_CONTRACTED_WORKING_HOURS = {
  [TIME_RANGE_TYPE.WORK]: '#d4d3dc',
  [TIME_RANGE_TYPE.REST]: '#bfbfc8',
};

const DEFAULT_PALETTE_FOR_ACTUAL_WORKING_PERIODS = {
  [ACTUAL_WORKING_PERIOD_TYPE.REST]: '#7092bd',
  [ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN]: '#95b9e5',
  [ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_IN]: '#ecaa61',
  [ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_OUT]: '#ecaa61',
  [ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_OUT]: '#ecaa61',
} as const;

type Props = {
  dayType: string;
  startTime: number;
  endTime: number;
  isLeaveOfAbsence: boolean;
  isApprovedAbsence: boolean;
  isPaternityLeaveAtBirth: boolean;
  scheduledWorkingHours: TimeRange | AttDailyRecordContractedDetail;
  actualWorkingPeriodList: DailyActualWorkingTimePeriodModel[];
  effectualLeaveRequestList: LeaveRequest[];
  paletteForActualWorkingPeriods: typeof DEFAULT_PALETTE_FOR_ACTUAL_WORKING_PERIODS;
};

export default class AttChart extends React.Component<Props> {
  static defaultProps = {
    dayType: null,
    startTime: null,
    endTime: null,
    isLeaveOfAbsence: false,
    isApprovedAbsence: false,
    isPaternityLeaveAtBirth: false,
    scheduledWorkingHours: null,
    actualWorkingPeriodList: null,
    effectualLeaveRequestList: null,
    paletteForActualWorkingPeriods: DEFAULT_PALETTE_FOR_ACTUAL_WORKING_PERIODS,
  };

  /**
   * 深夜労働時間帯（を含むレイヤー）
   */
  renderLateNight() {
    return <div key="late-night" className={`${ROOT}__late-night`} />;
  }

  /**
   * 時刻を示す縦罫線（を含むレイヤー）
   */
  renderGrid() {
    return <div key="grid" className={`${ROOT}__grid`} />;
  }

  /**
   * 休職・休業を示すレイヤー
   * 休暇を表すレイヤーと同時に表示されることはない
   */
  renderLeaveOfAbsence() {
    const { isLeaveOfAbsence, isPaternityLeaveAtBirth } = this.props;

    if (!isLeaveOfAbsence || isPaternityLeaveAtBirth) {
      return null;
    }

    return <div key="leaveOfAbsence" className={`${ROOT}__leave-of-absence`} />;
  }

  /**
   * 欠勤を示すレイヤー
   */
  renderAbsence() {
    const { isApprovedAbsence } = this.props;

    if (!isApprovedAbsence) {
      return null;
    }

    return <div key="absence" className={`${ROOT}__absence`} />;
  }

  /**
   * 休暇を示すレイヤー
   * - NOTE: 休暇申請（models/AttDailyRequest/LeaveRequest）そのものをソースにしている
   */
  renderEffectualLeave() {
    const { effectualLeaveRequestList } = this.props;

    if (!effectualLeaveRequestList || !effectualLeaveRequestList.length) {
      return null;
    }

    // 半日休が2つある場合は全日休として表示(有給・無給の色は1番目の申請のものに合わせる)
    if (
      effectualLeaveRequestList.length === 2 &&
      effectualLeaveRequestList[0].leaveRange === LEAVE_RANGE.Half &&
      effectualLeaveRequestList[1].leaveRange === LEAVE_RANGE.Half
    ) {
      const classNameBase = `${ROOT}__effectual-leave`;
      const className = classNames(classNameBase, {
        [`${classNameBase}--type-with-payment`]:
          effectualLeaveRequestList[0].leaveType !== null &&
          isWithPayment(effectualLeaveRequestList[0].leaveType),
        [`${classNameBase}--type-with-deduction`]:
          effectualLeaveRequestList[0].leaveType !== null &&
          isWithDeduction(effectualLeaveRequestList[0].leaveType),
      });
      const key = `leave-Half-${
        effectualLeaveRequestList[0].leaveType || ''
      }-0`;
      const style = {
        left: 0,
        width: '100%',
      };
      return [<div className={className} key={key} style={style} />];
    }

    const layers =
      effectualLeaveRequestList.map<React.ReactElement<'div'> | null>(
        (leave) => {
          // 有給・無給（色分け）は、className属性値に反映する
          const classNameBase = `${ROOT}__effectual-leave`;
          const className = classNames(classNameBase, {
            [`${classNameBase}--with-payment`]:
              leave.leaveType !== null && isWithPayment(leave.leaveType),
            [`${classNameBase}--with-deduction`]:
              leave.leaveType !== null && isWithDeduction(leave.leaveType),
          });
          const key = `leave-${leave.leaveRange || ''}-${String(
            leave.startTime
          )}-${String(leave.endTime)}`;

          let style;
          switch (leave.leaveRange) {
            // 全日休
            case LEAVE_RANGE.Day: {
              style = {
                left: 0,
                width: '100%',
              };
              break;
            }

            // 午前半日休
            case LEAVE_RANGE.AM: {
              const widthByMinute = leave.endTime || 0;
              style = {
                left: 0,
                paddingLeft: WIDTH_PX_OF_SIDE_GUTTER,
                width: widthByMinute * WIDTH_PX_OF_ONE_MINUTE,
              };
              break;
            }

            // 午後半日休
            case LEAVE_RANGE.PM: {
              const startTime = leave.startTime || 0;
              const widthByMinute = DISPLAYING_HOURS * 60 - startTime;
              style = {
                left:
                  WIDTH_PX_OF_SIDE_GUTTER + startTime * WIDTH_PX_OF_ONE_MINUTE,
                paddingRight: WIDTH_PX_OF_SIDE_GUTTER,
                width: widthByMinute * WIDTH_PX_OF_ONE_MINUTE,
              };
              break;
            }

            // 半日休
            case LEAVE_RANGE.Half:
              return null;

            // 時間指定休
            case LEAVE_RANGE.Time: {
              const startTime = leave.startTime || 0;
              const endTime = leave.endTime || 0;
              const widthByMinute = endTime - startTime;
              style = {
                left:
                  WIDTH_PX_OF_SIDE_GUTTER + startTime * WIDTH_PX_OF_ONE_MINUTE,
                width: widthByMinute * WIDTH_PX_OF_ONE_MINUTE,
              };
              break;
            }

            default:
              return null;
          }

          return <div key={key} className={className} style={style} />;
        }
      );

    return layers;
  }

  /**
   * 労働が予定されている時間帯のバー（を含むレイヤー）
   * ※所定勤務時間もしくは、休日出勤申請による予定時間
   */
  renderScheduledWorkingHours() {
    const { scheduledWorkingHours } = this.props;

    if (!scheduledWorkingHours) {
      return null;
    }

    const { WORK, REST } = TIME_RANGE_TYPE;

    const { startTime, endTime } = scheduledWorkingHours;

    const rectOfRestPeriodList =
      'restTimes' in scheduledWorkingHours
        ? scheduledWorkingHours.restTimes.map((period) => (
            <rect
              x={period.startTime * WIDTH_PX_OF_ONE_MINUTE}
              y={0}
              width={
                (period.endTime - period.startTime) * WIDTH_PX_OF_ONE_MINUTE
              }
              height="100%"
              fill={DEFAULT_PALETTE_FOR_CONTRACTED_WORKING_HOURS[REST]}
              key={`rest-${period.startTime}-${period.endTime}`}
            />
          ))
        : [];

    return (
      <div className={`${ROOT}__contracted-working-hours`}>
        <svg className={`${ROOT}__bar-graph`} viewBox={VIEW_BOX_OF_BAR_BODY}>
          <rect
            x={startTime * WIDTH_PX_OF_ONE_MINUTE}
            y={0}
            width={(endTime - startTime) * WIDTH_PX_OF_ONE_MINUTE}
            height="100%"
            rx={3}
            ry={3}
            fill={DEFAULT_PALETTE_FOR_CONTRACTED_WORKING_HOURS[WORK]}
            key="working"
          />

          {rectOfRestPeriodList}
        </svg>
      </div>
    );
  }

  /**
   * 実労働時間のバー（を含むレイヤー）
   */
  renderActualWorkingHours() {
    const {
      startTime,
      endTime,
      actualWorkingPeriodList,
      paletteForActualWorkingPeriods,
    } = this.props;

    if (!actualWorkingPeriodList || !actualWorkingPeriodList.length) {
      return null;
    }

    // 角丸表現のためのマスク（出退勤の両方に値をもつ場合のみ有効）
    let masElmId = null;
    let roundRectForMask = null;
    if (startTime !== null && endTime !== null) {
      masElmId = `TotalWorkingPeriod-${uuid()}`;
      const maskStartTime = actualWorkingPeriodList[0].startTime;
      const maskEndTime =
        actualWorkingPeriodList[actualWorkingPeriodList.length - 1].endTime;

      roundRectForMask = (
        <defs>
          <mask id={masElmId}>
            <rect
              x={maskStartTime * WIDTH_PX_OF_ONE_MINUTE}
              y={0}
              width={(maskEndTime - maskStartTime) * WIDTH_PX_OF_ONE_MINUTE}
              height="100%"
              rx={3}
              ry={3}
              fill="#fff"
            />
          </mask>
        </defs>
      );
    }

    // 個別の労働時間を表現する矩形のリスト
    const rectOfPeriodList = actualWorkingPeriodList.map((period) => {
      const params = {
        x: period.startTime * WIDTH_PX_OF_ONE_MINUTE,
        y: 0,
        width: (period.endTime - period.startTime) * WIDTH_PX_OF_ONE_MINUTE,
        height: '100%',
        fill: paletteForActualWorkingPeriods[period.type],
        key: `${period.type}-${period.startTime}-${period.endTime}`,
        mask: undefined,
      };

      if (masElmId) {
        params.mask = `url(#${masElmId})`;
      }

      return <rect {...params} />;
    });

    return (
      <div
        key="actual-working-hours"
        className={`${ROOT}__actual-working-hours`}
      >
        <svg className={`${ROOT}__bar-graph`} viewBox={VIEW_BOX_OF_BAR_BODY}>
          {roundRectForMask}
          {rectOfPeriodList}
        </svg>
      </div>
    );
  }

  /**
   * 出退勤時刻を示すマーカー▼（を含むレイヤー）
   */
  renderClockedTimes() {
    const { startTime, endTime } = this.props;
    const markers = [];

    // 出勤時刻のマーカー
    if (startTime !== null) {
      markers.push(
        <img
          className={`${ROOT}__clocked-time-marker`}
          style={{ left: startTime * WIDTH_PX_OF_ONE_MINUTE }}
          src={ImgArrowNarrowUnderBlue}
          alt={`in ${TimeUtil.toHHmm(startTime)}`}
          key="clocked-in-time-marker"
        />
      );
    }

    // 退勤時刻のマーカー
    if (endTime !== null) {
      markers.push(
        <img
          className={`${ROOT}__clocked-time-marker`}
          style={{ left: endTime * WIDTH_PX_OF_ONE_MINUTE }}
          src={ImgArrowNarrowUnderBlue}
          alt={`out ${TimeUtil.toHHmm(endTime)}`}
          key="clocked-out-time-marker"
        />
      );
    }

    return (
      <div key="clocked-times" className={`${ROOT}__clocked-times`}>
        {markers}
      </div>
    );
  }

  render() {
    const { dayType } = this.props;
    const className = classNames(ROOT, {
      [`${ROOT}--day-type-workday`]:
        dayType === AttRecordModel.DAY_TYPE.WORKDAY,
      [`${ROOT}--day-type-holiday`]:
        dayType === AttRecordModel.DAY_TYPE.HOLIDAY,
      [`${ROOT}--day-type-legal-holiday`]:
        dayType === AttRecordModel.DAY_TYPE.LEGAL_HOLIDAY,
    });

    return (
      <div className={className}>
        {this.renderLateNight()}
        {this.renderGrid()}
        {this.renderLeaveOfAbsence()}
        {this.renderAbsence()}
        {this.renderEffectualLeave()}
        {this.renderScheduledWorkingHours()}
        {this.renderActualWorkingHours()}
        {this.renderClockedTimes()}
      </div>
    );
  }
}
