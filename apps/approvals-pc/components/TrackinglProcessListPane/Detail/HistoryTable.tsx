import React from 'react';

import HistoryTable from '../../../../commons/components/tables/HistoryTable';

import { ApprovalHistory } from '../../../../domain/models/approval/request/History';

type Props = {
  historyList: ApprovalHistory[];
  isEllipsis: boolean;
};

export default (props: Props) => <HistoryTable {...props} />;
