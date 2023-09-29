import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { actions as assignmentListUIActions } from '../../../modules/job/ui/assignmentList';

import { State } from '../../../reducers';

import ChangePeriodDialog from '../../../presentational-components/Job/jobAssignmentDialogs/ChangePeriodDialog';

const mapStateToProps = (state: State) => {
  return {
    selectedIds: state.job.ui.assignmentList.selectedIds,
    validDateFrom: state.job.ui.assignmentList.editingValidPeriod.from,
    validDateThrough: state.job.ui.assignmentList.editingValidPeriod.through,
    minValidDateFrom: state.job.entities.baseRecord.validDateFrom,
    maxValidDateTo: state.job.entities.baseRecord.validDateTo,
    canSubmit: state.job.ui.assignmentList.editingValidPeriod.from !== '',
    jobId: state.job.entities.baseRecord.id,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      cancel: assignmentListUIActions.endValidPeriodUpdating,
      updateValidDateFrom:
        assignmentListUIActions.updateValidPeriodBoundKey('from'),
      updateValidDateThrough:
        assignmentListUIActions.updateValidPeriodBoundKey('through'),
      submit: assignmentListUIActions.bulkUpdateJobAssignments,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  submit: () => {
    dispatchProps.submit(
      {
        ids: stateProps.selectedIds,
        validDateFrom: stateProps.validDateFrom,
        validDateThrough: stateProps.validDateThrough,
        minValidDateFrom: stateProps.minValidDateFrom,
        maxValidDateTo: stateProps.maxValidDateTo,
      },
      stateProps.jobId
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ChangePeriodDialog) as React.ComponentType<Record<string, any>>;
