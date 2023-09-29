import { connect } from 'react-redux';

import Component, {
  Props,
} from '../../../components/organisms/commons/SystemAlert';

import { State } from '../../../modules';

const mapStateToProps = (state: State, _ownProps): Props => ({
  message: state.mobileCommons.alert.message,
  callback: state.mobileCommons.alert.callback,
});

export default connect(mapStateToProps)(Component as any);
