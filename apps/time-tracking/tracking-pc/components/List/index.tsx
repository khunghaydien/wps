import React from 'react';

import moment from 'moment';

import DateUtil from '@commons/utils/DateUtil';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

import EmptyItem from './EmptyItem';
import Header from './Header';
import Item from './Item';
import Summary from './Summary';

import './index.scss';

const ROOT = 'tracking-pc-list';

type Props = {
  dailyTrackList: DailyTrackList;
  taskList: Record<string, TaskForMonthlyReportSummary>;
  taskIdList: string[];
  allTaskSum: number;
  startDate: string;
  endDate: string;
};

export default class List extends React.Component<Props> {
  renderCalendar() {
    if (this.props.startDate === '' || this.props.endDate === '') {
      return null;
    }

    const startDate = moment(this.props.startDate).startOf('day');
    const endDate = moment(this.props.endDate).endOf('day');
    const itemList = [];
    let monthCheck = null;

    while (startDate.isBefore(endDate)) {
      const nowMonth = startDate.month();
      let dateStr;

      if (nowMonth !== monthCheck) {
        monthCheck = nowMonth;
        dateStr = DateUtil.format(startDate.valueOf(), 'M/D dd');
      } else {
        dateStr = DateUtil.format(startDate.valueOf(), 'D dd');
      }

      const keyDateStr = DateUtil.formatISO8601Date(startDate.valueOf());
      const dailyTrack =
        this.props.dailyTrackList[keyDateStr] || ({} as DailyTrackList[string]);

      if (dailyTrack?.recordItemList?.length > 0) {
        itemList.push(
          <Item
            key={dateStr}
            dateStr={dateStr}
            dailyTrack={dailyTrack}
            taskList={this.props.taskList}
          />
        );
      } else {
        itemList.push(
          <EmptyItem dateStr={dateStr} key={dateStr} note={dailyTrack.note} />
        );
      }

      startDate.add(1, 'days');
    }

    return itemList;
  }

  render() {
    return (
      <div className={`${ROOT}`}>
        <Header />
        <div className={`${ROOT}__item-container`}>
          {this.renderCalendar()}
          <div className={`${ROOT}__summary-wrapper`}>
            <Summary
              taskList={this.props.taskList}
              taskIdList={this.props.taskIdList}
              allTaskSum={this.props.allTaskSum}
            />
          </div>
        </div>
      </div>
    );
  }
}
