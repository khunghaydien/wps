import React from 'react';

import TimeUtil from '../../../../../commons/utils/TimeUtil';

import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

import TaskUtil from '../../../utils/TaskUtil';

import '../column.scss';
import './Item.scss';

const ROOT = 'tracking-pc-list-summary-item';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  task: TaskForMonthlyReportSummary;
};

export default class Item extends React.Component<Props> {
  render() {
    const graphStyle = {
      width: `${this.props.task.graphRatio}%`,
      backgroundColor: this.props.task.barColor,
    };
    return (
      <div className={`${ROOT}`}>
        <div
          className={`${ROOT}__subitem ${ROOT}__subitem--name ${COLUMN_ROOT}--name`}
        >
          {TaskUtil.createTaskName(this.props.task)}
        </div>
        <div className={`${ROOT}__subitem ${COLUMN_ROOT}--tracking-graph`}>
          <div className={`${ROOT}__graph`} style={graphStyle} />
        </div>
        <div
          className={`${ROOT}__subitem ${ROOT}__subitem--work-time ${COLUMN_ROOT}--work-time`}
        >
          {TimeUtil.toHHmm(this.props.task.taskTimeSum)}
        </div>
      </div>
    );
  }
}
