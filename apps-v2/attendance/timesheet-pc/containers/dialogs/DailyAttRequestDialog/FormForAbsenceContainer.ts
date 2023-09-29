import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/absenceRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForAbsence';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.absenceRequest.request,
    hasRange: state.ui.dailyRequest.requests.absenceRequest.hasRange,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
  onUpdateHasRange: actions.updateHasRange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
