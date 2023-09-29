import { connect } from 'react-redux';

import get from 'lodash/get';

import JobSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/JobSelect';
import { updateChildItemJob } from '@commons/utils/exp/ItemizationUtil';

import { isItemizedRecord } from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';

import {
  getJobList,
  getJobSearchResult,
  getNextJobList,
} from '../../../action-dispatchers/Job';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const { isFinanceApproval } = ownProps;
  const uiPath = isFinanceApproval ? 'requests' : 'expenses';
  let subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  if (isFinanceApproval)
    subroleId = get(ownProps, 'expReport.empHistoryId', subroleId);
  return {
    jobList: state.ui[uiPath].dialog.jobSelect.list.selectionList,
    jobSearchList: state.ui[uiPath].dialog.jobSelect.list.searchList,
    jobRecentItems: state.ui[uiPath].dialog.jobSelect.list.recentItems,
    isLoading: !!state.ui.expenses.dialog.isLoading,
    hintMsg:
      ownProps.recordIdx === -1
        ? state.entities.exp.customHint.reportHeaderJob
        : state.entities.exp.customHint.recordJob,
    employeeId: state.userSetting.employeeId,
    selectedDelegator: state.ui[uiPath].delegateApplicant.selectedEmployee,
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    hasMore: state.ui[uiPath].dialog.jobSelect.list.hasMore,
    subroleId,
  };
};

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
    dispatchProps.getJobList(
      null,
      ownProps.expReport.scheduledDate || '',
      stateProps.subroleId,
      ownProps.expReport.employeeBaseId || stateProps.employeeId
    );
  },
  onClickJobSearch: (keyword) => {
    dispatchProps.getJobSearchResult(
      keyword,
      ownProps.expReport.scheduledDate || '',
      ownProps.expReport.employeeBaseId || stateProps.employeeId,
      stateProps.subroleId,
      stateProps.selectedCompanyId
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
        const recordItemIdx = ownProps.recordItemIdx || 0;
        const itemList = get(
          ownProps.expReport,
          `records.${recordIdx}.items`,
          []
        );
        const isItemizedParent =
          recordItemIdx === 0 && isItemizedRecord(itemList.length);

        if (isItemizedParent) {
          const newItemList = updateChildItemJob(
            itemList,
            ownProps.expReport.jobId
          );
          ownProps.onChangeEditingExpReport(
            `report.records[${recordIdx}].items`,
            newItemList,
            false,
            false
          );
        }

        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].jobId`,
          item.id,
          true
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].jobName`,
          item.name,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].jobCode`,
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
