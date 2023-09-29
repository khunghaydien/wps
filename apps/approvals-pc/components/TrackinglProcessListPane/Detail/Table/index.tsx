import React from 'react';

import moment from 'moment';

import DateUtil from '@commons/utils/DateUtil';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';

import Scrollable from './Scrollable';

import './index.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table';

type Props = {
  dailyTrackList: DailyTrackList;
  taskList: any;
  startDate: string;
  endDate: string;
  isExpand: boolean;
};

export default class Table extends React.Component<Props> {
  createList() {
    if (this.props.startDate === '' || this.props.endDate === '') {
      return null;
    }

    const startDate = moment(this.props.startDate).startOf('day');
    const endDate = moment(this.props.endDate).endOf('day');

    const trackList = [];
    let monthCheck = null;
    while (startDate.isBefore(endDate)) {
      const nowMonth = startDate.month();
      let dateStr;
      if (nowMonth !== monthCheck) {
        monthCheck = nowMonth;
        dateStr = DateUtil.formatMDW(startDate.valueOf() as any);
      } else {
        dateStr = DateUtil.format(startDate.valueOf(), 'D ddd');
      }

      const keyDateStr = DateUtil.formatISO8601Date(startDate.valueOf());
      const dailyTrack = this.props.dailyTrackList[keyDateStr]
        ? this.props.dailyTrackList[keyDateStr]
        : { recordItemList: [] };

      if (dailyTrack && dailyTrack.recordItemList.length > 0) {
        trackList.push({
          dateStr,
          dailyTrack,
          taskList: this.props.taskList,
        });
      } else {
        trackList.push({
          dateStr,
        });
      }

      startDate.add(1, 'days');
    }

    return trackList;
  }

  render() {
    const trackList = this.createList();

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__scrollable`}>
          <Scrollable
            trackList={trackList}
            showComment={this.props.isExpand}
            isEllipsis={!this.props.isExpand}
          />
        </div>
      </div>
    );
  }
}
