import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/earlyStartWorkRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForEarlyStartWork';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.earlyStartWorkRequest.request,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
