import { connect } from 'react-redux';

import JobSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/JobSelect';

import { State } from '../../../modules';

import {
  getJobList,
  getJobSearchResult,
  getNextJobList,
} from '../../../action-dispatchers/Job';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  jobList: state.ui.expenses.dialog.jobSelect.list.selectionList,
  jobSearchList: state.ui.expenses.dialog.jobSelect.list.searchList,
  jobRecentItems: state.ui.expenses.dialog.jobSelect.list.recentItems,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  hintMsg:
    ownProps.recordIdx === -1
      ? state.entities.exp.customHint.reportHeaderJob
      : state.entities.exp.customHint.recordJob,
  employeeId: state.userSetting.employeeId,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  hasMore: state.ui.expenses.dialog.jobSelect.list.hasMore,
});

const mapDispatchToProps = {
  getJobList,
  getJobSearchResult,
  getNextJobList,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickJobSelectByCategory: () => {
    dispatchProps.getJobList(null, ownProps.expReport.scheduledDate || '');
  },
  onClickJobSearch: (keyword) => {
    dispatchProps.getJobSearchResult(
      keyword,
      ownProps.expReport.scheduledDate || '',
      stateProps.employeeId
    );
  },
  // @ts-ignore
  onClickJobListItem: (item, items) => {
    if (item.hasChildren && items !== undefined) {
      dispatchProps.getNextJobList(
        item,
        items,
        item.id,
        ownProps.expReport.scheduledDate || ''
      );
    } else {
      const recordIdx = ownProps.recordIdx;
      // if no record be selected, set job info to report header, otherwise set to selected record
      if (recordIdx === -1) {
        ownProps.onChangeEditingExpReport(`report.jobId`, item.id, true);
        ownProps.onChangeEditingExpReport(
          `report.jobName`,
          item.name,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.jobCode`,
          item.code,
          true,
          false
        );
      } else {
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].jobId`,
          item.id,
          true
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].jobName`,
          item.name,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].jobCode`,
          item.code,
          true,
          false
        );
      }
      ownProps.hideDialog();
      ownProps.clearDialog();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(JobSelect) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
