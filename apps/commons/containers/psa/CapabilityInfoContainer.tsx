import { connect } from 'react-redux';

import CapabilityInfo from '@apps/commons/components/psa/EmployeeCapabilityInfo/index';

import { hideDialog } from '@psa/action-dispatchers/PSA';

const mapStateToProps = (state) => ({
  employeeCapabilityInfo: state.entities.psa.capabilityInfo,
});

const mapDispatchToProps = {
  hideDialog,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CapabilityInfo);
