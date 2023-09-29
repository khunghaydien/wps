import { connect } from 'react-redux';

import Component, {
  Props,
} from '../../../components/organisms/commons/SystemConfirm';

import { State } from '../../../modules';

const mapStateToProps = (state: State, _ownProps): Props => ({
  message: state.mobileCommons.confirm.message,
  callback: state.mobileCommons.confirm.callback,
});

export default connect(mapStateToProps)(Component as any);
