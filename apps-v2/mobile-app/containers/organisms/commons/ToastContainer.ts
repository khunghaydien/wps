import { connect } from 'react-redux';

import { State } from '../../../modules';

import Component, { Props } from '../../../components/atoms/Toast';

const mapStateToProps = (state: State): Props => ({
  isShow: state.common.toast.isShow,
  message: state.common.toast.message,
});

export default connect(mapStateToProps)(Component);
