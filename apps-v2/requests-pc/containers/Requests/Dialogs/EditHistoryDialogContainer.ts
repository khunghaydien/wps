import { connect } from 'react-redux';

import { State } from '@apps/requests-pc/modules';

import { Props as OwnProps } from '@apps/requests-pc/components/Requests/Dialog';

import EditHistoryDialog, {
  Props,
} from '../../../../../widgets/dialogs/EditHistoryDialog';

const mapStateToProps = (state: State) => ({
  modificationList:
    state.entities.exp.financeApprovalPreRequest.modificationList,
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
