import React from 'react';

import _ from 'lodash';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { DailyAllowanceList } from '@attendance/domain/models/approval/Allowance';

import './AllowanceTable.scss';
import './AllowanceDetail.scss';

const ROOT = 'approvals-pc-allowance-detail-list-pane-detail-table-row';
const ITEM_ROOT =
  'approvals-pc-allowance-detail-list-pane-detail-table-row-item';
const COLUMN_ROOT =
  'approvals-pc-allowance-detail-list-pane-detail-table-column';

const formatDate = (recordDate: string): string => {
  return DateUtil.formatMDW(recordDate as any);
};

const formatTotalTime = (totalTime: number | null | undefined): string => {
  return TimeUtil.toHHmm(totalTime);
};

const formatTimeRange = (
  startTime: number | null | undefined,
  endTime: number | null | undefined
): string => {
  return (startTime !== null && startTime !== undefined) ||
    (endTime !== null && endTime !== undefined)
    ? `${TextUtil.template(
        msg().Att_Msg_Range,
        TimeUtil.toHHmm(startTime),
        TimeUtil.toHHmm(endTime)
      )}`
    : '';
};

export type Props = {
  recordDate: string;
  dailyAllowanceList: DailyAllowanceList[];
};

export default class AllowanceDetail extends React.Component<Props> {
  renderAllowance = (_records, _index) => {
    return (
      <div key={_index} className={`${ITEM_ROOT}--is-ellipsis`}>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--name ${COLUMN_ROOT}--name`}
        >
          <div className={`${ITEM_ROOT}__allowance-name`}>
            {_records.allowanceName}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--code ${COLUMN_ROOT}--code`}
        >
          <div className={`${ITEM_ROOT}__allowance-code`}>
            {_records.allowanceCode}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--totalTime ${COLUMN_ROOT}--totalTime`}
        >
          <div className={`${ITEM_ROOT}__allowance-totalTime`}>
            {_records.managementType === 'Hours' ||
            _records.managementType === 'StartEndTime'
              ? formatTotalTime(_records.totalTime)
              : null}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--startEndTime ${COLUMN_ROOT}--startEndTime`}
        >
          <div className={`${ITEM_ROOT}__allowance-startEndTime`}>
            {_records.managementType === 'StartEndTime'
              ? formatTimeRange(_records.startTime, _records.endTime)
              : null}
          </div>
        </div>
        <div
          className={`${ITEM_ROOT}__item ${ITEM_ROOT}__item--quantity ${COLUMN_ROOT}--quantity`}
        >
          <div className={`${ITEM_ROOT}__allowance-quantity`}>
            {_records.managementType === 'Quantity' ? _records.quantity : null}
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (_.isEmpty(this.props.dailyAllowanceList)) {
      return null;
    } else {
      return (
        <section className={`${ROOT}`}>
          <header className={`${ROOT}__item ${COLUMN_ROOT}--date`}>
            <div className={`${ROOT}__item-date-inner`}>
              {formatDate(this.props.recordDate)}
            </div>
          </header>
          <div className={`${ROOT}__content`}>
            <div className={`${ROOT}__allowance-wrapper`}>
              {this.props.dailyAllowanceList.map(this.renderAllowance)}
            </div>
          </div>
        </section>
      );
    }
  }
}
