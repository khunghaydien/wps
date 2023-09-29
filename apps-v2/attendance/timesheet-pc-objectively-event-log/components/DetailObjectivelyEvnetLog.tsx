import * as React from 'react';

import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import { ObjectivelyEventLogDailyRecord } from '../models/types';

import { date } from '@attendance/ui/helpers/attendanceSummary/record';

import './DetailList.scss';

const ROOT = 'timesheet-pc-objectively-event-log-detail-list';

export type Props = {
  recordDate: string;
  dailyRecordItem: ObjectivelyEventLogDailyRecord;
};

export default class ObjectivelyEvnetLogDetail extends React.Component<Props> {
  /**
   * @description 客観情報ログ明細の表示文字
   * @param objectivelyEventLogSettingId 客観情報ログの設定ID「objectivelyEventLogSettingId」
   * @param EventLogId 客観情報ログ明細ID「enteringEventLogId」
   * @param inpTime 打刻時間「inpStartTime」
   * @param requireReason 乖離理由「requireDeviationReason」
   * @param deviatedTimeFormula 乖離時間(計算後)「deviatedLeavingTime」
   * @param allowingDeviationTime 乖離時間許容時間「allowingDeviationTime」
   * @param objectivelyEventLogSettingName 客観情報ログName「objectivelyEventLogSettingName」
   * @param logTime 客観情報ログTime「enteringTime」
   * @return 客観情報ログ設定の判定結果
   */

  renderDetailLogInfo(
    objectivelyEventLogSettingId: string,
    EventLogId: string,
    inpTime: number,
    requireReason: boolean,
    deviatedTimeFormula: number,
    allowingDeviationTime: number,
    objectivelyEventLogSettingName: string,
    logTime: number
  ) {
    if (objectivelyEventLogSettingId !== null) {
      if (EventLogId === null) {
        return (
          <p style={inpTime && requireReason ? { color: 'red' } : null}>
            {TextUtil.template(
              msg().Att_Lbl_NoDeviatedData,
              `${objectivelyEventLogSettingName}`
            )}
          </p>
        );
      } else {
        //  name + 时间
        if (inpTime !== null && allowingDeviationTime !== null) {
          const absDeviatedTime = Math.abs(deviatedTimeFormula);
          const compareResult = absDeviatedTime - allowingDeviationTime;
          if (compareResult > 0) {
            return (
              <p style={requireReason ? { color: 'red' } : null}>
                {TextUtil.template(
                  msg().Att_Lbl_DeviatedTime,
                  `${objectivelyEventLogSettingName}`,
                  `${TimeUtil.toHHmm(logTime)}`,
                  `${Math.abs(deviatedTimeFormula)}`
                )}
              </p>
            );
          } else {
            return (
              <p>
                {objectivelyEventLogSettingName}&nbsp;
                {TimeUtil.toHHmm(logTime)}
              </p>
            );
          }
        } else {
          return (
            <p style={requireReason ? { color: 'red' } : null}>
              {objectivelyEventLogSettingName}&nbsp;
              {TimeUtil.toHHmm(logTime)}
            </p>
          );
        }
      }
    } else {
      return null;
    }
  }

  render() {
    const { recordDate, dailyRecordItem } = this.props;
    return (
      <tr>
        <td className={`${ROOT}__record-date`}>{date(recordDate)}</td>
        <td className={`${ROOT}__objectively-event-log-time`}>
          {dailyRecordItem.attRecord.inpStartTime
            ? TimeUtil.toHHmm(dailyRecordItem.attRecord.inpStartTime)
            : ''}
        </td>
        <td className={`${ROOT}__objectively-event-log-detail`}>
          {dailyRecordItem.inLogList.map((item) => {
            return this.renderDetailLogInfo(
              item.objectivelyEventLogSettingId,
              item.enteringEventLogId,
              dailyRecordItem.attRecord.inpStartTime,
              item.requireDeviationReason,
              item.deviatedEnteringTime,
              item.allowingDeviationTime,
              item.objectivelyEventLogSettingName,
              item.enteringTime
            );
          })}
        </td>
        <td className={`${ROOT}__objectively-event-log-reason`}>
          <div>{dailyRecordItem.deviatedEnteringTimeReasonSelectedLabel}</div>
          <div>{dailyRecordItem.deviatedEnteringTimeReason}</div>
        </td>
        <td className={`${ROOT}__objectively-event-log-time`}>
          {dailyRecordItem.attRecord.inpEndTime
            ? TimeUtil.toHHmm(dailyRecordItem.attRecord.inpEndTime)
            : ''}
        </td>
        <td className={`${ROOT}__objectively-event-log-detail`}>
          {dailyRecordItem.outLogList.map((item) => {
            return this.renderDetailLogInfo(
              item.objectivelyEventLogSettingId,
              item.leavingEventLogId,
              dailyRecordItem.attRecord.inpEndTime,
              item.requireDeviationReason,
              item.deviatedLeavingTime,
              item.allowingDeviationTime,
              item.objectivelyEventLogSettingName,
              item.leavingTime
            );
          })}
        </td>
        <td className={`${ROOT}__objectively-event-log-reason`}>
          <div>{dailyRecordItem.deviatedLeavingTimeReasonSelectedLabel}</div>
          <div>{dailyRecordItem.deviatedLeavingTimeReason} </div>
        </td>
      </tr>
    );
  }
}
