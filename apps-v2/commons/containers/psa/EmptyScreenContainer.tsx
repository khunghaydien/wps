import { connect } from 'react-redux';

import EmptyScreenPlaceholder from '../../components/psa/EmptyScreenPlaceholder';

const mapStateToProps = (state) => ({
  loadingDepth: state.common.app.loadingDepth,
});

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  showEmptyScreen: stateProps.loadingDepth === 0,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EmptyScreenPlaceholder);
