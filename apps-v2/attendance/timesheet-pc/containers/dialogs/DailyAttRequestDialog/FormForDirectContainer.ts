import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/directRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForDirect';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.directRequest.request,
    hasRange: state.ui.dailyRequest.requests.directRequest.hasRange,
    maxRestTimesCount: state.entities.timesheet.dailyRestCountLimit,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
  onUpdateHasRange: actions.updateHasRange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
