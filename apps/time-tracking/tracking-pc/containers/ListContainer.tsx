import React from 'react';
import { connect } from 'react-redux';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

import { State } from '../modules';

import List from '../components/List';

type Props = {
  dailyTrackList: DailyTrackList;
  taskList: Record<string, TaskForMonthlyReportSummary>;
  taskIdList: string[];
  allTaskSum: number;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
};

class ListContainer extends React.Component<Props> {
  static defaultProps = {
    startDate: '',
    endDate: '',
  };

  render() {
    return (
      <List
        dailyTrackList={this.props.dailyTrackList}
        taskList={this.props.taskList}
        taskIdList={this.props.taskIdList}
        allTaskSum={this.props.allTaskSum}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
      />
    );
  }
}

const mapStateToProps = (state: State) => ({
  dailyTrackList: state.timeTrack.dailyTrackList,
  taskList: state.timeTrack.taskList.byId,
  taskIdList: state.timeTrack.taskList.allIds,
  allTaskSum: state.timeTrack.allTaskSum,
  startDate: state.timeTrack.overview.startDate,
  endDate: state.timeTrack.overview.endDate,
});

export default connect(mapStateToProps)(ListContainer);
