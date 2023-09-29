import React from 'react';

import classNames from 'classnames';

import DateUtil from '../../../../commons/utils/DateUtil';

import './TableBodyRow.scss';
import './Column.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-list-table-body-row';
const COLUMN_ROOT = 'approvals-pc-tracking-process-list-pane-list-column';

type Props = {
  request: any;
  browseDetail: any;
  selected: boolean;
};
export default class TableBodyRow extends React.Component<Props> {
  onClickLabel = (e) => {
    // 行選択時に詳細移動してしまうことをを防ぐ
    e.stopPropagation();
    // フォーカスが背後の行へ移ることを防ぐ
    e.target.focus();
  };

  onClickRow = () => {
    this.props.browseDetail(this.props.request.id);
  };

  render() {
    const cssClass = classNames(ROOT, {
      [`${ROOT}--selected`]: this.props.selected,
    });

    let rowButtonRole = 'button';
    let rowButtonTabIndex = 0;
    let onClickRow = this.onClickRow;

    // 選択済み申請の場合はクリック対象から外す
    if (this.props.selected) {
      rowButtonTabIndex = null;
      rowButtonRole = '';
      onClickRow = null;
    }

    return (
      <div className={cssClass} role="row">
        <div
          className={`${ROOT}__selection`}
          role={rowButtonRole}
          tabIndex={rowButtonTabIndex}
          onClick={onClickRow}
        >
          <div
            className={`${ROOT}__cell ${ROOT}__cell--select ${COLUMN_ROOT}__select`}
            role="gridcell"
          >
            <label
              className={`${ROOT}__input-wrapper`}
              onClick={this.onClickLabel}
            >
              <input type="checkbox" />
            </label>
          </div>

          <div
            className={`${ROOT}__cell ${COLUMN_ROOT}__alert`}
            role="columnheader"
          />

          <div
            className={`${ROOT}__cell ${ROOT}__cell--name ${COLUMN_ROOT}__name`}
            role="columnheader"
          >
            <div className={`${ROOT}__cell-name`}>
              <img
                className={`${ROOT}__cell-name-icon`}
                alt=""
                src={this.props.request.photoUrl}
              />
              <div className={`${ROOT}__cell-name-body`}>
                {this.props.request.employeeName}
                <br />
                <span className={`${ROOT}__cell-name-department`}>
                  {this.props.request.departmentName}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${ROOT}__cell ${COLUMN_ROOT}__period`}
            role="columnheader"
          >
            {`${DateUtil.formatYMD(
              this.props.request.startDate
            )} - ${DateUtil.formatYMD(this.props.request.endDate)}`}
          </div>

          <div
            className={`${ROOT}__cell ${COLUMN_ROOT}__date`}
            role="columnheader"
          >
            {DateUtil.formatYMD(this.props.request.date)}
          </div>
        </div>
      </div>
    );
  }
}
