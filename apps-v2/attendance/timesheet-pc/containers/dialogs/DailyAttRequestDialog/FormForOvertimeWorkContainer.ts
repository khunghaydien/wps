import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/overtimeWorkRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForOvertimeWork';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.overtimeWorkRequest.request,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
