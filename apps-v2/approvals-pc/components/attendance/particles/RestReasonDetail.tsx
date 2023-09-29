import React from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';
import TimeUtil from '@commons/utils/TimeUtil';

import { RestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

import { date } from '@attendance/ui/helpers/attendanceSummary/record';

import './RestReasonTable.scss';
import './RestReasonDetail.scss';

const ROOT = 'approvals-pc-restReason-detail-list-pane-detail-table-row';
const ITEM_ROOT =
  'approvals-pc-restReason-detail-list-pane-detail-table-row-item';
const COLUMN_ROOT =
  'approvals-pc-restReason-detail-list-pane-detail-table-column';

const formatTimeRange = (
  startTime: number | null | undefined,
  endTime: number | null | undefined
): string => {
  return typeof startTime === 'number' && typeof endTime === 'number'
    ? `${TextUtil.template(
        msg().Att_Msg_Range,
        TimeUtil.toHHmm(startTime),
        TimeUtil.toHHmm(endTime)
      )}`
    : '';
};

const formatTotalTime = (totalTime: number | null | undefined): string => {
  return TimeUtil.toHHmm(totalTime);
};

export type Props = {
  recordDate: string;
  restRecords: RestRecord[];
  mdw: boolean;
};

const RestReasonDetail: React.FC<Props> = (props: Props) => {
  if (isEmpty(props.restRecords)) {
    return null;
  } else {
    const renderRest = (records, index) => {
      return (
        <div key={index} className={`${ITEM_ROOT}--is-ellipsis`}>
          <div
            className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--name ${COLUMN_ROOT}--name`}
          >
            <div className={`${ITEM_ROOT}__restReason-name`}>
              {records.restReasonName}
            </div>
          </div>
          <div
            className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--code ${COLUMN_ROOT}--code`}
          >
            <div className={`${ITEM_ROOT}__restReason-code`}>
              {records.restReasonCode}
            </div>
          </div>
          <div
            className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--startEndTime ${COLUMN_ROOT}--startEndTime`}
          >
            <div className={`${ITEM_ROOT}__restReason-startEndTime`}>
              {formatTimeRange(records.outStartTime, records.outEndTime)}
            </div>
          </div>
          <div
            className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--totalTime ${COLUMN_ROOT}--totalTime`}
          >
            <div className={`${ITEM_ROOT}__restReason-outRestTime`}>
              {formatTotalTime(records.outRestTime)}
            </div>
          </div>
        </div>
      );
    };
    return (
      <section className={`${ROOT}`}>
        <header className={`${COLUMN_ROOT}--date`}>
          <div className={`${ROOT}__item-date-inner`}>
            {date(props.recordDate, props.mdw)}
          </div>
        </header>
        <div className={`${ROOT}__content`}>
          <div className={`${ROOT}__restReason-wrapper`}>
            {props.restRecords.map(renderRest)}
          </div>
        </div>
      </section>
    );
  }
};
export default RestReasonDetail;
