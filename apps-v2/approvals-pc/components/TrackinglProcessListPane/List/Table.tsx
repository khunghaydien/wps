import React from 'react';

import MessageBoard from '../../../../commons/components/MessageBoard';
import imgIconDoneCircle from '../../../../commons/images/iconDoneCircle.png';
import msg from '../../../../commons/languages';

import TableBodyRow from './TableBodyRow';

import './Table.scss';
import './Column.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-list-table';
const COLUMN_ROOT = 'approvals-pc-tracking-process-list-pane-list-column';

type Props = {
  browseDetail: any;
  selectedRequestId: string;
  requestList: Array<any>;
};
export default class Table extends React.Component<Props> {
  onClickLabel = (e) => {
    // 行選択時に詳細移動してしまうことをを防ぐ
    e.stopPropagation();
    // フォーカスが背後の行へ移ることを防ぐ
    e.target.focus();
  };

  isSelected = (request) => {
    return this.props.selectedRequestId === request.id;
  };

  renderRow = (request) => {
    return (
      <TableBodyRow
        request={request}
        key={request.id}
        browseDetail={this.props.browseDetail}
        selected={this.isSelected(request)}
      />
    );
  };

  renderBody = () => {
    if (this.props.requestList.length > 0) {
      return this.props.requestList.map(this.renderRow);
    } else {
      return (
        <MessageBoard
          message={msg().Appr_Msg_EmptyRequestList}
          iconSrc={imgIconDoneCircle}
        />
      );
    }
  };

  render() {
    return (
      <div className={`${ROOT}`} role="grid">
        <div className={`${ROOT}__head`}>
          <div className={`${ROOT}__row`} role="row">
            <div
              className={`${ROOT}__cell-head ${COLUMN_ROOT}__select`}
              role="columnheader"
            >
              <label
                className={`${ROOT}__input-wrapper`}
                onClick={this.onClickLabel}
              >
                <input type="checkbox" />
              </label>
            </div>

            <div
              className={`${ROOT}__cell-head ${COLUMN_ROOT}__alert`}
              role="columnheader"
            />

            <div
              className={`${ROOT}__cell-head ${COLUMN_ROOT}__name`}
              role="columnheader"
            >
              {msg().Appr_Lbl_EmployeeName}&#xA0;/&#xA0;
              {msg().Appr_Lbl_DepartmentName}
            </div>

            <div
              className={`${ROOT}__cell-head ${COLUMN_ROOT}__period`}
              role="columnheader"
            >
              {msg().Appr_Lbl_Period}
            </div>

            <div
              className={`${ROOT}__cell-head ${COLUMN_ROOT}__date`}
              role="columnheader"
            >
              {msg().Appr_Lbl_RequestDate}
            </div>
          </div>
        </div>

        <div className={`${ROOT}__body`}>{this.renderBody()}</div>
      </div>
    );
  }
}
