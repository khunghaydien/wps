import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Tracking from '../components';

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (_dispatch: Dispatch) => ({});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Tracking);
