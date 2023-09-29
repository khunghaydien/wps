import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createSelector } from 'reselect';

import { FunctionTypeList } from '../../constants/functionType';

import { Job } from '../../../domain/models/organization/Job';
import {
  defaultValue as defaultJobHistory,
  JobHistory,
} from '../../../domain/models/organization/JobHistory';

import { openNewAssignment } from '../../modules/job/ui/assignment';
import { actions as assignmentListUIActions } from '../../modules/job/ui/assignmentList';

import * as jobDetailActions from '../../action-dispatchers/job/Detail';
import * as jobListActions from '../../action-dispatchers/job/List';
import { searchDepartment } from '../../actions/department';

import { State } from '../../reducers';

import { getter as RecordGetter } from '../../utils/RecordUtil';

import Component from '../../presentational-components/Job/Detail';

const getJobAssignmentList = (state: State) =>
  state.job.entities.assignmentList;

const getSelectedJobAssignmentIds = (state: State) =>
  state.job.ui.assignmentList.selectedIds;

const getConvertedJobAssignmentListAsListItem = createSelector(
  getJobAssignmentList,
  getSelectedJobAssignmentIds,
  (jobAssignmentList, selectedIds) =>
    (jobAssignmentList || []).map((item) => ({
      ...item,
      validDate: { from: item.validDateFrom, through: item.validDateThrough },
      isSelected: selectedIds.includes(item.id),
    }))
);

