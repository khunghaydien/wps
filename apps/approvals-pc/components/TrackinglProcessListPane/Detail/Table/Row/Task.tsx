import React from 'react';

import classNames from 'classnames';

import TextUtil from '@commons/utils/TextUtil';
import TimeUtil from '@commons/utils/TimeUtil';

import { TaskForMonthlyReport } from '@apps/domain/models/time-tracking/Task';

import TaskUtil from '../../../../../../time-tracking/tracking-pc/utils/TaskUtil';

import '../column.scss';
import './Task.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table-row-task';
const COLUMN_ROOT =
  'approvals-pc-tracking-process-list-pane-detail-table-column';

type Props = {
  index: number;
  task: TaskForMonthlyReport;
  showComment: boolean;
  isEllipsis: boolean;
};

export default class Task extends React.Component<Props> {
  render() {
    const cssClass = classNames(ROOT, {
      [`${ROOT}--is-ellipsis`]: this.props.isEllipsis,
    });

    return (
      <div className={cssClass}>
        <div
          className={`${ROOT}__item ${ROOT}__item--name ${COLUMN_ROOT}--name`}
        >
          <div className={`${ROOT}__task-name`}>
            <div className={`${ROOT}__task-index`}>{this.props.index + 1}</div>

            {TaskUtil.createTaskName(this.props.task)}
          </div>
        </div>

        <div
          className={`${ROOT}__item ${ROOT}__item--work-time ${COLUMN_ROOT}--work-time`}
        >
          <div className={`${ROOT}__work-time`}>
            {TimeUtil.toHHmm(this.props.task.taskTime)}
          </div>
        </div>

        {this.props.showComment && (
          <div
            className={`${ROOT}__item ${ROOT}__item--comment ${COLUMN_ROOT}--comment`}
          >
            <p>{TextUtil.nl2br(this.props.task.taskNote)}</p>
          </div>
        )}
      </div>
    );
  }
}
