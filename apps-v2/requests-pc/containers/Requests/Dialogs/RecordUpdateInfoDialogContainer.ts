import { connect } from 'react-redux';

import RecordUpdatedInfo, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordUpdatedInfo';

import { State } from '../../../modules';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State) => ({
  updateInfo: state.ui.expenses.dialog.recordUpdated.dialog.updateInfo,
});

const mapDispatchToProps = {};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordUpdatedInfo) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
