import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';

import {
  actions as listActions,
  requestListSelector,
} from '../../modules/entities/timeTrack/list';

import TimeTracking from '../../action-dispatchers/TimeTracking';

import List from '../../components/TrackinglProcessListPane/List';

type Props = {
  browseList?: any;
  requestList?: any;
  browseDetail?: any;
  selectedRequestId?: any;
};

class ListContainer extends React.Component<Props> {
  static propTypes = {
    requestList: PropTypes.array.isRequired,
    browseList: PropTypes.func.isRequired,
    browseDetail: PropTypes.func.isRequired,
    selectedRequestId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.browseList();
  }

  render() {
    return (
      <List
        requestList={this.props.requestList}
        browseDetail={this.props.browseDetail}
        selectedRequestId={this.props.selectedRequestId}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    requestList: requestListSelector(state),
    selectedRequestId: state.entities.timeTrack.detail.requestId,
  };
};

const mapDispatchToProps = (dispatch) => {
  const timeTrackActions = TimeTracking(dispatch);
  return {
    browseList: bindActionCreators(listActions.browse, dispatch),
    browseDetail: timeTrackActions.fetch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListContainer);
