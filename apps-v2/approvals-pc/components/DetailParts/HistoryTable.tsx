import React from 'react';

import HistoryTableInner from '../../../commons/components/tables/HistoryTable';
import msg from '../../../commons/languages';
import Collapse from '@commons/components/CollapseWithAni';

import { ApprovalHistoryList } from '../../../domain/models/approval/request/History';

import './HistoryTable.scss';

const ROOT = 'approvals-pc-tracking-detail-parts-history-table';

type Props = ApprovalHistoryList & {
  isEllipsis?: boolean;
  isExp?: boolean;
};

export default class HistoryTable extends React.Component<Props> {
  static defaultProps = {
    isEllipsis: false,
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <Collapse title={msg().Appr_Lbl_HistoryList}>
          <HistoryTableInner
            historyList={this.props.historyList}
            isEllipsis={this.props.isEllipsis}
            isExp={this.props.isExp}
          />
        </Collapse>
      </div>
    );
  }
}
