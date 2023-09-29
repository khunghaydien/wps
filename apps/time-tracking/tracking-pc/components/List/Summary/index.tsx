import React from 'react';

import msg from '@commons/languages';
import TimeUtil from '@commons/utils/TimeUtil';

import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

import Item from './Item';

import '../column.scss';
import './index.scss';

const ROOT = 'tracking-pc-list-summary';
const COLUMN_ROOT = 'tracking-pc-list-column';

type Props = {
  taskList: Record<string, TaskForMonthlyReportSummary>;
  taskIdList: string[];
  allTaskSum: number;
};

export default class Summary extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(id) {
    return <Item key={id} task={this.props.taskList[id]} />;
  }

  render() {
    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__header`}>
          <div className={`${ROOT}__header-item ${COLUMN_ROOT}--name`}>
            {msg().Trac_Lbl_Job}/{msg().Trac_Lbl_WorkCategory}
          </div>
          <div
            className={`${ROOT}__header-item ${COLUMN_ROOT}--tracking-graph`}
          >
            {msg().Trac_Lbl_WorkTimeGraph}
          </div>
          <div className={`${ROOT}__header-item ${COLUMN_ROOT}--work-time`}>
            {msg().Trac_Lbl_Work}
          </div>
        </header>

        {this.props.taskIdList.map(this.renderItem)}

        <footer className={`${ROOT}__footer`}>
          <div className={`${ROOT}__footer-item ${COLUMN_ROOT}--name`} />
          <div
            className={`${ROOT}__footer-item ${ROOT}__sum-label ${COLUMN_ROOT}--tracking-graph`}
            id={`${ROOT}__sum-label`}
          >
            {msg().Trac_Lbl_Total}
          </div>
          <div
            className={`${ROOT}__footer-item ${ROOT}__sum-value ${COLUMN_ROOT}--work-time`}
            aria-labelledby={`${ROOT}__sum-label`}
          >
            {TimeUtil.toHHmm(this.props.allTaskSum)}
          </div>
        </footer>
      </section>
    );
  }
}
