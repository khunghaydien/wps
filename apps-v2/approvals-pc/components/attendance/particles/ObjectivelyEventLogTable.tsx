import * as React from 'react';

import Collapse from '@commons/components/CollapseWithAni';
import msg from '@commons/languages';

import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import ObjectivelyEventLogDetail from './ObjectivelyEventLogDetail';

import './ObjectivelyEventLogTable.scss';

const ROOT = 'approvals-pc-objective-detail-list-pane-detail-table';
const HEADER_ROOT =
  'approvals-pc-objective-detail-list-pane-detail-table-header';
const COLUMN_ROOT =
  'approvals-pc-objective-detail-list-pane-detail-table-column';

export type Props = {
  dailyObjectiveRecords: DailyObjectivelyEventLog[];
};

export default class DetailList extends React.Component<Props> {
  renderDetailList() {
    return this.props.dailyObjectiveRecords.map((detail) => {
      return <ObjectivelyEventLogDetail key={detail.id} item={detail} />;
    });
  }

  render() {
    if (!this.props.dailyObjectiveRecords) {
      return null;
    }

    return (
      <div className={`${ROOT}__table`}>
        <Collapse title={msg().Att_Lbl_ObjectivelyEventLogDetails}>
          <div className={`${ROOT}`}>
            <div className={`${ROOT}__scrollable`}>
              <div>
                <div className={`${HEADER_ROOT}`} role="row">
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--date`}
                    role="columnheader"
                  >
                    {msg().Com_Lbl_Date}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--attendance`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_Attendance}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--enterLog`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_ObjectivelyEventLogEventTypeIn}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--enteringReason`}
                    role="columnheader"
                  >
                    {
                      msg()
                        .Att_Lbl_ObjectivelyEventLogDeviatedEnteringTimeReason
                    }
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--timeOut`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_TimeOut}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--leavingLog`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_ObjectivelyEventLogEventTypeOut}
                  </div>
                  <div
                    className={`${HEADER_ROOT}__cell ${COLUMN_ROOT}--leavingReason`}
                    role="columnheader"
                  >
                    {msg().Att_Lbl_ObjectivelyEventLogDeviatedLeavingTimeReason}
                  </div>
                </div>
                {this.renderDetailList()}
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}
