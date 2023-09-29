import * as React from 'react';

import msg from '../../../commons/languages';

import { ObjectivelyEventLogDailyRecord } from '../models/types';

import ObjectivelyEvnetLogDetail from './DetailObjectivelyEvnetLog';

import './DetailList.scss';

const ROOT = 'timesheet-pc-objectively-event-log-detail-list';

export type Props = {
  dailyRecordList: ObjectivelyEventLogDailyRecord[];
};

export default class DetailList extends React.Component<Props> {
  renderDetailList() {
    return this.props.dailyRecordList.map<React.ReactElement<'tr'>>(
      (_detail, _index) => {
        return (
          <ObjectivelyEvnetLogDetail
            key={_index}
            dailyRecordItem={_detail}
            recordDate={_detail.attRecord.recordDate}
          />
        );
      }
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          <caption>{msg().Att_Lbl_ObjectivelyEventLogDetails}</caption>
          <thead>
            <tr>
              <th>{msg().Com_Lbl_Date}</th>
              {/* 出勤 */}
              <th>{msg().Att_Lbl_Attendance}</th>
              {/* // IN */}
              <th>{msg().Att_Lbl_ObjectivelyEventLogEventTypeIn}</th>
              {/* // 入館乖離理由 */}
              <th>
                {msg().Att_Lbl_ObjectivelyEventLogDeviatedEnteringTimeReason}
              </th>
              {/* // 退勤 */}
              <th>{msg().Att_Lbl_TimeOut}</th>
              {/* // OUT */}
              <th>{msg().Att_Lbl_ObjectivelyEventLogEventTypeOut}</th>
              {/* // 退館乖離理由 */}
              <th>
                {msg().Att_Lbl_ObjectivelyEventLogDeviatedLeavingTimeReason}
              </th>
            </tr>
          </thead>
          <tbody>{this.renderDetailList()}</tbody>
        </table>
      </div>
    );
  }
}
