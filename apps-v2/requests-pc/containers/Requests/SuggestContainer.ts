import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Suggest from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/Suggest';

import { getStation } from '../../action-dispatchers/Suggest';

const mapStateToProps = (state, ownProps) => {
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(selectedDelegator);
  const subroleId = isProxyMode
    ? undefined
    : get(state, 'ui.expenses.subrole.selectedRole');
  return {
    subroleId,
    ...state,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  onClickSearchStationButton: getStation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Suggest) as React.ComponentType<Record<string, any>>;
