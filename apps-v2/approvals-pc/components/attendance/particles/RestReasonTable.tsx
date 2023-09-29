import React, { useMemo } from 'react';

import Collapse from '@commons/components/CollapseWithAni';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { DailyRestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

import RestReasonDetail from './RestReasonDetail';

import './RestReasonTable.scss';

const ROOT = 'approvals-pc-restReason-detail-list-pane-detail-table';
const HEADER_ROOT =
  'approvals-pc-restReason-detail-list-pane-detail-table-header';
const COLUMN_ROOT =
  'approvals-pc-restReason-detail-list-pane-detail-table-column';

type Props = {
  dailyRestRecordList: DailyRestRecord[];
};

const RestReasonTable: React.FC<Props> = ({ dailyRestRecordList }) => {
  const newdailyRestRecordList: DailyRestRecord[] = useMemo(() => {
    return dailyRestRecordList.filter(
      (item) => item.recordDate && item.restRecords.length > 0
    );
  }, [dailyRestRecordList]);

  const differMonthIndex = useMemo(() => {
    const indexes = [];
    newdailyRestRecordList.forEach((item, index) => {
      if (index === 0) {
        indexes.push(index);
      } else if (
        DateUtil.getMonth(item.recordDate) !==
        DateUtil.getMonth(
          newdailyRestRecordList[index - 1 > 0 ? index - 1 : 0].recordDate
        )
      ) {
        indexes.push(index);
      }
    });
    return indexes;
  }, [newdailyRestRecordList]);

  const renderDetailList = (detail, index) => {
    return (
      <RestReasonDetail
        key={index}
        restRecords={detail.restRecords}
        recordDate={detail.recordDate}
        mdw={differMonthIndex.includes(index)}
      />
    );
  };

  return (
    <div className={`${ROOT}__table`}>
      <Collapse title={msg().$Att_Lbl_RestReason}>
        <div className={`${ROOT}`}>
          <div className={`${ROOT}__scrollable`}>
            <div>
              <div className={`${HEADER_ROOT}`} role="row">
                <div
                  className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--date`}
                  role="columnheader"
                >
                  {msg().Att_Lbl_Date}
                </div>
                <div
                  className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--name`}
                  role="columnheader"
                >
                  {msg().$Att_Lbl_RestReason}
                </div>
                <div
                  className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--code`}
                  role="columnheader"
                >
                  {msg().Att_Lbl_RestReasonCode}
                </div>
                <div
                  className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--startEndTime`}
                  role="columnheader"
                >
                  {msg().Att_Lbl_RestReasonStartEndTime}
                </div>
                <div
                  className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--totalTime`}
                  role="columnheader"
                >
                  {msg().Att_Lbl_RestReasonTime}
                </div>
              </div>
              {newdailyRestRecordList.map(renderDetailList)}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default RestReasonTable;
