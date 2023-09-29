import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ApprovalHistory } from '../../../../domain/models/approval/request/History';

import { selectors as historyListSelectors } from '../../../../../widgets/dialogs/ApprovalHistoryDialog/modules/entities/historyList';
import { State } from '../../modules';
import { actions as approvalHistoryActions } from '../../modules/ui/approvalHistory';

import ApprovalHistoryDialog from '../../../../../widgets/dialogs/ApprovalHistoryDialog';

type Props = {
  isOpen: boolean;
  close: () => void;
  historyList: ApprovalHistory[];
};

class ApprovalHistoryDialogContainer extends React.Component<Props> {
  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <ApprovalHistoryDialog
        historyList={this.props.historyList}
        onHide={this.props.close}
      />
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    isOpen: state.ui.approvalHistory.isOpen,
    historyList: historyListSelectors.historyListSelector(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    close: bindActionCreators(approvalHistoryActions.close, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApprovalHistoryDialogContainer) as React.ComponentType;
