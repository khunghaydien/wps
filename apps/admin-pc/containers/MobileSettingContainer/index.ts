import { connect } from 'react-redux';

import { actions as entityActions } from '../../modules/mobileSetting/entities';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import MobileSetting, {
  Props,
} from '../../presentational-components/MobileSetting';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
});

const mapDispatchToProps = (dispatch) => ({
  onInitialize: (stateProps) => {
    dispatch(entityActions.clear());
    dispatch(entityActions.fetch(stateProps.companyId));
  },
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onInitialize: () => dispatchProps.onInitialize(stateProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MobileSetting) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
