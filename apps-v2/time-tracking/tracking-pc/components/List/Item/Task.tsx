import React from 'react';

import TextUtil from '@commons/utils/TextUtil';
import TimeUtil from '@commons/utils/TimeUtil';

import {
  TaskForMonthlyReport,
  TaskForMonthlyReportSummary,
} from '@apps/domain/models/time-tracking/Task';

import TaskUtil from '../../../utils/TaskUtil';

import '../column.scss';
import './Task.scss';

const ROOT = 'tracking-pc-list-item-task';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  index: number;
  taskList: Record<string, TaskForMonthlyReportSummary>;
  task: TaskForMonthlyReport;
};

export default class Task extends React.Component<Props> {
  render() {
    const taskMeta = this.props.taskList[this.props.task.id];
    const barStyle = {
      width: `${this.props.task.graphRatio}%`,
      backgroundColor: taskMeta.barColor,
    };
    return (
      <div className={`${ROOT}`}>
        <div
          className={`${ROOT}__item ${ROOT}__item--name ${COLUMN_ROOT}--name`}
        >
          <div className={`${ROOT}__task-index`}>{this.props.index + 1}</div>
          <div className={`${ROOT}__task-name`}>
            {TaskUtil.createTaskName(this.props.task)}
          </div>
        </div>
        <div className={`${ROOT}__item ${COLUMN_ROOT}--tracking-graph`}>
          <div
            className={`${ROOT}__item ${ROOT}__tracking-graph`}
            style={barStyle}
          />
        </div>
        <div
          className={`${ROOT}__item ${ROOT}__item--work-time ${COLUMN_ROOT}--work-time`}
        >
          {TimeUtil.toHHmm(this.props.task.taskTime)}
        </div>
        <div
          className={`${ROOT}__item ${ROOT}__item--comment ${COLUMN_ROOT}--comment`}
        >
          <p>{TextUtil.nl2br(this.props.task.taskNote)}</p>
        </div>
      </div>
    );
  }
}
