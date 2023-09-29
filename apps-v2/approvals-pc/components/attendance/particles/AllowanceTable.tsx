import React from 'react';

import Collapse from '@commons/components/CollapseWithAni';
import msg from '@commons/languages';

import { DailyAllowanceRecord } from '@attendance/domain/models/approval/Allowance';

import AllowanceDetail from './AllowanceDetail';

import './AllowanceTable.scss';

const ROOT = 'approvals-pc-allowance-detail-list-pane-detail-table';
const HEADER_ROOT =
  'approvals-pc-allowance-detail-list-pane-detail-table-header';
const COLUMN_ROOT =
  'approvals-pc-allowance-detail-list-pane-detail-table-column';

type Props = {
  dailyAllowanceRecordList: DailyAllowanceRecord[];
};

export default class AllowanceTable extends React.Component<Props> {
  renderDetailList = (_detail, _index) => {
    return (
      <AllowanceDetail
        key={_index}
        dailyAllowanceList={_detail.dailyAllowanceList}
        recordDate={_detail.recordDate}
      />
    );
  };

  render() {
    return (
      <div className={`${ROOT}__table`}>
        <Collapse title={msg().Att_Lbl_AllowanceDailyDetails}>
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
                    {msg().Att_Lbl_AllowanceName}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--code`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_AllowanceCode}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--totalTime`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_AllowanceTotalTime}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--startEndTime`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_AllowanceStartEndTime}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--quantity`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_AllowanceQuantity}
                  </div>
                </div>
                {this.props.dailyAllowanceRecordList.map(this.renderDetailList)}
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}
