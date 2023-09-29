import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import PaneExpandWrapper from '../../components/PaneExpandWrapper';

import DetailContainer from './DetailContainer';
import ListContainer from './ListContainer';

type Props = {
  isExpanded?: any;
};

class TrackingProcessListPaneContainer extends React.Component<Props> {
  static propTypes = {
    isExpanded: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <PaneExpandWrapper
        detailExpanded={this.props.isExpanded}
        list={<ListContainer />}
        detail={<DetailContainer />}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isExpanded: state.ui.timeTrack.isExpanded,
  };
};

export default connect(mapStateToProps)(TrackingProcessListPaneContainer);
