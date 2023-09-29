import React, { useMemo } from 'react';

import msg from '../../../commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { DailyRestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

import DetailRestReason from './DetailRestReason';

import './DetailList.scss';

const ROOT = 'timesheet-pc-rest-detail-list';

export type Props = {
  dailyRestList: DailyRestRecord[];
};

const DetailList: React.FC<Props> = ({ dailyRestList }) => {
  const newdailyRestRecordList: DailyRestRecord[] = useMemo(() => {
    return dailyRestList.filter(
      (item) => item.recordDate && item.restRecords.length > 0
    );
  }, [dailyRestList]);

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
      <DetailRestReason
        key={index}
        dailyRestList={detail.restRecords}
        recordDate={detail.recordDate}
        mdw={differMonthIndex.includes(index)}
      />
    );
  };

  return (
    <div className={ROOT}>
      <table className={`${ROOT}__table`}>
        <caption>{msg().Att_Lbl_RestReasonDailyDetails}</caption>
        <thead>
          <tr>
            <th>{msg().Com_Lbl_Date}</th>
            <th>{msg().$Att_Lbl_RestReason}</th>
            <th>{msg().Att_Lbl_RestReasonCode}</th>
            <th>{msg().Att_Lbl_RestReasonStartEndTime}</th>
            <th>{msg().Att_Lbl_RestReasonTime}</th>
          </tr>
        </thead>
        <tbody>{newdailyRestRecordList.map(renderDetailList)}</tbody>
      </table>
    </div>
  );
};

export default DetailList;
