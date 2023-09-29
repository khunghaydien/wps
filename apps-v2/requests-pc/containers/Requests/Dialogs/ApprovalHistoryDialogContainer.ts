import { connect } from 'react-redux';

import { State } from '../../../modules';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

import ApprovalHistoryDialog, {
  Props,
} from '../../../../../widgets/dialogs/ApprovalHistoryDialog';

const mapStateToProps = (state: State) => ({
  historyList: state.entities.exp.approval.request.history.historyList,
});

const mapDispatchToProps = {};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  onHide: () => {
    ownProps.onClickHideDialogButton();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApprovalHistoryDialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
