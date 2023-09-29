import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as uiActions } from '../modules/widgets/PersonalMenuPopover/ui';

import PersonalMenuPopoverButton from '../components/PersonalMenuPopoverButton';

const mapStateToProps = (state) => ({
  language: state.common.userSetting.language,
  standalone: state.common.standaloneMode.enabled,
  pendingRequestCount:
    state.widgets.SwitchApproverDialog &&
    state.widgets.SwitchApproverDialog.entities.pendingRequestCount,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClick: uiActions.toggle,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalMenuPopoverButton);
