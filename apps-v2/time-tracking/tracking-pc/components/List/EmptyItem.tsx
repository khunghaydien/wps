import React from 'react';

import './EmptyItem.scss';
import './column.scss';
import './index.scss';

const ROOT = 'tracking-pc-list-empty-item';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  dateStr: string;
  note: string | null | undefined;
};

export default class EmptyItem extends React.Component<Props> {
  static defaultProps = {
    note: '',
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <header className={`${ROOT}__item--date ${COLUMN_ROOT}--date`}>
          <div className={`${ROOT}__item-date-inner`}>{this.props.dateStr}</div>
        </header>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--name`} />
        <div className={`${ROOT}__item ${COLUMN_ROOT}--tracking-graph`} />
        <div className={`${ROOT}__item ${COLUMN_ROOT}--work-time`} />
        <div className={`${ROOT}__item ${COLUMN_ROOT}--comment`}>
          {this.props.note}
        </div>
      </div>
    );
  }
}
