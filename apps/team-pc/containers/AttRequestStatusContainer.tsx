import { connect } from 'react-redux';

import { getTargetDate } from '../../domain/models/team/AttSummaryPeriodList';

import { State } from '../modules';
import { actions as UiTableActions } from '../modules/ui/attRequestStatus/table';

import * as AttRequestStatusActions from '../action-dispatchers/AttRequestStatus';
import { openDialog as openDepartmentSelectDialog } from '../action-dispatchers/DepartmentSelectDialog';

import AttRequestStatus from '../components/AttRequestStatus';

const mapStateToProps = (state: State) => ({
  targetDate: getTargetDate(
    state.ui.attRequestStatus.periods.current,
    state.entities.attSummaryPeriodList
  ),
  companyId: state.common.userSetting.companyId,
  departmentId: state.ui.attRequestStatus.departmentSelectDialog
    .selectedDepartment
    ? state.ui.attRequestStatus.departmentSelectDialog.selectedDepartment.id
    : state.common.userSetting.departmentId,
  departmentName: state.ui.attRequestStatus.departmentSelectDialog
    .selectedDepartment
    ? state.ui.attRequestStatus.departmentSelectDialog.selectedDepartment.name
    : state.common.userSetting.departmentName,
  recordsAll: state.entities.attSummary.records,
  periodOptions: state.ui.attRequestStatus.periods.options,
  currentPeriod: state.ui.attRequestStatus.periods.current,
  prevPeriod: state.ui.attRequestStatus.periods.prev,
  nextPeriod: state.ui.attRequestStatus.periods.next,
  hasPrevPeriod: !!state.ui.attRequestStatus.periods.prev,
  hasNextPeriod: !!state.ui.attRequestStatus.periods.next,
  records: state.ui.attRequestStatus.table.records,
  workingTypeNameOptions:
    state.ui.attRequestStatus.table.workingTypeNameOptions,
  closingDateOptions: state.ui.attRequestStatus.table.closingDateOptions,
  filterTerms: state.ui.attRequestStatus.table.filterTerms,
  onClickOpenTimesheetWindowButton: AttRequestStatusActions.openTimesheetWindow,
});

const mapDispatchToProps = {
  onChangePeriod: AttRequestStatusActions.changePeriod,
  onOpenDepartmentSelectDialog: openDepartmentSelectDialog,
  onUpdateFilterTerm: UiTableActions.updateFilterTerm,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onChangePeriod: (value) =>
    dispatchProps.onChangePeriod(stateProps.departmentId, value),
  onClickThisPeriod: () =>
    dispatchProps.onChangePeriod(stateProps.departmentId),
  onClickNextPeriod: () =>
    dispatchProps.onChangePeriod(
      stateProps.departmentId,
      stateProps.nextPeriod
    ),
  onClickPrevPeriod: () =>
    dispatchProps.onChangePeriod(
      stateProps.departmentId,
      stateProps.prevPeriod
    ),
  onUpdateFilterTerm: (key, value) =>
    dispatchProps.onUpdateFilterTerm(key, value, stateProps.recordsAll),
  onOpenDepartmentSelectDialog: () =>
    dispatchProps.onOpenDepartmentSelectDialog(
      stateProps.targetDate,
      stateProps.companyId
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AttRequestStatus);
