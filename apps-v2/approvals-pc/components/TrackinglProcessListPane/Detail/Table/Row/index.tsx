import React from 'react';

import _ from 'lodash';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';

import Summary from './Summary';
import Task from './Task';

import '../column.scss';
import './index.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table-row';
const COLUMN_ROOT =
  'approvals-pc-tracking-process-list-pane-detail-table-column';

type Props = {
  dailyTrack: DailyTrackList[string];
  dateStr: string;
  isEllipsis: boolean;
  showComment: boolean;
};
export default class Item extends React.Component<Props> {
  renderTask = (task, i) => {
    return (
      <div key={i} className={`${ROOT}__task-wrapper`}>
        <Task
          index={i}
          task={task}
          showComment={this.props.showComment}
          isEllipsis={this.props.isEllipsis}
        />
      </div>
    );
  };

  render() {
    if (_.isEmpty(this.props.dailyTrack)) {
      return (
        <section className={`${ROOT}`}>
          <header className={`${ROOT}__item ${COLUMN_ROOT}--date`}>
            <div className={`${ROOT}__item-date-inner`}>
              {this.props.dateStr}
            </div>
          </header>
          <div className={`${ROOT}__content ${ROOT}__empty-content`}>
            <div className={`${ROOT}__item ${COLUMN_ROOT}--name`} />
            <div className={`${ROOT}__item ${COLUMN_ROOT}--work-time`} />
            {this.props.showComment && (
              <div className={`${ROOT}__item ${COLUMN_ROOT}--comment`} />
            )}
          </div>
        </section>
      );
    } else {
      return (
        <section className={`${ROOT}`}>
          <header className={`${ROOT}__item ${COLUMN_ROOT}--date`}>
            <div className={`${ROOT}__item-date-inner`}>
              {this.props.dateStr}
            </div>
          </header>
          <div className={`${ROOT}__content`}>
            {this.props.dailyTrack.recordItemList.map(this.renderTask)}
            <Summary
              sumTaskTime={this.props.dailyTrack.sumTaskTime}
              note={this.props.dailyTrack.note}
              showComment={this.props.showComment}
              isEllipsis={this.props.isEllipsis}
            />
          </div>
        </section>
      );
    }
  }
}
