import { connect } from 'react-redux';

import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { actions } from '../modules/toast';

import Component from '../components/Toast';

type OwnProps = Partial<
  Pick<React.ComponentProps<typeof Component>, 'message'>
>;

const mapStateToProps = (state: { common: State }, ownProps: OwnProps) => ({
  isShow: state.common.toast.isShow,
  message: ownProps.message || state.common.toast.message,
  variant: state.common.toast.variant,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onClick: () => dispatch(actions.hide()),
  onExit: () => dispatch(actions.reset()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component) as React.ComponentType<OwnProps>;
