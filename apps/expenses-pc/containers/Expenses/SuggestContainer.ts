import { connect } from 'react-redux';

import Suggest from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/Suggest';

import { getStation } from '../../action-dispatchers/Suggest';

const mapStateToProps = (state, ownProps) => ({
  ...state,
  ...ownProps,
});

const mapDispatchToProps = {
  onClickSearchStationButton: getStation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Suggest) as React.ComponentType<Record<string, any>>;
