import * as React from 'react';

import msg from '../../../commons/languages';

import { AllowanceDailyRecord } from '../models/types';

import DetailAllowance from './DetailAllowance';

import './DetailList.scss';

const ROOT = 'timesheet-pc-allowance-detail-list';

export type Props = {
  dailyRecordList: AllowanceDailyRecord[];
};

export default class DetailList extends React.Component<Props> {
  renderDetailList() {
    return this.props.dailyRecordList.map<React.ReactElement<'tr'>>(
      (_detail, _index) => {
        return (
          <DetailAllowance
            key={_index}
            dailyAllowanceList={_detail.dailyAllowanceList}
            recordDate={_detail.recordDate}
          />
        );
      }
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          <caption>{msg().Att_Lbl_AllowanceDailyDetails}</caption>
          <thead>
            <tr>
              <th>{msg().Com_Lbl_Date}</th>
              <th>{msg().Att_Lbl_AllowanceName}</th>
              <th>{msg().Att_Lbl_AllowanceCode}</th>
              <th>{msg().Att_Lbl_AllowanceTotalTime}</th>
              <th>{msg().Att_Lbl_AllowanceStartEndTime}</th>
              <th>{msg().Att_Lbl_AllowanceQuantity}</th>
            </tr>
          </thead>
          <tbody>{this.renderDetailList()}</tbody>
        </table>
      </div>
    );
  }
}
