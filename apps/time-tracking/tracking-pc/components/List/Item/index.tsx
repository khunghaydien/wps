import React from 'react';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

import Summary from './Summary';
import Task from './Task';

import '../column.scss';
import './index.scss';

const ROOT = 'tracking-pc-list-item';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  dailyTrack: DailyTrackList[string];
  taskList: Record<string, TaskForMonthlyReportSummary>;
  dateStr: string;
};

export default class Item extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.renderTask = this.renderTask.bind(this);
  }

  renderTask(task, i) {
    return (
      <div key={i} className={`${ROOT}__task-wrapper`}>
        <Task index={i} task={task} taskList={this.props.taskList} />
      </div>
    );
  }

  render() {
    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__item ${COLUMN_ROOT}--date`}>
          <div className={`${ROOT}__item-date-inner`}>{this.props.dateStr}</div>
        </header>
        <div className={`${ROOT}__content`}>
          {this.props.dailyTrack.recordItemList.map(this.renderTask)}
          <Summary
            sumTaskTime={this.props.dailyTrack.sumTaskTime}
            note={this.props.dailyTrack.note}
          />
        </div>
      </section>
    );
  }
}
