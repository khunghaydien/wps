import * as React from 'react';

import classNames from 'classnames';

import TimeUtil from '@commons/utils/TimeUtil';

import {
  ATTENTION_TYPE,
  DailyObjectivelyEventLog,
  getAttentionType,
  ObjectivelyEventLogRecord,
  ObjectivelyEventLogSetting,
} from '@attendance/domain/models/DailyObjectivelyEventLog';

import { label } from '@attendance/ui/helpers/attendanceSummary/objectivelyEventLog';
import { date } from '@attendance/ui/helpers/attendanceSummary/record';

import './ObjectivelyEventLogDetail.scss';
import './ObjectivelyEventLogTable.scss';

const ITEM_ROOT =
  'approvals-pc-objective-detail-list-pane-detail-table-row-item';
const COLUMN_ROOT =
  'approvals-pc-objective-detail-list-pane-detail-table-column';

export type Props = {
  item: DailyObjectivelyEventLog;
};

export default class ObjectivelyEventLogDetail extends React.Component<Props> {
  /**
   * FIXME: ビジネスロジックが埋め込まれているのでモバイルに移植する時に共通化したい
   * @description 客観情報ログ明細の表示文字
   * @return 客観情報ログ設定の判定結果
   * @key index
   */
  renderDetailLogInfo({
    key,
    inputTime,
    setting,
    record,
    requireDeviationReason,
    allowingDeviationTime,
  }: {
    key: string;
    inputTime: number | null;
    setting: ObjectivelyEventLogSetting;
    record: ObjectivelyEventLogRecord;
    requireDeviationReason: boolean;
    allowingDeviationTime: number | null;
  }): React.ReactElement {
    // 設定がない場合
    if (setting.id === null) {
      return null;
    }
    const over = getAttentionType({
      inputTime,
      record,
      allowingDeviationTime,
      requireDeviationReason,
    });
    return (
      <p
        key={key}
        className={classNames({
          [`${ITEM_ROOT}__objective--error`]: over === ATTENTION_TYPE.ERROR,
        })}
      >
        {label(setting.name, record, allowingDeviationTime)}
      </p>
    );
  }

  render() {
    const { item } = this.props;
    return (
      <div className={`${ITEM_ROOT}--is-ellipsis`}>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--date ${COLUMN_ROOT}--date`}
        >
          <div className={`${ITEM_ROOT}__objective-date`}>
            {date(item.recordDate)}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--attendance ${COLUMN_ROOT}--attendance`}
        >
          <div className={`${ITEM_ROOT}__objective-attendance`}>
            {item.inpStartTime ? TimeUtil.toHHmm(item.inpStartTime) : ''}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--enterLog ${COLUMN_ROOT}--enterLog`}
        >
          <div className={`${ITEM_ROOT}__objective-enterLog`}>
            {item.logs
              .filter((log) => log)
              .map((log, idx) => {
                return this.renderDetailLogInfo({
                  key: `${log.entering.id}-${idx}`,
                  inputTime: item.inpStartTime,
                  setting: log.setting,
                  record: log.entering,
                  requireDeviationReason: log.requireDeviationReason,
                  allowingDeviationTime: log.allowingDeviationTime,
                });
              })}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--enteringReason ${COLUMN_ROOT}--enteringReason`}
        >
          <div className={`${ITEM_ROOT}__objective-enteringReason`}>
            <div>{item.deviatedEnteringTimeReason.label}</div>
            <div>{item.deviatedEnteringTimeReason.text}</div>
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--timeOut ${COLUMN_ROOT}--timeOut`}
        >
          <div className={`${ITEM_ROOT}__objective-timeOut`}>
            {item.inpEndTime ? TimeUtil.toHHmm(item.inpEndTime) : ''}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--leavingLog ${COLUMN_ROOT}--leavingLog`}
        >
          <div className={`${ITEM_ROOT}__objective-leavingLog`}>
            {item.logs
              .filter((log) => log)
              .map((log, idx) => {
                return this.renderDetailLogInfo({
                  key: `${log.leaving.id}-${idx}`,
                  inputTime: item.inpEndTime,
                  setting: log.setting,
                  record: log.leaving,
                  allowingDeviationTime: log.allowingDeviationTime,
                  requireDeviationReason: log.requireDeviationReason,
                });
              })}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--leavingReason ${COLUMN_ROOT}--leavingReason`}
        >
          <div className={`${ITEM_ROOT}__objective-leavingReason`}>
            <div>{item.deviatedLeavingTimeReason.label}</div>
            <div>{item.deviatedLeavingTimeReason.text}</div>
          </div>
        </div>
      </div>
    );
  }
}
