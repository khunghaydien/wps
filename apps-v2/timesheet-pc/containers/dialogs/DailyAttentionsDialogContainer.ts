import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import * as DailyRemarksActions from '../../action-dispatchers/DailyAttentions';

import DailyAttentionsDialog from '../../components/dialogs/DailyAttentionsDialog';

const mapStateToProps = (state: any) => ({
  isHide: !state.ui.dailyAttentions.messages.length,
  messages: state.ui.dailyAttentions.messages,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onHide: DailyRemarksActions.hideDailyAttentionsDialog,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyAttentionsDialog) as React.ComponentType;
