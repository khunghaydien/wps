import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  assignJobToEmployees,
  cancelNewAssignment,
  openEmployeeSelection,
  update,
} from '../../../modules/job/ui/assignment';

import { State } from '../../../reducers';

import JobAssignmentDialog from '../../../presentational-components/Job/jobAssignmentDialogs/JobAssignmentDialog';

const mapStateToProps = (state: State) => {
  return {
    employees: state.job.ui.assignment.stagedEmployees,
    validDateThrough: state.job.ui.assignment.validDateThrough,
    validDateFrom: state.job.ui.assignment.validDateFrom,
    minValidDateFrom: state.job.entities.baseRecord.validDateFrom,
    maxValidDateTo: state.job.entities.baseRecord.validDateTo,
    canOpenEmployeeSelection: state.job.ui.assignment.validDateFrom !== '',
    canAssign:
      state.job.ui.assignment.validDateFrom !== '' &&
      state.job.ui.assignment.stagedEmployees &&
      state.job.ui.assignment.stagedEmployees.length > 0,
    hasEmployees: state.job.ui.assignment.stagedEmployees.length > 0,
    jobId: state.job.entities.baseRecord.id,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      open: openEmployeeSelection,
      cancel: cancelNewAssignment,
      updateValidDateThrough: (value) => update('validDateThrough', value),
      updateValidDateFrom: (value) => update('validDateFrom', value),
      assign: assignJobToEmployees,
    },
    dispatch
  );

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  assign: () => {
    dispatchProps.assign({
      jobId: stateProps.jobId,
      validDateThrough: stateProps.validDateThrough,
      minValidDateFrom: stateProps.minValidDateFrom,
      validDateFrom: stateProps.validDateFrom,
      maxValidDateTo: stateProps.maxValidDateTo,
      employees: stateProps.employees,
    });
  },
  open: () => {
    dispatchProps.open(
      stateProps.employees,
      stateProps.validDateFrom,
      stateProps.minValidDateFrom,
      stateProps.validDateThrough,
      stateProps.maxValidDateTo
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(JobAssignmentDialog) as React.ComponentType<Record<string, any>>;
