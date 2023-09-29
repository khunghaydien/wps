import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as jobGrade from '../actions/jobGrade';
import { searchPSAGroup } from '../actions/psaGroup';

import JobGrade from '../presentational-components/JobGrade';

export function getJobGradeList(state: any) {
  const { jobGradeList } = state.entities;

  if (jobGradeList && jobGradeList.length > 0) {
    return jobGradeList.map((jobGradeItem) => ({
      id: jobGradeItem.id,
      value: jobGradeItem.id,
      label: jobGradeItem.name,
      costRate:
        jobGradeItem.costRate && jobGradeItem.costRate !== null
          ? jobGradeItem.costRate
          : 0,
      billRate:
        jobGradeItem.billingRate && jobGradeItem.billingRate !== null
          ? jobGradeItem.billingRate
          : 0,
      code: jobGradeItem.code,
    }));
  }

  return jobGradeList;
}
const mapStateToProps = (state) => ({
  itemList: state.searchJobGrade,
  searchCompanySetting: state.searchCompany,
  editRecord: state.editRecord,
  searchPSAGroup: state.searchPSAGroup,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: jobGrade.searchJobGrade,
      create: jobGrade.createJobGrade,
      update: jobGrade.updateJobGrade,
      delete: jobGrade.deleteJobGrade,
      searchPSAGroup,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobGrade) as React.ComponentType<Record<string, any>>;
