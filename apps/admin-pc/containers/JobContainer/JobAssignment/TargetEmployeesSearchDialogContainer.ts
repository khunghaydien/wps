import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  cancelEmployeeSelection,
  decideCandidates,
  deleteACandidate,
  LIMIT_NUMBER,
  searchEmployees,
  selectCandidates,
  toggleSelection,
} from '../../../modules/job/ui/assignment';

import { State } from '../../../reducers';

import TargetEmployeesSearchDialog from '../../../presentational-components/Job/jobAssignmentDialogs/TargetEmployeesSearchDialog/index';

const mapStateToProps = (state: State) => {
  return {
    foundEmployees: state.job.ui.assignment.foundEmployees,
    candidates: state.job.ui.assignment.candidates,
    validDateFrom: state.job.ui.assignment.validDateFrom,
    companyId: state.base.menuPane.ui.targetCompanyId,
    isExceededLimit: state.job.ui.assignment.isExceededLimit,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      cancel: cancelEmployeeSelection,
      toggleSelection,
      selectCandidates,
      deleteACandidate,
      decideCandidates,
      search: searchEmployees,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  selectCandidates: () =>
    dispatchProps.selectCandidates(stateProps.foundEmployees),
  decideCandidates: () => dispatchProps.decideCandidates(stateProps.candidates),
  search: (query) =>
    dispatchProps.search({
      ...query,
      targetDate: stateProps.validDateFrom,
      companyId: stateProps.companyId,
      limitNumber: LIMIT_NUMBER + 1,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TargetEmployeesSearchDialog) as React.ComponentType<Record<string, any>>;
