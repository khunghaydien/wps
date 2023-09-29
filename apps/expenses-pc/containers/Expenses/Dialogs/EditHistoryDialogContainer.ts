import { connect } from 'react-redux';

import { State } from '../../../modules';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

import EditHistoryDialog, {
  Props,
} from '../../../../../widgets/dialogs/EditHistoryDialog';

const mapStateToProps = (state: State) => ({
  modificationList: state.entities.exp.financeApproval.modificationList,
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
)(EditHistoryDialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
