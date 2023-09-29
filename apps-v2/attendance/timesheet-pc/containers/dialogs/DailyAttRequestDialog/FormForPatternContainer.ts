import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/patternRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForPattern';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.patternRequest.request,
    attPatternList:
      state.ui.dailyRequest.requests.patternRequest.attPatternList,
    selectedAttPattern:
      state.ui.dailyRequest.requests.patternRequest.selectedAttPattern,
    hasRange: state.ui.dailyRequest.requests.patternRequest.hasRange,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
  onUpdateHasRange: actions.updateHasRange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
