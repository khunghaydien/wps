import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { LeaveOfAbsencePeriodStatus } from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

import DataGrid from '../../../components/DataGrid';

import './HistoryList.scss';

const ROOT = 'admin-pc-leave-of-absence-period-status-detail-pane-history-list';

const formatDate = (dateStr) => {
  return <span>{DateUtil.formatYMD(dateStr.value)}</span>;
};

export type Props = {
  historyList: LeaveOfAbsencePeriodStatus[];
  onClickEditButton: (arg0: LeaveOfAbsencePeriodStatus) => void;
};

export default class HistoryList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.formatEditButton = this.formatEditButton.bind(this);
  }

  // eslint-disable-next-line react/no-unused-prop-types
  formatEditButton(props: { value: string }) {
    return (
      <Button
        type="default"
        className={`${ROOT}__edit-button`}
        onClick={() => {
          const target = this.props.historyList.filter(
            (periodStatus) => periodStatus.id === props.value
          )[0];
          this.props.onClickEditButton(target);
        }}
      >
        {msg().Com_Btn_Edit}
      </Button>
    );
  }

  render() {
    const CELL_HORIZONTAL_PADDING = 10 * 2;
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__heading`}>{msg().Admin_Lbl_History}</div>
        <DataGrid
          columns={[
            {
              key: 'validDateFrom',
              name: msg().Admin_Lbl_StartDate,
              formatter: formatDate,
              width: 140 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
            {
              key: 'validDateThrough',
              name: msg().Admin_Lbl_EndDate,
              formatter: formatDate,
              width: 140 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
            {
              key: 'leaveOfAbsenceName',
              name: msg().Admin_Lbl_LeaveOfAbsence,
              resizable: true,
            },
            {
              key: 'comment',
              name: msg().Admin_Lbl_Comment,
              resizable: true,
            },
            {
              key: 'id',
              name: '',
              formatter: this.formatEditButton,
              width: 70 + CELL_HORIZONTAL_PADDING,
              resizable: true,
            },
          ]}
          rows={this.props.historyList}
          numberOfRowsVisibleWithoutScrolling={8}
        />
      </div>
    );
  }
}