const mapStateToProps = (state: State) => {
  return {
    currentHistoryId: state.job.ui.detail.selectedHistoryId,
    editRecord: state.job.entities.baseRecord,
    editRecordHistory:
      state.job.entities.historyRecords.find(
        ({ id }) => id === state.job.ui.detail.selectedHistoryId
      ) ?? defaultJobHistory,
    tmpEditRecord: state.job.ui.detail.baseRecord,
    tmpEditRecordHistory: state.job.ui.detail.historyRecord,
    historyRecordList: state.job.entities.historyRecords,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    modeHistory: state.base.detailPane.ui.modeHistory,
    sfObjFieldValues: state.sfObjFieldValues,
    jobAssignmentList: getConvertedJobAssignmentListAsListItem(state),
    showAssignmentArea: Boolean(state.job.ui.detail.baseRecord.id),
    canOperateAssignment:
      state.job.ui.detail.baseRecord.id &&
      state.base.detailPane.ui.modeHistory !== 'revision',
    canExecModifyAssignment:
      state.job.ui.detail.baseRecord.id &&
      state.base.detailPane.ui.modeHistory !== 'revision' &&
      state.job.ui.assignmentList.selectedIds.length > 0,
    isOpeningNewAssignment: state.job.ui.assignment.isOpeningNewAssignment,
    isOpeningChangePeriod: state.job.ui.assignmentList.isOpeningChangePeriod,
    isOpeningEmployeeSelection:
      state.job.ui.assignment.isOpeningEmployeeSelection,
    isShowRevisionDialog: state.base.detailPane.ui.isShowRevisionDialog,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchQuery = useSelector((state: State) => state.job.ui.searchQuery);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const JobListActions = useMemo(
    () => bindActionCreators(jobListActions, dispatch),
    [dispatch]
  );
  const JobDetailActions = useMemo(
    () => bindActionCreators(jobDetailActions, dispatch),
    [dispatch]
  );
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          openNewAssignment,
          openChangeValidPeriod:
            assignmentListUIActions.startValidPeriodUpdating,
          deleteAssignment: assignmentListUIActions.bulkDeleteJobAssignments,
          onAssignmentListRowsSelected: assignmentListUIActions.select,
          onAssignmentListRowsDeselected: assignmentListUIActions.deselect,
          onAssignmentListRowClick: assignmentListUIActions.toggle,
          onAssignmentListFilterChange: assignmentListUIActions.clear,
          searchDepartment,
        },
        dispatch
      ),
    [dispatch]
  );

  const selectedJobId = useSelector(
    (state: State) => state.job.entities.baseRecord.id
  );
  const selectedJobAssignmentIds = useSelector(
    (state: State) => state.job.ui.assignmentList.selectedIds
  );

  const tmpEditRecord = useSelector(
    (state: State) => state.job.ui.detail.baseRecord
  );

  useEffect(() => {
    const param: { companyId?: string; targetDate?: string } = {};
    param.companyId = companyId;
    if (tmpEditRecord.validDateFrom !== '') {
      param.targetDate = tmpEditRecord.validDateFrom;
    }
    Actions.searchDepartment(param);
  }, []);

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const historyValueGetter = RecordGetter(props.tmpEditRecordHistory);
          const result = await JobDetailActions.createRecord(
            companyId,
            {
              ...props.editRecord,
              ...props.editRecordHistory,
            },
            {
              ...props.tmpEditRecord,
              ...props.tmpEditRecordHistory,
            },
            baseValueGetter,
            historyValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          JobListActions.setSelectedRowIndex(-1);
          await JobListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const result = await JobDetailActions.updateBase(
            companyId,
            props.editRecord,
            props.tmpEditRecord,
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          await JobListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          JobListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickUpdateHistoryButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(props.tmpEditRecord);
          const historyValueGetter = RecordGetter(props.tmpEditRecordHistory);
          const result = await JobDetailActions.updateHistory(
            props.editRecordHistory,
            props.tmpEditRecordHistory,
            baseValueGetter,
            historyValueGetter,
            useFunction,
            companyId
          );
          if (!result) {
            return;
          }
          await JobListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await JobDetailActions.removeBase(props.editRecord.id);
          if (!result) {
            return;
          }
          JobListActions.setSelectedRowIndex(-1);
          await JobListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickDeleteHistoryButton={() => {
        (async () => {
          const result = await JobDetailActions.removeHistory(
            props.currentHistoryId,
            props.editRecord.id,
            searchQuery.targetDate
          );
          if (!result) {
            return;
          }
          await JobListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeHistory={(value: string) => {
        JobDetailActions.changeHistory(value, props.historyRecordList);
      }}
      onChangeDetailItem={(key: keyof Job, value: Job[keyof Job]) => {
        JobDetailActions.changeBaseRecordValue(key, value);
      }}
      onChangeDetailItemHistory={(
        key: keyof JobHistory,
        value: JobHistory[keyof JobHistory]
      ) => {
        JobDetailActions.changeHistoryRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        JobListActions.setSelectedRowIndex(-1);
        JobDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        JobDetailActions.cancelEditing(
          props.editRecord,
          props.editRecordHistory
        );
      }}
      onClickStartEditingBaseButton={() => {
        JobDetailActions.startEditingBase();
      }}
      onClickNewAssignmentButton={() => {
        Actions.openNewAssignment();
      }}
      openChangeValidPeriod={() => {
        Actions.openChangeValidPeriod();
      }}
      deleteAssignment={() => {
        Actions.deleteAssignment(
          {
            ids: selectedJobAssignmentIds,
          },
          selectedJobId
        );
      }}
      onAssignmentListRowsSelected={(ids: string[]) => {
        Actions.onAssignmentListRowsSelected(ids);
      }}
      onAssignmentListRowsDeselected={(ids: string[]) => {
        Actions.onAssignmentListRowsDeselected(ids);
      }}
      onAssignmentListRowClick={(id: string) => {
        Actions.onAssignmentListRowClick(id);
      }}
      onAssignmentListFilterChange={() => {
        Actions.onAssignmentListFilterChange();
      }}
      onClickShowRevisionDialogButton={() => {
        JobDetailActions.showRevisionDialog();
      }}
      onClickStartEditingHistoryButton={(params: {
        targetDate: string;
        comment: string;
      }) => {
        JobDetailActions.startEditingHistory(params);
      }}
    />
  );
};

export default DetailContainer;
