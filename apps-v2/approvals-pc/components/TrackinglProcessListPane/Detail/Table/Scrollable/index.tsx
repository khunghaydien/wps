import React from 'react';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';

import Row from '../Row';
import Header from './Header';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-table-scrollable';

type Props = {
  trackList: Array<DailyTrackList[string]>;
  showComment: boolean;
  isEllipsis: boolean;
};

export default class Scrollabele extends React.Component<Props> {
  renderRow = (track) => {
    return (
      <Row
        key={track.dateStr}
        dateStr={track.dateStr}
        dailyTrack={track.dailyTrack}
        showComment={this.props.showComment}
        isEllipsis={this.props.isEllipsis}
      />
    );
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <Header showComment={this.props.showComment} />
        {this.props.trackList.map(this.renderRow)}
      </div>
    );
  }
}
